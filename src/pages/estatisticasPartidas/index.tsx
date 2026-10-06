import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarRange } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import * as relatorioService from '@/services/relatorioService'
import * as timeSocietyService from '@/services/timeSocietyService'
import type { EstatisticaLado, RelatorioEstatistica, SalvarEstatisticaPayload } from '@/types/relatorio'
import type { Campeonato, TimeSociety } from '@/types/escalacao'

const METRICAS: { key: keyof EstatisticaLado; label: string }[] = [
  { key: 'chutesGol', label: 'Chutes a gol' },
  { key: 'chutes', label: 'Chutes' },
  { key: 'escanteios', label: 'Escanteios' },
  { key: 'faltas', label: 'Faltas' },
  { key: 'impedimentos', label: 'Impedimentos' },
  { key: 'cartoesAmarelos', label: 'Cartões amarelos' },
  { key: 'cartoesVermelhos', label: 'Cartões vermelhos' },
  { key: 'passes', label: 'Passes' },
  { key: 'laterais', label: 'Laterais' },
]

function errorMessage(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined
    return data?.message || err.message || fallback
  }
  return fallback
}

function dataJogo(jogo: RelatorioEstatistica) {
  const bruta = jogo.dataPrevista || jogo.dataHora
  if (!bruta) return 'Data a confirmar'
  const [ano, mes, dia] = bruta.slice(0, 10).split('-')
  const hora = jogo.horarioPrevisto?.slice(0, 5) || jogo.dataHora?.slice(11, 16) || ''
  return `${dia}/${mes}/${ano}${hora ? ` · ${hora}` : ''}`
}

function linkCalendario(jogo: RelatorioEstatistica) {
  const params = new URLSearchParams()
  if (jogo.casa.timeId) params.set('timeId', String(jogo.casa.timeId))
  if (jogo.calendarioId) params.set('jogoId', String(jogo.calendarioId))
  const data = (jogo.dataPrevista || jogo.dataHora || '').slice(0, 10)
  if (data) params.set('data', data)
  return `/calendario?${params.toString()}`
}

function numero(lado: EstatisticaLado, key: keyof EstatisticaLado) {
  const valor = lado[key]
  return typeof valor === 'number' ? valor : 0
}

function Barra({ label, casa, visitante }: { label: string; casa: number; visitante: number }) {
  const total = casa + visitante
  const esquerda = total === 0 ? 50 : (casa / total) * 100
  return (
    <div>
      <div className="mb-1 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-emerald-950">
        <span>{casa}</span>
        <span className="text-muted-foreground">{label}</span>
        <span>{visitante}</span>
      </div>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-amber-200">
        <div className="h-full bg-emerald-900" style={{ width: `${esquerda}%` }} />
      </div>
    </div>
  )
}

function ladoParaPayload(partidaId: number, lado: EstatisticaLado): SalvarEstatisticaPayload {
  return {
    partidaId,
    timeId: lado.timeId ?? 0,
    chutes: lado.chutes,
    chutesGol: lado.chutesGol,
    posse: lado.posse ?? null,
    escanteios: lado.escanteios,
    faltas: lado.faltas,
    impedimentos: lado.impedimentos,
    cartoesAmarelos: lado.cartoesAmarelos,
    cartoesVermelhos: lado.cartoesVermelhos,
    passes: lado.passes,
    laterais: lado.laterais,
  }
}

export default function EstatisticasPartidasRoute() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jogos, setJogos] = useState<RelatorioEstatistica[]>([])
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([])
  const [times, setTimes] = useState<TimeSociety[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [edicao, setEdicao] = useState<RelatorioEstatistica | null>(null)
  const [formCasa, setFormCasa] = useState<SalvarEstatisticaPayload | null>(null)
  const [formVisitante, setFormVisitante] = useState<SalvarEstatisticaPayload | null>(null)

  const campeonatoId = Number(searchParams.get('campeonatoId') || 0) || undefined
  const timeId = Number(searchParams.get('timeId') || 0) || undefined

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [lista, listaCampeonatos, listaTimes] = await Promise.all([
        relatorioService.listarEstatisticas({ campeonatoId, timeId }),
        timeSocietyService.listarCampeonatos().catch(() => [] as Campeonato[]),
        timeSocietyService.listarTimes().catch(() => [] as TimeSociety[]),
      ])
      setJogos(lista)
      setCampeonatos(listaCampeonatos)
      setTimes(listaTimes.filter((item) => item.ativo !== false))
    } catch (err) {
      setError(errorMessage(err, 'Não foi possível carregar as estatísticas.'))
    } finally {
      setLoading(false)
    }
  }, [campeonatoId, timeId])

  useEffect(() => {
    void load()
  }, [load])

  function updateFilter(key: 'campeonatoId' | 'timeId', value: string) {
    const next = new URLSearchParams(searchParams)
    if (!value) next.delete(key)
    else next.set(key, value)
    setSearchParams(next)
  }

  function abrirEdicao(jogo: RelatorioEstatistica) {
    setEdicao(jogo)
    setFormCasa(ladoParaPayload(jogo.partidaId, jogo.casa))
    setFormVisitante(ladoParaPayload(jogo.partidaId, jogo.visitante))
  }

  async function salvar() {
    if (!formCasa || !formVisitante) return
    setSaving(true)
    setError(null)
    try {
      await relatorioService.salvarEstatistica(formCasa)
      await relatorioService.salvarEstatistica(formVisitante)
      setEdicao(null)
      await load()
    } catch (err) {
      setError(errorMessage(err, 'Não foi possível gravar a estatística.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#052e24,#14532d)] px-5 py-6 text-white md:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-300">Leitura de partida</p>
        <h2 className="mt-1 font-display text-4xl font-bold tracking-tight">Estatísticas das partidas</h2>
        <p className="mt-2 max-w-2xl text-sm text-emerald-100/80">
          Chutes, chutes a gol, posse, escanteios, faltas e cartões no formato de confronto, com atalho para o dia no calendário.
        </p>
      </section>

      <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Campeonato</span>
          <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" value={campeonatoId ?? ''} onChange={(event) => updateFilter('campeonatoId', event.target.value)}>
            <option value="">Todos</option>
            {campeonatos.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Time</span>
          <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" value={timeId ?? ''} onChange={(event) => updateFilter('timeId', event.target.value)}>
            <option value="">Todos</option>
            {times.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
          </select>
        </label>
      </div>

      {error && <p className="rounded-2xl border border-destructive/30 bg-card px-4 py-3 text-sm text-destructive">{error}</p>}

      {loading ? (
        <div className="h-64 animate-pulse rounded-3xl bg-muted" />
      ) : jogos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-emerald-900/20 bg-card px-6 py-12 text-center">
          <p className="font-display text-2xl font-bold text-emerald-950">Nenhuma partida oficializada</p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Quando uma escalação é salva, o jogo vira partida e entra neste relatório. Dá para lançar os números de chute, posse e cartão em seguida.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jogos.map((jogo) => (
            <article key={jogo.partidaId} className="rounded-3xl border border-border bg-card p-4 shadow-sm md:p-6">
              <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{dataJogo(jogo)}{jogo.local ? ` · ${jogo.local}` : ''}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <p className="font-display text-2xl font-bold">{jogo.casa.timeNome}</p>
                    <p className="font-display text-3xl font-bold text-emerald-950">{jogo.casa.gols} <span className="text-amber-600">x</span> {jogo.visitante.gols}</p>
                    <p className="font-display text-2xl font-bold">{jogo.visitante.timeNome}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={linkCalendario(jogo)} className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-3 py-2 font-display text-base font-bold text-emerald-950">
                    <CalendarRange className="size-4" />
                    Calendário
                  </Link>
                  <Button variant="outline" onClick={() => abrirEdicao(jogo)}>Lançar números</Button>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <Barra label="Posse %" casa={jogo.casa.posse ?? 0} visitante={jogo.visitante.posse ?? 0} />
                {METRICAS.map((metrica) => (
                  <Barra
                    key={metrica.key}
                    label={metrica.label}
                    casa={numero(jogo.casa, metrica.key)}
                    visitante={numero(jogo.visitante, metrica.key)}
                  />
                ))}
              </div>
              {!jogo.casa.registrada && !jogo.visitante.registrada && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Ainda sem lançamento manual. Chutes e cartões aparecem aqui quando existem eventos da partida.
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(edicao && formCasa && formVisitante)}
        onClose={() => setEdicao(null)}
        title="Lançar estatística"
        description={edicao ? `${edicao.casa.timeNome} x ${edicao.visitante.timeNome}` : undefined}
        className="max-w-3xl"
      >
        {formCasa && formVisitante && (
          <form
            className="grid gap-6 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault()
              void salvar()
            }}
          >
            <EditorLado titulo={edicao?.casa.timeNome ?? 'Casa'} valor={formCasa} onChange={setFormCasa} />
            <EditorLado titulo={edicao?.visitante.timeNome ?? 'Visitante'} valor={formVisitante} onChange={setFormVisitante} />
            <div className="flex justify-end gap-2 md:col-span-2">
              <Button type="button" variant="outline" onClick={() => setEdicao(null)} disabled={saving}>Cancelar</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Gravar estatística'}</Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  )
}

function EditorLado({
  titulo,
  valor,
  onChange,
}: {
  titulo: string
  valor: SalvarEstatisticaPayload
  onChange: (valor: SalvarEstatisticaPayload) => void
}) {
  const campos: { key: keyof SalvarEstatisticaPayload; label: string }[] = [
    { key: 'chutesGol', label: 'Chutes a gol' },
    { key: 'chutes', label: 'Chutes' },
    { key: 'posse', label: 'Posse %' },
    { key: 'escanteios', label: 'Escanteios' },
    { key: 'faltas', label: 'Faltas' },
    { key: 'impedimentos', label: 'Impedimentos' },
    { key: 'cartoesAmarelos', label: 'Amarelos' },
    { key: 'cartoesVermelhos', label: 'Vermelhos' },
    { key: 'passes', label: 'Passes' },
    { key: 'laterais', label: 'Laterais' },
  ]

  return (
    <fieldset className="space-y-3 rounded-2xl border border-border p-4">
      <legend className="px-1 font-display text-xl font-bold">{titulo}</legend>
      <div className="grid grid-cols-2 gap-3">
        {campos.map((campo) => (
          <label key={campo.key} className="text-xs">
            <span className="mb-1 block font-medium">{campo.label}</span>
            <input
              type="number"
              min={0}
              max={campo.key === 'posse' ? 100 : undefined}
              className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
              value={valor[campo.key] ?? ''}
              onChange={(event) => {
                const bruto = event.target.value
                onChange({
                  ...valor,
                  [campo.key]: bruto === '' ? (campo.key === 'posse' ? null : 0) : Number(bruto),
                })
              }}
            />
          </label>
        ))}
      </div>
    </fieldset>
  )
}

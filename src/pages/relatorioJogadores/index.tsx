import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarRange, ChevronDown } from 'lucide-react'
import * as relatorioService from '@/services/relatorioService'
import * as timeSocietyService from '@/services/timeSocietyService'
import type { RelatorioJogador, RelatorioPartidaJogador } from '@/types/relatorio'
import type { Campeonato, TimeSociety } from '@/types/escalacao'

function errorMessage(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined
    return data?.message || err.message || fallback
  }
  return fallback
}

function dataPartida(partida: RelatorioPartidaJogador) {
  const bruta = partida.dataPrevista || partida.dataHora
  if (!bruta) return 'Data a confirmar'
  const [ano, mes, dia] = bruta.slice(0, 10).split('-')
  const hora = partida.horarioPrevisto?.slice(0, 5) || partida.dataHora?.slice(11, 16) || ''
  return `${dia}/${mes}/${ano}${hora ? ` · ${hora}` : ''}`
}

function linkCalendario(partida: RelatorioPartidaJogador) {
  const params = new URLSearchParams()
  if (partida.timeId) params.set('timeId', String(partida.timeId))
  if (partida.calendarioId) params.set('jogoId', String(partida.calendarioId))
  const data = (partida.dataPrevista || partida.dataHora || '').slice(0, 10)
  if (data) params.set('data', data)
  return `/calendario?${params.toString()}`
}

function adversario(partida: RelatorioPartidaJogador) {
  const emCasa = partida.timeId && partida.timeId === partida.timeCasaId
  const outro = emCasa ? partida.timeVisitante : partida.timeCasa
  const mando = emCasa ? 'casa' : 'fora'
  const placar =
    partida.golsCasa == null || partida.golsVisitante == null
      ? 'sem placar'
      : `${partida.golsCasa} x ${partida.golsVisitante}`
  return `${mando === 'casa' ? 'Em casa' : 'Fora'} contra ${outro ?? 'adversário'} · ${placar}`
}

export default function RelatorioJogadoresRoute() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jogadores, setJogadores] = useState<RelatorioJogador[]>([])
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([])
  const [times, setTimes] = useState<TimeSociety[]>([])
  const [aberto, setAberto] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const campeonatoId = Number(searchParams.get('campeonatoId') || 0) || undefined
  const timeId = Number(searchParams.get('timeId') || 0) || undefined

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [lista, listaCampeonatos, listaTimes] = await Promise.all([
        relatorioService.listarJogadores({ campeonatoId, timeId }),
        timeSocietyService.listarCampeonatos().catch(() => [] as Campeonato[]),
        timeSocietyService.listarTimes().catch(() => [] as TimeSociety[]),
      ])
      setJogadores(lista)
      setCampeonatos(listaCampeonatos)
      setTimes(listaTimes.filter((item) => item.ativo !== false))
    } catch (err) {
      setError(errorMessage(err, 'Não foi possível carregar o relatório de jogadores.'))
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

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-emerald-950/15 bg-emerald-950 px-5 py-6 text-white md:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-300">Súmula do elenco</p>
        <h2 className="mt-1 font-display text-4xl font-bold tracking-tight">Relatório de jogadores</h2>
        <p className="mt-2 max-w-2xl text-sm text-emerald-100/80">
          Jogos, gols e cartões de quem entrou em campo, com a data de cada partida e o caminho de volta para o calendário.
        </p>
      </section>

      <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Campeonato</span>
          <select
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            value={campeonatoId ?? ''}
            onChange={(event) => updateFilter('campeonatoId', event.target.value)}
          >
            <option value="">Todos</option>
            {campeonatos.map((item) => (
              <option key={item.id} value={item.id}>{item.nome}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Time</span>
          <select
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            value={timeId ?? ''}
            onChange={(event) => updateFilter('timeId', event.target.value)}
          >
            <option value="">Todos</option>
            {times.map((item) => (
              <option key={item.id} value={item.id}>{item.nome}</option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-card p-6">
          <p className="font-semibold text-destructive">{error}</p>
          <button type="button" className="mt-3 text-sm underline" onClick={() => void load()}>Tentar novamente</button>
        </div>
      )}

      {loading ? (
        <div className="h-64 animate-pulse rounded-3xl bg-muted" />
      ) : jogadores.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-emerald-900/20 bg-card px-6 py-12 text-center">
          <p className="font-display text-2xl font-bold text-emerald-950">Nenhuma escalação gravada ainda</p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Salve uma escalação no Time Society. O relatório passa a listar cada jogo, a data e o atalho para o calendário.
          </p>
          <Link to="/time-society" className="mt-4 inline-flex rounded-xl bg-emerald-950 px-4 py-2 font-display text-lg font-bold text-amber-200">
            Ir para o Time Society
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jogadores.map((jogador) => {
            const abertoAgora = aberto === jogador.jogadorId
            return (
              <article key={jogador.jogadorId} className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <button
                  type="button"
                  className="flex w-full items-center gap-4 px-4 py-4 text-left md:px-5"
                  onClick={() => setAberto(abertoAgora ? null : jogador.jogadorId)}
                >
                  {jogador.foto ? (
                    <img src={jogador.foto} alt="" className="size-12 rounded-2xl object-cover" />
                  ) : (
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-950 font-display text-lg font-bold text-amber-200">
                      {(jogador.nome ?? '?').slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-2xl font-bold">{jogador.nome}</span>
                    <span className="text-sm text-muted-foreground">
                      {jogador.timeNome ?? 'Sem time'} · {jogador.posicao ?? 'Posição não informada'}
                    </span>
                  </span>
                  <span className="hidden gap-4 font-mono text-[11px] uppercase tracking-widest text-emerald-950 sm:flex">
                    <span>{jogador.jogos} jogos</span>
                    <span>{jogador.titulares} titular</span>
                    <span>{jogador.gols} gols</span>
                    <span>{jogador.cartoesAmarelos} amarelos</span>
                    <span>{jogador.cartoesVermelhos} vermelhos</span>
                  </span>
                  <ChevronDown className={`size-5 shrink-0 transition ${abertoAgora ? 'rotate-180' : ''}`} />
                </button>
                {abertoAgora && (
                  <div className="border-t border-border bg-emerald-50/40 px-4 py-3 md:px-5">
                    <div className="mb-3 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-widest text-emerald-950 sm:hidden">
                      <span>{jogador.jogos} jogos</span>
                      <span>{jogador.gols} gols</span>
                      <span>{jogador.cartoesAmarelos} amarelos</span>
                    </div>
                    <ul className="space-y-2">
                      {jogador.partidas.map((partida) => (
                        <li key={`${jogador.jogadorId}-${partida.partidaId}`} className="flex flex-col gap-2 rounded-2xl bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-display text-lg font-bold">{dataPartida(partida)}</p>
                            <p className="text-sm text-muted-foreground">{adversario(partida)}</p>
                            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-emerald-900">
                              {partida.titular ? 'Titular' : 'Reserva'}
                              {partida.gols ? ` · ${partida.gols} gol(s)` : ''}
                              {partida.cartoesAmarelos ? ` · ${partida.cartoesAmarelos} amarelo` : ''}
                              {partida.cartoesVermelhos ? ` · ${partida.cartoesVermelhos} vermelho` : ''}
                              {partida.statusCalendario ? ` · ${partida.statusCalendario}` : ''}
                            </p>
                          </div>
                          <Link
                            to={linkCalendario(partida)}
                            className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-3 py-2 font-display text-base font-bold text-emerald-950"
                          >
                            <CalendarRange className="size-4" />
                            Ver no calendário
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

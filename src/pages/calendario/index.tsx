import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AgendarJogoModal } from '@/components/calendario/AgendarJogoModal'
import { CalendarioJogosView } from '@/components/calendario/CalendarioJogosView'
import { ToastProvider, useToast } from '@/components/ui/toast'
import * as calendarioService from '@/services/calendarioService'
import * as timeSocietyService from '@/services/timeSocietyService'
import type { CalendarioJogo, StatusCalendario } from '@/types/calendario'
import type { Campeonato, TimeSociety } from '@/types/escalacao'

function errorMessage(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined
    return data?.message || err.message || fallback
  }
  return fallback
}

export default function CalendarioRoute() {
  return (
    <ToastProvider>
      <CalendarioPage />
    </ToastProvider>
  )
}

function CalendarioPage() {
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [jogos, setJogos] = useState<CalendarioJogo[]>([])
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([])
  const [times, setTimes] = useState<TimeSociety[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const campeonatoId = Number(searchParams.get('campeonatoId') || 0) || undefined
  const timeId = Number(searchParams.get('timeId') || 0) || undefined
  const dataFoco = searchParams.get('data') || ''

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [lista, listaCampeonatos, listaTimes] = await Promise.all([
        calendarioService.listarJogos({ campeonatoId, timeId }),
        timeSocietyService.listarCampeonatos().catch(() => [] as Campeonato[]),
        timeSocietyService.listarTimes().catch(() => [] as TimeSociety[]),
      ])
      setJogos(lista)
      setCampeonatos(listaCampeonatos)
      setTimes(listaTimes.filter((item) => item.ativo !== false))
    } catch (err) {
      setError(errorMessage(err, 'Não foi possível carregar o calendário.'))
    } finally {
      setLoading(false)
    }
  }, [campeonatoId, timeId])

  useEffect(() => {
    void load()
  }, [load])

  const resumo = useMemo(() => {
    const previstos = jogos.filter((item) => item.status === 'previsto' || item.status === 'confirmado').length
    return { total: jogos.length, previstos }
  }, [jogos])

  function updateFilter(key: 'campeonatoId' | 'timeId', value: string) {
    const next = new URLSearchParams(searchParams)
    if (!value) next.delete(key)
    else next.set(key, value)
    setSearchParams(next)
  }

  async function handleSchedule(values: Parameters<typeof calendarioService.cadastrarJogo>[0]) {
    setSaving(true)
    try {
      await calendarioService.cadastrarJogo(values)
      toast('Jogo agendado no calendário.')
      setScheduleOpen(false)
      await load()
    } catch (err) {
      toast(errorMessage(err, 'Não foi possível agendar o jogo.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleStatus(jogo: CalendarioJogo, status: StatusCalendario) {
    if (!jogo.id) return
    setSaving(true)
    try {
      if (status === 'confirmado') {
        await calendarioService.confirmarJogo(jogo.id, {
          dataPrevista: (jogo.dataPrevista ?? '').slice(0, 10),
          horarioPrevisto: jogo.horarioPrevisto?.slice(0, 5),
          localPrevisto: jogo.localPrevisto,
        })
      } else {
        await calendarioService.atualizarStatus(jogo.id, status, jogo.observacoes)
      }
      toast(`Jogo marcado como ${status}.`)
      await load()
    } catch (err) {
      toast(errorMessage(err, 'Não foi possível atualizar o jogo.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(jogo: CalendarioJogo) {
    if (!jogo.id) return
    setSaving(true)
    try {
      await calendarioService.excluirJogo(jogo.id)
      toast('Jogo removido do calendário.')
      await load()
    } catch (err) {
      toast(errorMessage(err, 'Não foi possível excluir o jogo.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Campeonato</span>
            <select
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              value={campeonatoId ?? ''}
              onChange={(event) => updateFilter('campeonatoId', event.target.value)}
            >
              <option value="">Todos</option>
              {campeonatos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
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
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {resumo.total} jogos · {resumo.previstos} em aberto
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-card p-6">
          <p className="font-semibold text-destructive">{error}</p>
          <button type="button" className="mt-3 text-sm underline" onClick={() => void load()}>
            Tentar novamente
          </button>
        </div>
      ) : (
        <CalendarioJogosView
          jogos={jogos}
          dataFoco={dataFoco}
          loading={loading}
          saving={saving}
          onSchedule={() => setScheduleOpen(true)}
          onStatus={(jogo, status) => void handleStatus(jogo, status)}
          onDelete={(jogo) => void handleDelete(jogo)}
        />
      )}

      <AgendarJogoModal
        open={scheduleOpen}
        saving={saving}
        campeonatos={campeonatos}
        times={times}
        campeonatoId={campeonatoId}
        timeFixoId={timeId}
        onClose={() => setScheduleOpen(false)}
        onSave={(values) => void handleSchedule(values)}
      />
    </div>
  )
}

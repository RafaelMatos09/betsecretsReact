import { useEffect, useMemo, useState } from 'react'
import { CalendarRange, ChevronLeft, ChevronRight, MapPin, Plus, Trash2 } from 'lucide-react'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { CalendarioJogo, StatusCalendario } from '@/types/calendario'

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const STATUS_LABEL: Record<StatusCalendario, string> = {
  previsto: 'Previsto',
  confirmado: 'Confirmado',
  adiado: 'Adiado',
  cancelado: 'Cancelado',
  realizado: 'Realizado',
}

const STATUS_CLASS: Record<StatusCalendario, string> = {
  previsto: 'bg-amber-100 text-amber-900',
  confirmado: 'bg-emerald-100 text-emerald-900',
  adiado: 'bg-sky-100 text-sky-900',
  cancelado: 'bg-rose-100 text-rose-900',
  realizado: 'bg-stone-200 text-stone-800',
}

function dateKey(value?: string | null) {
  if (!value) return ''
  return value.slice(0, 10)
}

function formatHour(value?: string | null) {
  if (!value) return ''
  return value.slice(0, 5)
}

function formatLongDate(key: string) {
  const [year, month, day] = key.split('-').map(Number)
  if (!year || !month || !day) return key
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })
}

function statusOf(jogo: CalendarioJogo): StatusCalendario {
  const status = jogo.status as StatusCalendario
  return status in STATUS_LABEL ? status : 'previsto'
}

function crest(escudo?: string, sigla?: string, nome?: string) {
  if (escudo) {
    return <img src={escudo} alt="" className="size-8 rounded-full object-cover ring-2 ring-white" />
  }
  const label = (sigla || nome || '?').slice(0, 3).toUpperCase()
  return (
    <span className="flex size-8 items-center justify-center rounded-full bg-emerald-950 font-display text-xs font-bold text-amber-200 ring-2 ring-white">
      {label}
    </span>
  )
}

interface CalendarioJogosViewProps {
  jogos: CalendarioJogo[]
  dataFoco?: string
  loading?: boolean
  saving?: boolean
  onSchedule: () => void
  onStatus: (jogo: CalendarioJogo, status: StatusCalendario) => void
  onDelete: (jogo: CalendarioJogo) => void
}

export function CalendarioJogosView({
  jogos,
  dataFoco,
  loading,
  saving,
  onSchedule,
  onStatus,
  onDelete,
}: CalendarioJogosViewProps) {
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const foco = dataFoco && /^\d{4}-\d{2}-\d{2}$/.test(dataFoco) ? dataFoco : ''
  const [cursor, setCursor] = useState(() => {
    if (!foco) return new Date(today.getFullYear(), today.getMonth(), 1)
    const [year, month] = foco.split('-').map(Number)
    return new Date(year, (month || 1) - 1, 1)
  })
  const [selectedKey, setSelectedKey] = useState(foco || todayKey)
  const [pendingDelete, setPendingDelete] = useState<CalendarioJogo | null>(null)

  useEffect(() => {
    if (!foco) return
    const [year, month] = foco.split('-').map(Number)
    setSelectedKey(foco)
    setCursor(new Date(year, (month || 1) - 1, 1))
  }, [foco])

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarioJogo[]>()
    for (const jogo of jogos) {
      const key = dateKey(jogo.dataPrevista)
      if (!key) continue
      const list = map.get(key) ?? []
      list.push(jogo)
      map.set(key, list)
    }
    return map
  }, [jogos])

  const cells = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const first = new Date(year, month, 1)
    const startOffset = (first.getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const total = Math.ceil((startOffset + daysInMonth) / 7) * 7
    return Array.from({ length: total }, (_, index) => {
      const day = index - startOffset + 1
      if (day < 1 || day > daysInMonth) return null
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      return { day, key }
    })
  }, [cursor])

  const selectedGames = byDay.get(selectedKey) ?? []

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-emerald-950/15 bg-emerald-950 text-white shadow-lg">
        <div className="relative px-5 py-6 md:px-8">
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(90deg,transparent,transparent_46px,rgba(255,255,255,.08)_46px,rgba(255,255,255,.08)_92px)]" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-300">Temporada society</p>
              <h2 className="mt-1 font-display text-4xl font-bold tracking-tight md:text-5xl">Calendário de jogos</h2>
              <p className="mt-2 max-w-xl text-sm text-emerald-100/80">
                Agenda da competição, com mando, horário e status de cada partida prevista.
              </p>
            </div>
            <Button onClick={onSchedule} className="bg-amber-300 text-emerald-950 hover:bg-amber-200">
              <Plus className="size-4" />
              Agendar jogo
            </Button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border bg-[linear-gradient(180deg,#f4f7f2,white)] px-4 py-4 md:px-6">
          <button
            type="button"
            className="rounded-full border border-emerald-900/15 p-2 text-emerald-950 hover:bg-emerald-50"
            onClick={() => setCursor((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
            aria-label="Mês anterior"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Mês</p>
            <h3 className="font-display text-3xl font-bold tracking-tight text-emerald-950">
              {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
            </h3>
          </div>
          <button
            type="button"
            className="rounded-full border border-emerald-900/15 p-2 text-emerald-950 hover:bg-emerald-50"
            onClick={() => setCursor((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
            aria-label="Próximo mês"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-emerald-900/10 bg-emerald-950 text-center">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-2 font-mono text-[10px] uppercase tracking-widest text-amber-200">
              {day}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-7">
            {Array.from({ length: 35 }, (_, index) => (
              <div key={index} className="h-24 animate-pulse border border-emerald-950/5 bg-emerald-50/40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {cells.map((cell, index) => {
              if (!cell) {
                return <div key={`empty-${index}`} className="min-h-24 border border-emerald-950/5 bg-muted/30" />
              }
              const dayGames = byDay.get(cell.key) ?? []
              const selected = cell.key === selectedKey
              const isToday = cell.key === todayKey
              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => setSelectedKey(cell.key)}
                  className={`min-h-24 border border-emerald-950/5 p-1.5 text-left transition-colors md:min-h-28 md:p-2 ${
                    selected ? 'bg-emerald-50 ring-2 ring-inset ring-emerald-700' : 'bg-white hover:bg-emerald-50/50'
                  }`}
                >
                  <span
                    className={`inline-flex size-6 items-center justify-center rounded-full font-display text-sm font-bold ${
                      isToday ? 'bg-amber-300 text-emerald-950' : 'text-emerald-950'
                    }`}
                  >
                    {cell.day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayGames.slice(0, 2).map((jogo) => (
                      <span
                        key={jogo.id}
                        className="block truncate rounded-md bg-emerald-950 px-1.5 py-0.5 font-mono text-[9px] text-amber-100"
                      >
                        {(jogo.siglaCasa || jogo.timeCasa || 'Casa').slice(0, 3)} x{' '}
                        {(jogo.siglaVisitante || jogo.timeVisitante || 'Vis').slice(0, 3)}
                      </span>
                    ))}
                    {dayGames.length > 2 && (
                      <span className="block font-mono text-[9px] text-muted-foreground">+{dayGames.length - 2}</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-emerald-950 text-amber-200">
            <CalendarRange className="size-5" />
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Dia selecionado</p>
            <h3 className="font-display text-2xl font-bold capitalize">{formatLongDate(selectedKey)}</h3>
          </div>
        </div>

        {selectedGames.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-emerald-900/20 bg-emerald-50/40 px-4 py-8 text-center">
            <p className="font-display text-xl font-bold text-emerald-950">Sem jogos neste dia</p>
            <p className="mt-1 text-sm text-muted-foreground">Agende uma partida para ela aparecer na súmula do mês.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {selectedGames.map((jogo) => {
              const status = statusOf(jogo)
              return (
                <article key={jogo.id} className="rounded-2xl border border-emerald-950/10 bg-[linear-gradient(180deg,#f7faf6,white)] p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-1 items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        {crest(jogo.escudoCasa, jogo.siglaCasa, jogo.timeCasa)}
                        <div className="min-w-0">
                          <p className="truncate font-display text-lg font-bold">{jogo.timeCasa}</p>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Casa</p>
                        </div>
                      </div>
                      <div className="shrink-0 text-center">
                        <p className="font-display text-2xl font-bold text-emerald-950">{formatHour(jogo.horarioPrevisto) || '—'}</p>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-amber-700">vs</p>
                      </div>
                      <div className="flex min-w-0 items-center justify-end gap-2 text-right">
                        <div className="min-w-0">
                          <p className="truncate font-display text-lg font-bold">{jogo.timeVisitante}</p>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Visitante</p>
                        </div>
                        {crest(jogo.escudoVisitante, jogo.siglaVisitante, jogo.timeVisitante)}
                      </div>
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${STATUS_CLASS[status]}`}>
                      {STATUS_LABEL[status]}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {jogo.localPrevisto && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {jogo.localPrevisto}
                      </span>
                    )}
                    {jogo.campeonatoNome && <span>{jogo.campeonatoNome}</span>}
                    {jogo.rodadaNumero ? <span>Rodada {jogo.rodadaNumero}</span> : null}
                    {jogo.partidaId ? <span>Partida #{jogo.partidaId}</span> : <span>Ainda sem súmula oficial</span>}
                  </div>
                  {jogo.observacoes && <p className="mt-2 text-sm text-foreground/80">{jogo.observacoes}</p>}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(['confirmado', 'adiado', 'realizado', 'cancelado'] as StatusCalendario[])
                      .filter((item) => item !== status)
                      .map((item) => (
                        <Button key={item} size="sm" variant="outline" disabled={saving} onClick={() => onStatus(jogo, item)}>
                          {STATUS_LABEL[item]}
                        </Button>
                      ))}
                    <Button size="sm" variant="destructive" disabled={saving} onClick={() => setPendingDelete(jogo)}>
                      <Trash2 className="size-3.5" />
                      Excluir
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <AlertDialog
        open={Boolean(pendingDelete)}
        title="Excluir jogo do calendário"
        description={`Remover ${pendingDelete?.timeCasa ?? 'mandante'} x ${pendingDelete?.timeVisitante ?? 'visitante'} da agenda?`}
        confirmLabel="Excluir"
        loading={saving}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return
          onDelete(pendingDelete)
          setPendingDelete(null)
        }}
      />
    </div>
  )
}

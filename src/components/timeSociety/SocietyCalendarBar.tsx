import { CalendarRange, Flag, Plus } from 'lucide-react'
import type { CalendarioJogo } from '@/types/calendario'

interface SocietyCalendarBarProps {
  jogos: CalendarioJogo[]
  jogoId: number | null
  onSelectJogo: (id: number) => void
  onOpenCalendar: () => void
  onSchedule: () => void
}

function labelJogo(jogo: CalendarioJogo) {
  const data = jogo.dataPrevista?.slice(0, 10).split('-').reverse().join('/') ?? 'sem data'
  const hora = jogo.horarioPrevisto ? ` · ${jogo.horarioPrevisto.slice(0, 5)}` : ''
  return `${data}${hora} · ${jogo.timeCasa ?? 'Casa'} x ${jogo.timeVisitante ?? 'Visitante'}`
}

export function SocietyCalendarBar({
  jogos,
  jogoId,
  onSelectJogo,
  onOpenCalendar,
  onSchedule,
}: SocietyCalendarBarProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-950/15 bg-[linear-gradient(135deg,#052e24_0%,#0f3d2e_55%,#14532d_100%)] text-white shadow-md">
      <div className="relative px-4 py-4 md:px-5">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-40 opacity-25 [background-image:repeating-linear-gradient(90deg,transparent,transparent_18px,rgba(255,255,255,.18)_18px,rgba(255,255,255,.18)_36px)]" />
        <div className="relative flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-amber-300">Agenda do elenco</p>
            <h3 className="font-display text-2xl font-bold tracking-tight">Calendário e escalação do jogo</h3>
            <p className="mt-1 max-w-xl text-sm text-emerald-100/75">
              Escolha o confronto para gravar a escalação. O calendário completo fica na aba ao lado.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenCalendar}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-4 py-2.5 font-display text-base font-bold text-emerald-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-200"
            >
              <CalendarRange className="size-4" />
              Ver calendário
            </button>
            <button
              type="button"
              onClick={onSchedule}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 font-display text-base font-bold text-white transition hover:bg-white/20"
            >
              <Plus className="size-4" />
              Agendar jogo
            </button>
          </div>
        </div>

        <label className="relative mt-4 block text-sm">
          <span className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-200">
            <Flag className="size-3.5" />
            Jogo desta escalação
          </span>
          <select
            className="h-11 w-full rounded-xl border border-white/15 bg-emerald-950/70 px-3 text-sm text-white"
            value={jogoId ?? ''}
            onChange={(event) => onSelectJogo(Number(event.target.value))}
          >
            <option value="">Selecione um jogo do calendário</option>
            {jogos.map((jogo) => (
              <option key={jogo.id} value={jogo.id}>
                {labelJogo(jogo)}
                {jogo.status ? ` · ${jogo.status}` : ''}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  )
}

import { PlayerPosition } from './PlayerPosition'
import type { Formation } from '@/types/formacao'
import type { JogadorTime, PlayerStatus } from '@/types/jogador'

interface SoccerFieldProps {
  formation: Formation
  elencoById: Map<number, JogadorTime>
  slotMap: Record<string, number>
  playerStatus: (player?: JogadorTime) => PlayerStatus
  onSlotClick: (slotId: string, player?: JogadorTime) => void
  onDropPlayer: (slotId: string, elencoId: number) => void
}

export function SoccerField({
  formation,
  elencoById,
  slotMap,
  playerStatus,
  onSlotClick,
  onDropPlayer,
}: SoccerFieldProps) {
  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-3xl overflow-hidden rounded-3xl border border-emerald-900/40 shadow-2xl">
      <div
        className="absolute inset-0"
        style={{
          background:
            'repeating-linear-gradient(90deg, #166534 0 8%, #15803d 8% 16%), linear-gradient(#14532d, #166534)',
        }}
      />
      <div className="absolute inset-[4%] rounded-sm border-2 border-white/80">
        <div className="absolute left-1/2 top-0 h-[18%] w-[62%] -translate-x-1/2 border-2 border-t-0 border-white/80" />
        <div className="absolute left-1/2 top-0 h-[8%] w-[28%] -translate-x-1/2 border-2 border-t-0 border-white/80" />
        <div className="absolute left-1/2 top-[18%] size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80" />
        <div className="absolute inset-x-0 top-1/2 border-t-2 border-white/80" />
        <div className="absolute left-1/2 top-1/2 size-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80" />
        <div className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        <div className="absolute bottom-0 left-1/2 h-[18%] w-[62%] -translate-x-1/2 border-2 border-b-0 border-white/80" />
        <div className="absolute bottom-0 left-1/2 h-[8%] w-[28%] -translate-x-1/2 border-2 border-b-0 border-white/80" />
        <div className="absolute bottom-[18%] left-1/2 size-16 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-white/80" />
      </div>
      {formation.slots.map((slot) => {
        const player = elencoById.get(slotMap[slot.id] ?? -1)
        return (
          <PlayerPosition
            key={slot.id}
            slot={slot}
            player={player}
            status={playerStatus(player)}
            onClick={() => onSlotClick(slot.id, player)}
            onDropPlayer={(elencoId) => onDropPlayer(slot.id, elencoId)}
          />
        )
      })}
    </div>
  )
}

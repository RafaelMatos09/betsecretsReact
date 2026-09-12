import { PlayerAvatar } from './PlayerAvatar'
import { Tooltip } from '@/components/ui/tooltip'
import { displayName, statusDot } from '@/lib/jogadorUtils'
import type { FormationSlot } from '@/types/formacao'
import type { JogadorTime, PlayerStatus } from '@/types/jogador'

interface PlayerPositionProps {
  slot: FormationSlot
  player?: JogadorTime
  status: PlayerStatus
  onClick: () => void
  onDropPlayer?: (elencoId: number) => void
}

export function PlayerPosition({ slot, player, status, onClick, onDropPlayer }: PlayerPositionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onDragOver={(event) => {
        event.preventDefault()
      }}
      onDrop={(event) => {
        event.preventDefault()
        const raw = event.dataTransfer.getData('application/x-elenco-id')
        const id = Number(raw)
        if (Number.isFinite(id) && onDropPlayer) onDropPlayer(id)
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out hover:z-10 hover:scale-110"
      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
    >
      <Tooltip content={slot.label}>
        <span className="flex flex-col items-center gap-1">
          {player ? (
            <>
              <PlayerAvatar
                name={displayName(player)}
                photo={player.foto}
                number={player.numeroCamisa}
                status={status}
              />
              <span className="max-w-20 truncate rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                {displayName(player)}
              </span>
            </>
          ) : (
            <span className="flex size-16 flex-col items-center justify-center rounded-full border-2 border-dashed border-white/70 bg-black/25 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
              {slot.role}
            </span>
          )}
          <span className={`size-1.5 rounded-full ${statusDot(status)}`} />
        </span>
      </Tooltip>
    </button>
  )
}

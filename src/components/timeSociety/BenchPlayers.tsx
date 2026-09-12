import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PlayerAvatar } from './PlayerAvatar'
import { displayName, statusLabel } from '@/lib/jogadorUtils'
import type { JogadorTime, PlayerStatus } from '@/types/jogador'

interface BenchPlayersProps {
  players: JogadorTime[]
  playerStatus: (player: JogadorTime) => PlayerStatus
  onScale: (player: JogadorTime) => void
}

export function BenchPlayers({ players, playerStatus, onScale }: BenchPlayersProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Banco de reservas</h3>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {players.length} jogador(es)
        </span>
      </div>
      {players.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum reserva disponível.</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {players.map((player) => {
            const status = playerStatus(player)
            return (
              <article
                key={player.id}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/x-elenco-id', String(player.id))
                  event.dataTransfer.effectAllowed = 'move'
                }}
                className="min-w-[168px] rounded-2xl border border-border bg-background p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <PlayerAvatar
                    name={displayName(player)}
                    photo={player.foto}
                    number={player.numeroCamisa}
                    status={status}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{displayName(player)}</p>
                    <p className="text-xs text-muted-foreground">
                      {player.posicao ?? '—'} · {statusLabel(status)}
                    </p>
                  </div>
                </div>
                <Button size="sm" className="mt-3 w-full" onClick={() => onScale(player)}>
                  <UserPlus className="size-3.5" />
                  Escalar
                </Button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

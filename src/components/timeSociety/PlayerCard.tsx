import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PlayerAvatar } from './PlayerAvatar'
import { displayName, statusLabel } from '@/lib/jogadorUtils'
import type { JogadorTime, PlayerStatus } from '@/types/jogador'

interface PlayerCardProps {
  player: JogadorTime
  age?: number | null
  status: PlayerStatus
  onEdit: () => void
  onRemove: () => void
  onView: () => void
}

export function PlayerCard({ player, age, status, onEdit, onRemove, onView }: PlayerCardProps) {
  return (
    <article className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3 shadow-sm transition-all hover:shadow-md">
      <PlayerAvatar
        name={displayName(player)}
        photo={player.foto}
        number={player.numeroCamisa}
        status={status}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{displayName(player)}</p>
        <p className="text-xs text-muted-foreground">
          #{player.numeroCamisa} · {player.posicao ?? '—'}
          {age != null ? ` · ${age} anos` : ''}
        </p>
        <p className="text-[11px] text-muted-foreground">{statusLabel(status)}</p>
      </div>
      <div className="flex flex-col gap-1">
        <Button size="icon" variant="ghost" onClick={onView} aria-label="Visualizar">
          <Eye className="size-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onEdit} aria-label="Editar">
          <Pencil className="size-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onRemove} aria-label="Remover">
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    </article>
  )
}

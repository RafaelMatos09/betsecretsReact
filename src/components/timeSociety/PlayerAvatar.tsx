import { cn } from '@/lib/utils'
import { getInitials, statusRing } from '@/lib/jogadorUtils'
import type { PlayerStatus } from '@/types/jogador'

interface PlayerAvatarProps {
  name?: string
  photo?: string
  number?: number
  status: PlayerStatus
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'size-11 text-xs',
  md: 'size-16 text-sm',
  lg: 'size-28 text-2xl',
}

export function PlayerAvatar({
  name,
  photo,
  number,
  status,
  size = 'md',
  className,
}: PlayerAvatarProps) {
  return (
    <span className={cn('relative inline-flex', className)}>
      <span
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-full bg-emerald-950 font-display font-bold text-white ring-4 shadow-lg shadow-black/40 transition-transform duration-200',
          sizeMap[size],
          statusRing(status),
        )}
      >
        {photo ? (
          <img src={photo} alt={name ?? 'Jogador'} className="size-full object-cover" />
        ) : (
          getInitials(name)
        )}
      </span>
      {number != null && (
        <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-black/80 font-mono text-[10px] font-bold text-white ring-2 ring-white">
          {number}
        </span>
      )}
    </span>
  )
}

import { Drawer } from '@/components/ui/drawer'
import { PlayerAvatar } from './PlayerAvatar'
import { TeamStats } from './TeamStats'
import { calcAge, displayName, statusLabel } from '@/lib/jogadorUtils'
import type { Jogador, JogadorEstatisticas, JogadorTime, PlayerStatus } from '@/types/jogador'

interface PlayerDrawerProps {
  open: boolean
  onClose: () => void
  elenco?: JogadorTime
  details?: Jogador | null
  stats: JogadorEstatisticas
  status: PlayerStatus
}

export function PlayerDrawer({ open, onClose, elenco, details, stats, status }: PlayerDrawerProps) {
  const name = displayName(elenco ?? {})
  const age = calcAge(details?.dataNascimento)

  return (
    <Drawer open={open} onClose={onClose} title="Jogador">
      {elenco && (
        <div className="space-y-5">
          <div className="flex flex-col items-center text-center">
            <PlayerAvatar name={name} photo={elenco.foto ?? details?.foto} number={elenco.numeroCamisa} status={status} size="lg" />
            <h3 className="mt-3 font-display text-2xl font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground">
              #{elenco.numeroCamisa} · {elenco.posicao ?? details?.posicao ?? '—'} · {statusLabel(status)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Idade" value={age != null ? `${age} anos` : '—'} />
            <Info label="Pé" value={details?.peDominante ?? '—'} />
            <Info label="Altura" value={details?.altura ? `${details.altura} m` : '—'} />
            <Info label="Peso" value={details?.peso ? `${details.peso} kg` : '—'} />
          </div>
          <TeamStats stats={stats} />
        </div>
      )}
    </Drawer>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  )
}

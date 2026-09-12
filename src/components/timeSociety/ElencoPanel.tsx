import { Search } from 'lucide-react'
import { PlayerCard } from './PlayerCard'
import { calcAge } from '@/lib/jogadorUtils'
import type { Jogador, JogadorTime, PlayerStatus, PosicaoFiltro } from '@/types/jogador'

const filters: { id: PosicaoFiltro; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'goleiros', label: 'Goleiros' },
  { id: 'defensores', label: 'Defensores' },
  { id: 'meias', label: 'Meias' },
  { id: 'atacantes', label: 'Atacantes' },
]

interface ElencoPanelProps {
  players: JogadorTime[]
  detailsById: Map<number, Jogador>
  query: string
  filter: PosicaoFiltro
  playerStatus: (player: JogadorTime) => PlayerStatus
  onQuery: (value: string) => void
  onFilter: (value: PosicaoFiltro) => void
  onEdit: (player: JogadorTime) => void
  onRemove: (player: JogadorTime) => void
  onView: (player: JogadorTime) => void
}

export function ElencoPanel({
  players,
  detailsById,
  query,
  filter,
  playerStatus,
  onQuery,
  onFilter,
  onEdit,
  onRemove,
  onView,
}: ElencoPanelProps) {
  return (
    <aside className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h3 className="font-display text-lg font-bold">Elenco</h3>
      <label className="relative mt-3 block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          placeholder="Buscar por nome ou número"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
        />
      </label>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onFilter(item.id)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              filter === item.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            age={calcAge(detailsById.get(player.jogadorId)?.dataNascimento)}
            status={playerStatus(player)}
            onEdit={() => onEdit(player)}
            onRemove={() => onRemove(player)}
            onView={() => onView(player)}
          />
        ))}
        {players.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">Nenhum jogador encontrado.</p>
        )}
      </div>
    </aside>
  )
}

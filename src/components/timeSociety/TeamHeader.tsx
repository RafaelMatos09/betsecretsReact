import {
  Activity,
  Pencil,
  Plus,
  Save,
  Shield,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormationSelector } from './FormationSelector'
import type { TimeSociety } from '@/types/escalacao'
import type { Campeonato } from '@/types/escalacao'

interface TeamStatsValues {
  total: number
  goleiros: number
  linha: number
  disponiveis: number
  lesionados: number
  suspensos: number
}

interface TeamHeaderProps {
  time?: TimeSociety
  times: TimeSociety[]
  campeonato?: Campeonato
  formationId: string
  stats: TeamStatsValues
  onSelectTime: (timeId: number) => void
  onChangeFormation: (id: string) => void
  onEditTeam: () => void
  onNewPlayer: () => void
  onSaveLineup: () => void
}

const statItems = [
  { key: 'total', label: 'Total de atletas', icon: Users },
  { key: 'goleiros', label: 'Goleiros', icon: Shield },
  { key: 'linha', label: 'Linha', icon: Activity },
  { key: 'disponiveis', label: 'Disponíveis', icon: UserCheck },
  { key: 'lesionados', label: 'Lesionados', icon: UserX },
  { key: 'suspensos', label: 'Suspensos', icon: UserX },
] as const

export function TeamHeader({
  time,
  times,
  campeonato,
  formationId,
  stats,
  onSelectTime,
  onChangeFormation,
  onEditTeam,
  onNewPlayer,
  onSaveLineup,
}: TeamHeaderProps) {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-emerald-950 text-lg font-bold text-white shadow-md">
              {time?.escudo ? (
                <img src={time.escudo} alt={time.nome} className="size-full object-cover" />
              ) : (
                (time?.sigla ?? 'TS')
              )}
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Time Society</p>
              <h2 className="font-display text-3xl font-bold tracking-tight">{time?.nome ?? 'Selecione um time'}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {campeonato?.nome ?? 'Campeonato não informado'}
                {campeonato?.temporada ? ` · ${campeonato.temporada}` : ''}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {times.length > 1 && (
              <select
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                value={time?.id ?? ''}
                onChange={(event) => onSelectTime(Number(event.target.value))}
              >
                {times.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                  </option>
                ))}
              </select>
            )}
            <FormationSelector value={formationId} onChange={onChangeFormation} />
            <Button variant="outline" onClick={onEditTeam} disabled={!time}>
              <Pencil className="size-4" />
              Editar Time
            </Button>
            <Button variant="secondary" onClick={onNewPlayer} disabled={!time}>
              <Plus className="size-4" />
              Novo Jogador
            </Button>
            <Button onClick={onSaveLineup} disabled={!time}>
              <Save className="size-4" />
              Salvar Escalação
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {statItems.map((item) => {
          const Icon = item.icon
          return (
            <article key={item.key} className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="size-4" />
                <span className="font-mono text-[10px] uppercase tracking-widest">{item.label}</span>
              </div>
              <p className="mt-2 font-display text-3xl font-bold">{stats[item.key]}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

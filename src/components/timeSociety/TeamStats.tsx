import { Progress } from '@/components/ui/progress'
import type { JogadorEstatisticas } from '@/types/jogador'

interface TeamStatsProps {
  stats: JogadorEstatisticas
}

const items: { key: keyof JogadorEstatisticas; label: string; max: number }[] = [
  { key: 'jogos', label: 'Jogos', max: 20 },
  { key: 'gols', label: 'Gols', max: 20 },
  { key: 'assistencias', label: 'Assistências', max: 15 },
  { key: 'cartoesAmarelos', label: 'Cartões amarelos', max: 10 },
  { key: 'cartoesVermelhos', label: 'Cartões vermelhos', max: 5 },
  { key: 'media', label: 'Média', max: 10 },
  { key: 'presenca', label: 'Presença', max: 100 },
]

export function TeamStats({ stats }: TeamStatsProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
      <h3 className="mb-4 font-display text-lg font-bold">Estatísticas</h3>
      <div className="space-y-3">
        {items.map((item) => {
          const value = stats[item.key]
          const percent = item.key === 'presenca' ? value : (value / item.max) * 100
          return (
            <div key={item.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold">{value}</span>
              </div>
              <Progress value={percent} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

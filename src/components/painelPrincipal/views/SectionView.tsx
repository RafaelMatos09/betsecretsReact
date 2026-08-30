import type { NavItemId } from '../data/navGroups'

interface SectionViewProps {
  title: string
  description: string
  activeId: NavItemId
}

export function SectionView({ title, description, activeId }: SectionViewProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {activeId}
      </p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {['Resumo', 'Atividade recente', 'Próximos passos'].map((card) => (
          <div key={card} className="stat-card">
            <span className="stat-label">{card}</span>
            <p className="mt-4 text-sm text-muted-foreground">
              Conteúdo dinâmico da seção <strong>{title}</strong> será carregado aqui.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useCallback, useMemo, useState } from 'react'
import {
  Bell,
  ChevronDown,
  Goal,
  LogOut,
  Menu,
  MoreHorizontal,
  RefreshCw,
  Settings,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { SettingsModal } from './components/SettingsModal'
import { navGroups, navItemById, type NavItemId } from './data/navGroups'
import { useClassificacao } from './hooks/useClassificacao'
import { useAoVivo } from './hooks/useAoVivo'
import { ClassificacaoView } from './views/ClassificacaoView'
import { VisaoGeralView } from './views/VisaoGeralView'
import { SectionView } from './views/SectionView'

const sectionContent: Record<Exclude<NavItemId, 'classificacao' | 'configuracoes' | 'visao-geral'>, { title: string; description: string }> = {
  jogos: {
    title: 'Jogos',
    description: 'Acompanhe partidas da rodada, horários e resultados em tempo real.',
  },
  'meus-palpites': {
    title: 'Meus palpites',
    description: 'Gerencie seus palpites pendentes, confirmados e histórico de acertos.',
  },
  'painel-palpites': {
    title: 'Painel de palpites',
    description: 'Veja a distribuição de palpites da comunidade para cada partida.',
  },
  ranking: {
    title: 'Ranking de usuários',
    description: 'Compare sua performance com outros apostadores da plataforma.',
  },
  'times-campeonatos': {
    title: 'Times e campeonatos',
    description: 'Configure campeonatos ativos, times favoritos e competições disponíveis.',
  },
}

function getUserInitials(name?: string) {
  if (!name) return 'BS'
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function PainelPrincipal() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [active, setActive] = useState<NavItemId>('classificacao')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const {
    teams,
    items: classificacaoItems,
    stats,
    loading,
    error,
    round,
    favorite,
    cycleFavorite,
    refresh: refreshClassificacao,
  } = useClassificacao()
  const {
    partidas,
    stats: aoVivoStats,
    loading: aoVivoLoading,
    error: aoVivoError,
    refresh: refreshAoVivo,
  } = useAoVivo()

  const activeItem = navItemById[active]

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      if (active === 'visao-geral') {
        await Promise.all([refreshAoVivo(), refreshClassificacao()])
      } else {
        await refreshClassificacao()
      }
    } finally {
      setRefreshing(false)
    }
  }, [active, refreshAoVivo, refreshClassificacao])

  const content = useMemo(() => {
    if (active === 'visao-geral') {
      return (
        <VisaoGeralView
          partidas={partidas}
          stats={aoVivoStats}
          loading={aoVivoLoading}
          error={aoVivoError}
          classificacaoItems={classificacaoItems}
          classificacaoTeams={teams}
          classificacaoLoading={loading}
          classificacaoError={error}
          favorite={favorite}
          onNavigate={setActive}
        />
      )
    }

    if (active === 'classificacao') {
      return (
        <ClassificacaoView
          favorite={favorite}
          round={round}
          teams={teams}
          stats={stats}
          loading={loading}
          error={error}
          onFavoriteToggle={cycleFavorite}
          onNavigate={setActive}
        />
      )
    }

    if (active === 'configuracoes') {
      return (
        <SectionView
          activeId={active}
          title="Configurações"
          description="Abra o painel lateral de configurações para ajustar perfil, notificações e preferências."
        />
      )
    }

    const section = sectionContent[active]
    return <SectionView activeId={active} title={section.title} description={section.description} />
  }, [
    active,
    favorite,
    round,
    teams,
    stats,
    loading,
    error,
    cycleFavorite,
    partidas,
    aoVivoStats,
    aoVivoLoading,
    aoVivoError,
    classificacaoItems,
    teams,
    loading,
    error,
    favorite,
  ])

  function handleNavClick(itemId: NavItemId, opensSettings?: boolean) {
    setActive(itemId)
    setSidebarOpen(false)
    if (opensSettings) setSettingsOpen(true)
  }

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-30 bg-foreground/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Goal className="size-5" />
            </div>
            <div>
              <p className="font-display text-lg font-bold tracking-tight text-sidebar-foreground">BETSECRETS</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-sidebar-foreground/50">futebol club</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar navegação"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="border-b border-sidebar-border p-4">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl bg-sidebar-accent px-4 py-3 text-left hover:bg-sidebar-accent/80"
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">Campeonato ativo</p>
              <p className="mt-1 text-sm font-semibold text-sidebar-foreground">Brasileirão Série A</p>
            </div>
            <ChevronDown className="size-4 text-sidebar-foreground/50" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Navegação principal">
          {navGroups.map((group) => (
            <div className="mb-7" key={group.label}>
              <p className="mb-2 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/40">
                {group.label}
              </p>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const selected = active === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id, item.opensSettings)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        selected
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                      }`}
                    >
                      <Icon className="size-[18px]" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.count && (
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                            selected
                              ? 'bg-primary-foreground/15 text-primary-foreground'
                              : 'bg-sidebar-accent text-sidebar-foreground/50'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-sidebar-accent"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-accent font-display font-bold text-accent-foreground">
              {getUserInitials(user?.nome)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-sidebar-foreground">{user?.nome ?? 'Usuário'}</span>
              <span className="block truncate text-xs text-sidebar-foreground/45">{user?.email ?? 'Conta ativa'}</span>
            </span>
            <MoreHorizontal className="size-4 text-sidebar-foreground/40" />
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border/70 bg-background/95 px-5 backdrop-blur md:px-10">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-muted lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Temporada 2025 · Brasileirão
              </p>
              <h1 className="mt-1 font-display text-xl font-bold tracking-tight md:text-2xl">{activeItem.label}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              className="hidden rounded-lg border border-border p-2.5 text-muted-foreground hover:bg-muted sm:block"
              aria-label="Notificações"
            >
              <Bell className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="hidden rounded-lg border border-border p-2.5 text-muted-foreground hover:bg-muted sm:block"
              aria-label="Configurações"
            >
              <Settings className="size-4" />
            </button>
            <Button onClick={() => void handleRefresh()}>
              <RefreshCw className={`size-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Atualizar</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Sair">
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-5 py-7 md:px-10 md:py-10">{content}</div>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </main>
  )
}

export default PainelPrincipal

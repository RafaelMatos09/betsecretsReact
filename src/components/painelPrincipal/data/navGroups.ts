import {
  BarChart3,
  CalendarDays,
  CalendarRange,
  ChartColumn,
  ClipboardList,
  FileText,
  Goal,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type NavItemId =
  | 'visao-geral'
  | 'classificacao'
  | 'jogos'
  | 'calendario'
  | 'relatorio-jogadores'
  | 'estatisticas'
  | 'meus-palpites'
  | 'painel-palpites'
  | 'ranking'
  | 'times-campeonatos'
  | 'time-society'
  | 'configuracoes'

export type NavSource = 'bairro' | 'brasileirao' | 'conta'

export interface NavItem {
  id: NavItemId
  label: string
  icon: LucideIcon
  path?: string
  count?: string
  opensSettings?: boolean
}

export interface NavGroup {
  label: string
  description: string
  source: NavSource
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'Sua API',
    description: 'Times, elenco e agenda do bairro',
    source: 'bairro',
    items: [
      { id: 'time-society', label: 'Time Society', icon: Goal, path: '/time-society' },
      { id: 'calendario', label: 'Calendário', icon: CalendarRange, path: '/calendario' },
      { id: 'relatorio-jogadores', label: 'Relatório de jogadores', icon: FileText, path: '/relatorio-jogadores' },
      { id: 'estatisticas', label: 'Estatísticas', icon: ChartColumn, path: '/estatisticas' },
      { id: 'times-campeonatos', label: 'Times e campeonatos', icon: ShieldCheck },
    ],
  },
  {
    label: 'Campeonato Brasileiro',
    description: 'Tabela e jogos oficiais',
    source: 'brasileirao',
    items: [
      { id: 'visao-geral', label: 'Visão geral', icon: LayoutDashboard },
      { id: 'classificacao', label: 'Classificação', icon: Trophy },
      { id: 'jogos', label: 'Jogos', icon: CalendarDays },
    ],
  },
  {
    label: 'Palpites',
    description: 'Comunidade do BairroFut',
    source: 'bairro',
    items: [
      { id: 'meus-palpites', label: 'Meus palpites', icon: ClipboardList, count: '12' },
      { id: 'painel-palpites', label: 'Painel de palpites', icon: BarChart3 },
      { id: 'ranking', label: 'Ranking de usuários', icon: Users },
    ],
  },
  {
    label: 'Conta',
    description: 'Preferências',
    source: 'conta',
    items: [
      { id: 'configuracoes', label: 'Configurações', icon: Settings, opensSettings: true },
    ],
  },
]

export const navItemById = Object.fromEntries(
  navGroups.flatMap((group) => group.items.map((item) => [item.id, item])),
) as Record<NavItemId, NavItem>

export const navSourceById = Object.fromEntries(
  navGroups.flatMap((group) => group.items.map((item) => [item.id, group.source])),
) as Record<NavItemId, NavSource>

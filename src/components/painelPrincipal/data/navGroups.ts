import {
  BarChart3,
  CalendarDays,
  ClipboardList,
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
  | 'meus-palpites'
  | 'painel-palpites'
  | 'ranking'
  | 'times-campeonatos'
  | 'configuracoes'

export interface NavItem {
  id: NavItemId
  label: string
  icon: LucideIcon
  count?: string
  opensSettings?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'Principal',
    items: [
      { id: 'visao-geral', label: 'Visão geral', icon: LayoutDashboard },
      { id: 'classificacao', label: 'Classificação', icon: Trophy },
      { id: 'jogos', label: 'Jogos', icon: CalendarDays },
    ],
  },
  {
    label: 'Palpites',
    items: [
      { id: 'meus-palpites', label: 'Meus palpites', icon: ClipboardList, count: '12' },
      { id: 'painel-palpites', label: 'Painel de palpites', icon: BarChart3 },
      { id: 'ranking', label: 'Ranking de usuários', icon: Users },
    ],
  },
  {
    label: 'Gerenciar',
    items: [
      { id: 'times-campeonatos', label: 'Times e campeonatos', icon: ShieldCheck },
      { id: 'configuracoes', label: 'Configurações', icon: Settings, opensSettings: true },
    ],
  },
]

export const navItemById = Object.fromEntries(
  navGroups.flatMap((group) => group.items.map((item) => [item.id, item])),
) as Record<NavItemId, NavItem>

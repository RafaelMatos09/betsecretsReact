export type TeamZone = 'libertadores' | 'pre-libertadores' | 'sul-americana' | 'rebaixamento' | 'none'

export interface Team {
  pos: number
  name: string
  short: string
  pts: number
  games: number
  wins: number
  draws: number
  losses: number
  gf: number
  ga: number
  form: string[]
  color: string
  zone: TeamZone
}

export const teams: Team[] = [
  { pos: 1, name: 'Flamengo', short: 'FLA', pts: 48, games: 21, wins: 15, draws: 3, losses: 3, gf: 41, ga: 18, form: ['V', 'V', 'V', 'E', 'V'], color: 'bg-red-700', zone: 'libertadores' },
  { pos: 2, name: 'Palmeiras', short: 'PAL', pts: 44, games: 21, wins: 13, draws: 5, losses: 3, gf: 35, ga: 17, form: ['V', 'E', 'V', 'V', 'V'], color: 'bg-emerald-700', zone: 'libertadores' },
  { pos: 3, name: 'Cruzeiro', short: 'CRU', pts: 40, games: 21, wins: 12, draws: 4, losses: 5, gf: 32, ga: 21, form: ['V', 'V', 'D', 'V', 'E'], color: 'bg-blue-700', zone: 'libertadores' },
  { pos: 4, name: 'Bahia', short: 'BAH', pts: 37, games: 21, wins: 10, draws: 7, losses: 4, gf: 29, ga: 20, form: ['E', 'V', 'V', 'E', 'V'], color: 'bg-blue-500', zone: 'libertadores' },
  { pos: 5, name: 'Botafogo', short: 'BOT', pts: 34, games: 21, wins: 9, draws: 7, losses: 5, gf: 27, ga: 22, form: ['V', 'E', 'D', 'V', 'E'], color: 'bg-slate-800', zone: 'pre-libertadores' },
  { pos: 6, name: 'Bragantino', short: 'RBB', pts: 33, games: 21, wins: 9, draws: 6, losses: 6, gf: 28, ga: 24, form: ['D', 'V', 'V', 'D', 'V'], color: 'bg-red-600', zone: 'sul-americana' },
  { pos: 7, name: 'São Paulo', short: 'SAO', pts: 31, games: 21, wins: 8, draws: 7, losses: 6, gf: 25, ga: 21, form: ['E', 'V', 'E', 'D', 'V'], color: 'bg-red-700', zone: 'sul-americana' },
  { pos: 8, name: 'Fluminense', short: 'FLU', pts: 30, games: 21, wins: 8, draws: 6, losses: 7, gf: 24, ga: 23, form: ['V', 'D', 'E', 'V', 'D'], color: 'bg-emerald-800', zone: 'sul-americana' },
  { pos: 9, name: 'Ceará', short: 'CEA', pts: 29, games: 21, wins: 7, draws: 8, losses: 6, gf: 22, ga: 20, form: ['E', 'E', 'V', 'D', 'V'], color: 'bg-slate-900', zone: 'sul-americana' },
  { pos: 10, name: 'Vasco', short: 'VAS', pts: 28, games: 21, wins: 7, draws: 7, losses: 7, gf: 25, ga: 27, form: ['D', 'V', 'E', 'V', 'D'], color: 'bg-slate-900', zone: 'sul-americana' },
  { pos: 11, name: 'Atlético-MG', short: 'CAM', pts: 27, games: 21, wins: 7, draws: 6, losses: 8, gf: 23, ga: 26, form: ['V', 'D', 'D', 'E', 'V'], color: 'bg-slate-800', zone: 'none' },
  { pos: 12, name: 'Grêmio', short: 'GRE', pts: 26, games: 21, wins: 7, draws: 5, losses: 9, gf: 22, ga: 28, form: ['D', 'E', 'V', 'D', 'E'], color: 'bg-blue-700', zone: 'none' },
  { pos: 13, name: 'Internacional', short: 'INT', pts: 25, games: 21, wins: 6, draws: 7, losses: 8, gf: 20, ga: 25, form: ['E', 'D', 'V', 'D', 'E'], color: 'bg-red-700', zone: 'none' },
  { pos: 14, name: 'Santos', short: 'SAN', pts: 24, games: 21, wins: 6, draws: 6, losses: 9, gf: 21, ga: 29, form: ['D', 'V', 'D', 'E', 'D'], color: 'bg-slate-200', zone: 'none' },
  { pos: 15, name: 'Fortaleza', short: 'FOR', pts: 23, games: 21, wins: 6, draws: 5, losses: 10, gf: 19, ga: 27, form: ['D', 'E', 'D', 'V', 'D'], color: 'bg-red-600', zone: 'none' },
  { pos: 16, name: 'Vitória', short: 'VIT', pts: 22, games: 21, wins: 5, draws: 7, losses: 9, gf: 18, ga: 28, form: ['E', 'D', 'D', 'E', 'V'], color: 'bg-red-700', zone: 'none' },
  { pos: 17, name: 'Juventude', short: 'JUV', pts: 20, games: 21, wins: 5, draws: 5, losses: 11, gf: 18, ga: 30, form: ['D', 'D', 'E', 'D', 'V'], color: 'bg-emerald-700', zone: 'rebaixamento' },
  { pos: 18, name: 'Sport', short: 'SPT', pts: 18, games: 21, wins: 4, draws: 6, losses: 11, gf: 17, ga: 31, form: ['D', 'E', 'D', 'D', 'D'], color: 'bg-red-700', zone: 'rebaixamento' },
  { pos: 19, name: 'Criciúma', short: 'CRI', pts: 16, games: 21, wins: 4, draws: 4, losses: 13, gf: 16, ga: 33, form: ['D', 'D', 'D', 'V', 'D'], color: 'bg-yellow-500', zone: 'rebaixamento' },
  { pos: 20, name: 'Atlético-GO', short: 'ACG', pts: 14, games: 21, wins: 3, draws: 5, losses: 13, gf: 15, ga: 35, form: ['D', 'D', 'E', 'D', 'D'], color: 'bg-red-600', zone: 'rebaixamento' },
]

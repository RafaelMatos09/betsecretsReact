export type ZonaClassificacao = 'libertadores' | 'pre-libertadores' | 'sul-americana' | 'rebaixamento' | 'none'

export interface ApiLegend {
  id: number
  name: string
  color: string
}

export interface ApiTeamRef {
  id: number
  name: string
  shortName: string
  badge: string
}

export interface ApiTableEntry {
  position: number
  team: ApiTeamRef
  points: number
  matches: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  efficiency: number
  movement: number
  recentForm: ('W' | 'D' | 'L')[]
  legend: ApiLegend | null
}

export interface ApiTable {
  id: string
  name: string
  round: { number: number; total: number; label: string }
  entries: ApiTableEntry[]
}

export interface ApiMatchTeam {
  id: number
  name: string
  shortName: string
  badge: string
}

export interface ApiMatchScore {
  home: number | null
  away: number | null
  penalties: unknown | null
}

export interface ApiMatch {
  id: number
  round: number
  totalRounds: number
  dateTime: string
  date: string
  time: string
  started: boolean
  status: string
  statusCode: string
  venue: string | null
  homeTeam: ApiMatchTeam
  awayTeam: ApiMatchTeam
  score: ApiMatchScore
}

export interface CampeonatoResponse {
  competition: { code: string; slug: string; name: string; season: number }
  legends: ApiLegend[]
  tables: ApiTable[]
  matches: ApiMatch[]
}

export interface RodadaStats {
  totalPartidas: number
  partidasAoVivo: number
  partidasEncerradas: number
  totalGols: number
  partidasEmpatadas: number
}

// Uma linha da tabela + contexto da rodada (denormalizado pra facilitar o consumo
// nos componentes, que só recebem um array de "items").
export interface ClassificacaoItem extends ApiTableEntry {
  roundNumber: number
  totalRounds: number
}

export interface ResumoClassificacao {
  rodadaAtual: number
  totalRodadas: number
  lider: { nome: string; pontos: number }
  melhorAtaque: { nome: string; gols: number; jogos: number }
  melhorDefesa: { nome: string; golsContra: number }
  mediaGolsPorJogo: number
}

export interface ProjecaoTime {
  timeId: number
  nome: string
  sigla: string
  zone: ZonaClassificacao
  aproveitamento: number
  variacaoPosicao: number
  posicaoAtual: number
  posicaoProjetada: number
  pontosAtuais: number
  pontosProjetados: number
  jogosRestantes: number
}

export interface ClassificacaoStats {
  lider: { nome: string; pontos: number }
  melhorAtaque: { nome: string; gols: number; jogos: number }
  maiorSequencia: { nome: string; vitorias: number }
  timeFavorito: { posicao: number; variacao: number } | null
}
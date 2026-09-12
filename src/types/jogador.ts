export interface Jogador {
  id?: number
  nome?: string
  apelido?: string
  dataNascimento?: string | null
  cpf?: string
  telefone?: string
  foto?: string
  peDominante?: string
  posicao?: string
  altura: number
  peso: number
  numeroPreferido: number
  createdAt?: string
}

export interface JogadorTime {
  id: number
  jogadorId: number
  timeId: number
  numeroCamisa: number
  dataInicio?: string | null
  dataFim?: string | null
  ativo?: boolean
  nome?: string
  apelido?: string
  foto?: string
  posicao?: string
  timeNome?: string
}

export type PosicaoFiltro = 'todos' | 'goleiros' | 'defensores' | 'meias' | 'atacantes'

export type PlayerStatus = 'disponivel' | 'reserva' | 'suspenso' | 'ausente'

export interface JogadorEstatisticas {
  jogos: number
  gols: number
  assistencias: number
  cartoesAmarelos: number
  cartoesVermelhos: number
  media: number
  presenca: number
}

export interface JogadorFormValues {
  nome: string
  apelido: string
  numeroCamisa: number
  posicao: string
  dataNascimento: string
  peDominante: string
  altura: number
  peso: number
  telefone: string
  foto: string
}

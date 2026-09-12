export interface EscalacaoState {
  formationId: string
  slots: Record<string, number>
}

export interface TimeSociety {
  id?: number
  bairroId?: number
  nome?: string
  sigla?: string
  escudo?: string
  corPrincipal?: string
  corSecundaria?: string
  anoFundacao: number
  tecnico?: string
  telefone?: string
  instagram?: string
  ativo?: boolean
}

export interface TimeDetalhe extends TimeSociety {
  bairroNome?: string
  cidade?: string
}

export interface Campeonato {
  id?: number
  nome?: string
  temporada: number
  descricao?: string
  tipo?: string
  dataInicio?: string | null
  dataFim?: string | null
  status?: string
  logo?: string
}

export interface PartidaEvento {
  id?: number
  partidaId?: number
  jogadorId?: number
  timeId?: number
  minuto?: number
  tipo?: string
  observacao?: string
  jogador?: string
  time?: string
  foto?: string
  gols?: number
}

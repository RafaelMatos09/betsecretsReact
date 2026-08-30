export interface TimeClassificacao {
  time_id: number
  nome_popular: string
  sigla: string
  escudo: string
}

export interface ClassificacaoItem {
  posicao: number
  pontos: number
  time: TimeClassificacao
  jogos: number
  vitorias: number
  empates: number
  derrotas: number
  gols_pro: number
  gols_contra: number
  saldo_gols: number
  aproveitamento: number
  variacao_posicao: number
  ultimos_jogos: ('v' | 'e' | 'd')[]
  faixa_classificacao: 'libertadores' | 'pre-libertadores' | 'sul-americana' | 'rebaixados' | null
}

export interface ClassificacaoStats {
  lider: {
    nome: string
    pontos: number
    escudo: string
    sigla: string
    color: string
  }
  melhorAtaque: {
    nome: string
    gols: number
    jogos: number
  }
  maiorSequencia: {
    nome: string
    vitorias: number
  }
  timeFavorito?: {
    posicao: number
    variacao: number
    nome: string
  }
}

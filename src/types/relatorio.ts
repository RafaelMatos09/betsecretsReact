export interface RelatorioPartidaJogador {
  partidaId?: number
  calendarioId?: number | null
  timeId?: number
  dataHora?: string | null
  dataPrevista?: string | null
  horarioPrevisto?: string | null
  timeCasaId?: number
  timeVisitanteId?: number
  timeCasa?: string
  timeVisitante?: string
  golsCasa?: number | null
  golsVisitante?: number | null
  titular: boolean
  numeroCamisa?: number | null
  minutoEntrada?: number | null
  minutoSaida?: number | null
  gols: number
  cartoesAmarelos: number
  cartoesVermelhos: number
  statusCalendario?: string | null
}

export interface RelatorioJogador {
  jogadorId: number
  nome?: string
  foto?: string
  posicao?: string
  timeId?: number
  timeNome?: string
  jogos: number
  titulares: number
  gols: number
  cartoesAmarelos: number
  cartoesVermelhos: number
  partidas: RelatorioPartidaJogador[]
}

export interface EstatisticaLado {
  timeId?: number
  timeNome?: string
  escudo?: string
  registrada: boolean
  gols: number
  chutes: number
  chutesGol: number
  posse?: number | null
  escanteios: number
  faltas: number
  impedimentos: number
  cartoesAmarelos: number
  cartoesVermelhos: number
  passes: number
  laterais: number
}

export interface RelatorioEstatistica {
  partidaId: number
  calendarioId?: number | null
  campeonatoId?: number
  dataHora?: string | null
  dataPrevista?: string | null
  horarioPrevisto?: string | null
  local?: string | null
  status?: string | null
  casa: EstatisticaLado
  visitante: EstatisticaLado
}

export interface SalvarEstatisticaPayload {
  partidaId: number
  timeId: number
  chutes: number
  chutesGol: number
  posse?: number | null
  escanteios: number
  faltas: number
  impedimentos: number
  cartoesAmarelos: number
  cartoesVermelhos: number
  passes: number
  laterais: number
}

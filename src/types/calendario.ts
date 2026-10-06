export type StatusCalendario = 'previsto' | 'confirmado' | 'adiado' | 'cancelado' | 'realizado'

export interface CalendarioJogo {
  id?: number
  campeonatoId?: number
  rodadaId?: number | null
  partidaId?: number | null
  timeCasaId?: number
  timeVisitanteId?: number
  dataPrevista?: string | null
  horarioPrevisto?: string | null
  localPrevisto?: string | null
  status?: StatusCalendario | string
  observacoes?: string | null
  timeCasa?: string
  timeVisitante?: string
  siglaCasa?: string
  siglaVisitante?: string
  escudoCasa?: string
  escudoVisitante?: string
  rodadaNumero?: number | null
  campeonatoNome?: string
}

export interface EscalacaoJogoItem {
  id?: number
  partidaId?: number
  jogadorId: number
  timeId?: number
  titular: boolean
  numeroCamisa?: number | null
  posicao?: string | null
  minutoEntrada?: number | null
  minutoSaida?: number | null
  nome?: string
  foto?: string
}

export interface AgendarJogoValues {
  campeonatoId: number
  timeCasaId: number
  timeVisitanteId: number
  dataPrevista: string
  horarioPrevisto: string
  localPrevisto: string
  observacoes: string
}

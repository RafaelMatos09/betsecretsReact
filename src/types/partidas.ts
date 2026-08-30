export interface TimePartida {
  time_id: number
  nome_popular: string
  sigla: string
  escudo: string
}

export interface CampeonatoResumo {
  campeonato_id: number
  nome: string
  slug: string
}

export interface Estadio {
  estadio_id: number
  nome_popular: string
}

export interface PartidaAoVivo {
  partida_id: number
  campeonato: CampeonatoResumo
  placar: string
  time_mandante: TimePartida
  time_visitante: TimePartida
  placar_mandante: number | null
  placar_visitante: number | null
  disputa_penalti: boolean
  status: string
  slug: string
  data_realizacao: string
  hora_realizacao: string
  data_realizacao_iso: string
  estadio: Estadio | null
  _link: string
}

export interface AoVivoStats {
  totalPartidas: number
  totalCampeonatos: number
  totalGols: number
  partidasEmpatadas: number
}

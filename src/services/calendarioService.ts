import type { AgendarJogoValues, CalendarioJogo, EscalacaoJogoItem, StatusCalendario } from '@/types/calendario'
import api from './api'

export async function listarJogos(filtros?: {
  campeonatoId?: number
  timeId?: number
}): Promise<CalendarioJogo[]> {
  const { data } = await api.get<CalendarioJogo[]>('/api/CalendarioJogo/listar', {
    params: {
      campeonatoId: filtros?.campeonatoId || undefined,
      timeId: filtros?.timeId || undefined,
    },
  })
  return data
}

export async function cadastrarJogo(values: AgendarJogoValues): Promise<CalendarioJogo> {
  const { data } = await api.post<CalendarioJogo>('/api/CalendarioJogo/cadastrar', {
    campeonatoId: values.campeonatoId,
    timeCasaId: values.timeCasaId,
    timeVisitanteId: values.timeVisitanteId,
    dataPrevista: values.dataPrevista,
    horarioPrevisto: values.horarioPrevisto ? `${values.horarioPrevisto}:00`.slice(0, 8) : null,
    localPrevisto: values.localPrevisto || null,
    observacoes: values.observacoes || null,
    status: 'previsto',
  })
  return data
}

export async function atualizarStatus(
  id: number,
  status: StatusCalendario,
  observacoes?: string | null,
): Promise<void> {
  await api.put(`/api/CalendarioJogo/atualizar-status/${id}`, {
    status,
    observacoes: observacoes ?? null,
  })
}

export async function confirmarJogo(
  id: number,
  payload: { dataPrevista: string; horarioPrevisto?: string | null; localPrevisto?: string | null },
): Promise<void> {
  await api.put(`/api/CalendarioJogo/confirmar/${id}`, {
    dataPrevista: payload.dataPrevista,
    horarioPrevisto: payload.horarioPrevisto ? `${payload.horarioPrevisto}:00`.slice(0, 8) : null,
    localPrevisto: payload.localPrevisto ?? null,
  })
}

export async function oficializarJogo(id: number): Promise<CalendarioJogo> {
  const { data } = await api.put<CalendarioJogo>(`/api/CalendarioJogo/oficializar/${id}`)
  return data
}

export async function excluirJogo(id: number): Promise<void> {
  await api.delete(`/api/CalendarioJogo/excluir/${id}`)
}

export async function salvarEscalacaoTime(payload: {
  partidaId: number
  timeId: number
  jogadores: EscalacaoJogoItem[]
}): Promise<EscalacaoJogoItem[]> {
  const { data } = await api.post<EscalacaoJogoItem[]>('/api/EscalacaoJogo/salvar-time', payload)
  return data
}

export async function listarEscalacaoTime(partidaId: number, timeId: number): Promise<EscalacaoJogoItem[]> {
  const { data } = await api.get<EscalacaoJogoItem[]>(
    `/api/EscalacaoJogo/listar-time/${partidaId}/${timeId}`,
  )
  return data
}

export async function listarEscalacaoPartida(partidaId: number): Promise<EscalacaoJogoItem[]> {
  const { data } = await api.get<EscalacaoJogoItem[]>(`/api/EscalacaoJogo/listar-partida/${partidaId}`)
  return data
}

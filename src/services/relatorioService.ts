import type { RelatorioEstatistica, RelatorioJogador, SalvarEstatisticaPayload } from '@/types/relatorio'
import api from './api'

export async function listarJogadores(filtros?: {
  campeonatoId?: number
  timeId?: number
}): Promise<RelatorioJogador[]> {
  const { data } = await api.get<RelatorioJogador[]>('/api/Relatorio/jogadores', {
    params: {
      campeonatoId: filtros?.campeonatoId || undefined,
      timeId: filtros?.timeId || undefined,
    },
  })
  return data
}

export async function listarEstatisticas(filtros?: {
  campeonatoId?: number
  timeId?: number
}): Promise<RelatorioEstatistica[]> {
  const { data } = await api.get<RelatorioEstatistica[]>('/api/Relatorio/estatisticas', {
    params: {
      campeonatoId: filtros?.campeonatoId || undefined,
      timeId: filtros?.timeId || undefined,
    },
  })
  return data
}

export async function salvarEstatistica(payload: SalvarEstatisticaPayload): Promise<void> {
  await api.post('/api/Relatorio/salvar-estatistica', payload)
}

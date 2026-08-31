import axios from 'axios'
import type { CampeonatoResponse } from '@/types/tabela'
import api from './renderApi'

export type SerieCampeonato = 'a' | 'b' | 'c' | 'd'

export async function getClassificacaoBrasileirao(
  serie: SerieCampeonato = 'a',
): Promise<CampeonatoResponse> {
  try {
    const { data } = await api.get<CampeonatoResponse>(
      `${serie}`,
      { skipAuth: true },
    )
    return data
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      const { data } = await api.get<CampeonatoResponse>(
        `${serie}`,
      )
      return data
    }
    throw err
  }
}
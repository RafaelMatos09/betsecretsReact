import axios from 'axios'
import type { ClassificacaoItem } from '@/types/tabela'
import api from './api'

export async function getClassificacaoBrasileirao(): Promise<ClassificacaoItem[]> {
  try {
    const { data } = await api.get<ClassificacaoItem[]>('/api/tabela/brasileirao', { skipAuth: true })
    return data
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      const { data } = await api.get<ClassificacaoItem[]>('/api/tabela/brasileirao')
      return data
    }
    throw err
  }
}

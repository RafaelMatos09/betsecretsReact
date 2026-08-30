import axios from 'axios'
import type { PartidaAoVivo } from '@/types/partidas'
import api from './api'

export async function getPartidasAoVivo(): Promise<PartidaAoVivo[]> {
  try {
    const { data } = await api.get<PartidaAoVivo[]>('/api/partidas/ao-vivo', { skipAuth: true })
    return data
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      const { data } = await api.get<PartidaAoVivo[]>('/api/partidas/ao-vivo')
      return data
    }
    throw err
  }
}

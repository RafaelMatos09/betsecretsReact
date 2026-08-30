import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { getPartidasAoVivo } from '@/services/partidasService'
import type { AoVivoStats, PartidaAoVivo } from '@/types/partidas'
import { buildAoVivoStats } from '../utils/aoVivoStats'

interface UseAoVivoResult {
  partidas: PartidaAoVivo[]
  stats: AoVivoStats | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useAoVivo(): UseAoVivoResult {
  const [partidas, setPartidas] = useState<PartidaAoVivo[]>([])
  const [stats, setStats] = useState<AoVivoStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPartidasAoVivo()
      setPartidas(data)
      setStats(buildAoVivoStats(data))
    } catch (err) {
      const message = axios.isAxiosError(err) && err.response?.status === 401
        ? 'Acesso negado às partidas ao vivo. Verifique se o endpoint está com AllowAnonymous no backend.'
        : 'Não foi possível carregar as partidas ao vivo.'
      setError(message)
      setPartidas([])
      setStats(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { partidas, stats, loading, error, refresh }
}

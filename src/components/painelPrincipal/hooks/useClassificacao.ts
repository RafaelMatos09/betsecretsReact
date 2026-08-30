import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { getClassificacaoBrasileirao } from '@/services/tabelaService'
import type { ClassificacaoItem, ClassificacaoStats } from '@/types/tabela'
import type { Team } from '../data/teams'
import { buildClassificacaoStats, mapClassificacaoToTeams } from '../utils/tabelaStats'

const FAVORITE_KEY = 'betsecrets_favorite_team'

interface UseClassificacaoResult {
  teams: Team[]
  items: ClassificacaoItem[]
  stats: ClassificacaoStats | null
  loading: boolean
  error: string | null
  round: string
  favorite: string
  setFavorite: (name: string) => void
  cycleFavorite: () => void
  refresh: () => Promise<void>
}

export function useClassificacao(): UseClassificacaoResult {
  const [rawData, setRawData] = useState<ClassificacaoItem[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [stats, setStats] = useState<ClassificacaoStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [round, setRound] = useState('Rodada 38')
  const [favorite, setFavoriteState] = useState(() => localStorage.getItem(FAVORITE_KEY) ?? 'Flamengo')

  const setFavorite = useCallback((name: string) => {
    setFavoriteState(name)
    localStorage.setItem(FAVORITE_KEY, name)
  }, [])

  const cycleFavorite = useCallback(() => {
    if (teams.length === 0) return
    const idx = teams.findIndex((team) => team.name === favorite)
    const nextTeam = teams[(idx + 1) % teams.length]
    setFavorite(nextTeam.name)
  }, [teams, favorite, setFavorite])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getClassificacaoBrasileirao()
      const mappedTeams = mapClassificacaoToTeams(data)
      setRawData(data)
      setTeams(mappedTeams)
      if (mappedTeams[0]) {
        setRound(`Rodada ${mappedTeams[0].games}`)
      }
    } catch (err) {
      const message = axios.isAxiosError(err) && err.response?.status === 401
        ? 'Acesso negado à classificação. Verifique se o endpoint está com AllowAnonymous no backend.'
        : 'Não foi possível carregar a classificação do Brasileirão.'
      setError(message)
      setRawData([])
      setTeams([])
      setStats(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (rawData.length > 0) {
      setStats(buildClassificacaoStats(rawData, favorite))
    }
  }, [favorite, rawData])

  return { teams, items: rawData, stats, loading, error, round, favorite, setFavorite, cycleFavorite, refresh }
}

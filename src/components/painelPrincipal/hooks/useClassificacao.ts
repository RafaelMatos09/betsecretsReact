import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { getClassificacaoBrasileirao, type SerieCampeonato } from '@/services/tabelaService'
import type { ClassificacaoItem, ClassificacaoStats, ApiMatch } from '@/types/tabela'
import type { Team } from '../data/teams'
import { buildClassificacaoStats, mapClassificacaoToTeams } from '../utils/tabelaStats'

const FAVORITE_KEY = 'betsecrets_favorite_team'
const SERIE_KEY = 'betsecrets_serie'

interface UseClassificacaoResult {
  teams: Team[]
  items: ClassificacaoItem[]
  matches: ApiMatch[]
  competitionName: string
  stats: ClassificacaoStats | null
  loading: boolean
  error: string | null
  round: string
  serie: SerieCampeonato
  setSerie: (serie: SerieCampeonato) => void
  favorite: string
  setFavorite: (name: string) => void
  cycleFavorite: () => void
  refresh: () => Promise<void>
}

export function useClassificacao(): UseClassificacaoResult {
  const [items, setItems] = useState<ClassificacaoItem[]>([])
  const [matches, setMatches] = useState<ApiMatch[]>([])
  const [competitionName, setCompetitionName] = useState('')
  const [teams, setTeams] = useState<Team[]>([])
  const [stats, setStats] = useState<ClassificacaoStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [round, setRound] = useState('')
  const [serie, setSerieState] = useState<SerieCampeonato>(
    () => (localStorage.getItem(SERIE_KEY) as SerieCampeonato) || 'a',
  )
  const [favorite, setFavoriteState] = useState(() => localStorage.getItem(FAVORITE_KEY) ?? 'Flamengo')

  const setFavorite = useCallback((name: string) => {
    setFavoriteState(name)
    localStorage.setItem(FAVORITE_KEY, name)
  }, [])

  const setSerie = useCallback((novaSerie: SerieCampeonato) => {
    setSerieState(novaSerie)
    localStorage.setItem(SERIE_KEY, novaSerie)
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
      const data = await getClassificacaoBrasileirao(serie)
      const table = data.tables[0]
      const enrichedItems: ClassificacaoItem[] = (table?.entries ?? []).map((entry) => ({
        ...entry,
        roundNumber: table.round.number,
        totalRounds: table.round.total,
      }))

      setItems(enrichedItems)
      setMatches(data.matches ?? [])
      setCompetitionName(data.competition.name)
      setTeams(mapClassificacaoToTeams(enrichedItems))
      if (table) setRound(`Rodada ${table.round.number} de ${table.round.total}`)
    } catch (err) {
      const message = axios.isAxiosError(err) && err.response?.status === 401
        ? 'Acesso negado à classificação. Verifique se o endpoint está com AllowAnonymous no backend.'
        : 'Não foi possível carregar a classificação.'
      setError(message)
      setItems([])
      setMatches([])
      setCompetitionName('')
      setTeams([])
      setStats(null)
    } finally {
      setLoading(false)
    }
  }, [serie])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (items.length > 0) setStats(buildClassificacaoStats(items, favorite))
  }, [favorite, items])

  return {
    teams,
    items,
    matches,
    competitionName,
    stats,
    loading,
    error,
    round,
    serie,
    setSerie,
    favorite,
    setFavorite,
    cycleFavorite,
    refresh,
  }
}
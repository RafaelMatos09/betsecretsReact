import type {
  ApiLegend,
  ApiMatch,
  ClassificacaoItem,
  ClassificacaoStats,
  ProjecaoTime,
  ResumoClassificacao,
  RodadaStats,
  ZonaClassificacao,
} from '@/types/tabela'
import type { Team } from '../data/teams'

function mapZone(legend: ApiLegend | null): ZonaClassificacao {
  if (!legend) return 'none'
  switch (legend.name) {
    case 'Libertadores':
      return 'libertadores'
    case 'Pré-Libertadores':
      return 'pre-libertadores'
    case 'Sul-Americana':
      return 'sul-americana'
    case 'Rebaixados':
      return 'rebaixamento'
    default:
      return 'none'
  }
}

// W/D/L da API -> V/E/D usado no restante do front
function mapForm(form: ('W' | 'D' | 'L')[]): string[] {
  return form.map((r) => (r === 'W' ? 'V' : r === 'L' ? 'D' : 'E'))
}

// fallback só entra quando não há escudo (TeamMark prioriza a imagem da API)
const FALLBACK_COLORS: Record<string, string> = {
  FLA: 'bg-red-700',
  PAL: 'bg-emerald-700',
  CRU: 'bg-blue-700',
  BAH: 'bg-blue-500',
  BOT: 'bg-slate-800',
  RBB: 'bg-red-600',
  SAO: 'bg-red-700',
  FLU: 'bg-emerald-800',
  VAS: 'bg-slate-900',
  CAM: 'bg-slate-800',
  GRE: 'bg-blue-700',
  INT: 'bg-red-700',
  SAN: 'bg-slate-200',
}

function colorForTeam(shortName: string): string {
  return FALLBACK_COLORS[shortName] ?? 'bg-slate-700'
}

export function mapClassificacaoToTeams(items: ClassificacaoItem[]): Team[] {
  return [...items]
    .sort((a, b) => a.position - b.position)
    .map((item) => ({
      pos: item.position,
      name: item.team.name,
      short: item.team.shortName,
      pts: item.points,
      games: item.matches,
      wins: item.wins,
      draws: item.draws,
      losses: item.losses,
      gf: item.goalsFor,
      ga: item.goalsAgainst,
      saldo: item.goalDifference,
      aproveitamento: item.efficiency,
      variacao: item.movement,
      form: mapForm(item.recentForm),
      color: colorForTeam(item.team.shortName),
      zone: mapZone(item.legend),
      escudo: item.team.badge,
      timeId: item.team.id,
    }))
}

function currentWinStreak(form: ('W' | 'D' | 'L')[]): number {
  let streak = 0
  for (let i = form.length - 1; i >= 0; i -= 1) {
    if (form[i] !== 'W') break
    streak += 1
  }
  return streak
}

export function buildClassificacaoStats(items: ClassificacaoItem[], favorite: string): ClassificacaoStats {
  if (items.length === 0) {
    return {
      lider: { nome: '—', pontos: 0 },
      melhorAtaque: { nome: '—', gols: 0, jogos: 0 },
      maiorSequencia: { nome: '—', vitorias: 0 },
      timeFavorito: null,
    }
  }

  const lider = items.reduce((best, item) => (item.position < best.position ? item : best), items[0])
  const melhorAtaque = items.reduce((best, item) => (item.goalsFor > best.goalsFor ? item : best), items[0])

  const maiorSequencia = items.reduce(
    (best, item) => {
      const streak = currentWinStreak(item.recentForm)
      return streak > best.streak ? { item, streak } : best
    },
    { item: items[0], streak: currentWinStreak(items[0].recentForm) },
  )

  const favoritoItem = items.find((item) => item.team.name === favorite) ?? null

  return {
    lider: { nome: lider.team.name, pontos: lider.points },
    melhorAtaque: { nome: melhorAtaque.team.name, gols: melhorAtaque.goalsFor, jogos: melhorAtaque.matches },
    maiorSequencia: { nome: maiorSequencia.item.team.name, vitorias: maiorSequencia.streak },
    timeFavorito: favoritoItem ? { posicao: favoritoItem.position, variacao: favoritoItem.movement } : null,
  }
}

export function buildResumoClassificacao(items: ClassificacaoItem[]): ResumoClassificacao {
  if (items.length === 0) {
    return {
      rodadaAtual: 0,
      totalRodadas: 38,
      lider: { nome: '—', pontos: 0 },
      melhorAtaque: { nome: '—', gols: 0, jogos: 0 },
      melhorDefesa: { nome: '—', golsContra: 0 },
      mediaGolsPorJogo: 0,
    }
  }

  const lider = items.reduce((best, item) => (item.position < best.position ? item : best), items[0])
  const melhorAtaque = items.reduce((best, item) => (item.goalsFor > best.goalsFor ? item : best), items[0])
  const melhorDefesa = items.reduce((best, item) => (item.goalsAgainst < best.goalsAgainst ? item : best), items[0])

  const totalGols = items.reduce((sum, item) => sum + item.goalsFor, 0)
  const totalPartidas = items.reduce((sum, item) => sum + item.matches, 0) / 2
  const mediaGolsPorJogo = totalPartidas > 0 ? Number((totalGols / totalPartidas).toFixed(2)) : 0

  return {
    rodadaAtual: items[0].roundNumber,
    totalRodadas: items[0].totalRounds,
    lider: { nome: lider.team.name, pontos: lider.points },
    melhorAtaque: { nome: melhorAtaque.team.name, gols: melhorAtaque.goalsFor, jogos: melhorAtaque.matches },
    melhorDefesa: { nome: melhorDefesa.team.name, golsContra: melhorDefesa.goalsAgainst },
    mediaGolsPorJogo,
  }
}

export function buildProjecoesClassificacao(items: ClassificacaoItem[]): ProjecaoTime[] {
  if (items.length === 0) return []

  const totalRodadas = items[0].totalRounds

  const base = items.map((item) => {
    const jogosRestantes = Math.max(totalRodadas - item.matches, 0)
    const pontosPorJogo = item.matches > 0 ? item.points / item.matches : 0
    const pontosProjetados = Math.round(item.points + pontosPorJogo * jogosRestantes)
    return { item, jogosRestantes, pontosProjetados }
  })

  const posicaoProjetadaPorId = new Map<number, number>()
  ;[...base]
    .sort((a, b) => b.pontosProjetados - a.pontosProjetados)
    .forEach((entry, idx) => posicaoProjetadaPorId.set(entry.item.team.id, idx + 1))

  return base.map(({ item, jogosRestantes, pontosProjetados }) => {
    const posicaoProjetada = posicaoProjetadaPorId.get(item.team.id) ?? item.position
    return {
      timeId: item.team.id,
      nome: item.team.name,
      sigla: item.team.shortName,
      zone: mapZone(item.legend),
      aproveitamento: item.efficiency,
      variacaoPosicao: item.position - posicaoProjetada,
      posicaoAtual: item.position,
      posicaoProjetada,
      pontosAtuais: item.points,
      pontosProjetados,
      jogosRestantes,
    }
  })
}

export function formatSaldoGols(saldo: number): string {
  return saldo > 0 ? `+${saldo}` : `${saldo}`
}

export function formatVariacao(variacao: number): string {
  if (variacao > 0) return `▲ ${variacao} posições`
  if (variacao < 0) return `▼ ${Math.abs(variacao)} posições`
  return '— sem alteração'
}

export function isMatchLive(status: string): boolean {
  return status === 'live' || status === 'interval'
}

export function formatMatchStatus(status: string): string {
  const labels: Record<string, string> = {
    live: 'Ao vivo',
    finished: 'Encerrado',
    scheduled: 'Agendado',
    postponed: 'Adiado',
    cancelled: 'Cancelado',
    interval: 'Intervalo',
  }
  return labels[status] ?? status
}

export function buildRodadaStats(matches: ApiMatch[]): RodadaStats {
  let totalGols = 0
  let partidasEmpatadas = 0
  let partidasAoVivo = 0
  let partidasEncerradas = 0

  for (const match of matches) {
    const home = match.score.home ?? 0
    const away = match.score.away ?? 0
    totalGols += home + away
    if (home === away && match.started) partidasEmpatadas += 1
    if (isMatchLive(match.status)) partidasAoVivo += 1
    if (match.status === 'finished') partidasEncerradas += 1
  }

  return {
    totalPartidas: matches.length,
    partidasAoVivo,
    partidasEncerradas,
    totalGols,
    partidasEmpatadas,
  }
}
import type { Team, TeamZone } from '../data/teams'
import type { ClassificacaoItem, ClassificacaoStats } from '@/types/tabela'

const teamColors: Record<string, string> = {
  FLA: 'bg-red-700',
  PAL: 'bg-emerald-700',
  CRU: 'bg-blue-700',
  MIR: 'bg-yellow-500',
  FLU: 'bg-emerald-800',
  BOT: 'bg-slate-800',
  BAH: 'bg-blue-500',
  SAO: 'bg-red-700',
  GRE: 'bg-blue-700',
  BGT: 'bg-red-600',
  CAM: 'bg-slate-800',
  SAN: 'bg-slate-200 text-slate-900',
  COR: 'bg-slate-900',
  VAS: 'bg-slate-900',
  VIT: 'bg-red-700',
  INT: 'bg-red-700',
  CEA: 'bg-slate-900',
  FOR: 'bg-red-600',
  JUV: 'bg-emerald-700',
  SPO: 'bg-red-700',
}

function mapZone(faixa: ClassificacaoItem['faixa_classificacao']): TeamZone {
  switch (faixa) {
    case 'libertadores':
      return 'libertadores'
    case 'pre-libertadores':
      return 'pre-libertadores'
    case 'sul-americana':
      return 'sul-americana'
    case 'rebaixados':
      return 'rebaixamento'
    default:
      return 'none'
  }
}

function mapForm(ultimosJogos: ClassificacaoItem['ultimos_jogos']): string[] {
  return ultimosJogos.map((resultado) => resultado.toUpperCase())
}

function countWinStreak(ultimosJogos: ClassificacaoItem['ultimos_jogos']): number {
  let streak = 0
  for (let i = ultimosJogos.length - 1; i >= 0; i -= 1) {
    if (ultimosJogos[i] === 'v') streak += 1
    else break
  }
  return streak
}

export function mapClassificacaoToTeams(items: ClassificacaoItem[]): Team[] {
  return items.map((item) => ({
    pos: item.posicao,
    name: item.time.nome_popular,
    short: item.time.sigla,
    pts: item.pontos,
    games: item.jogos,
    wins: item.vitorias,
    draws: item.empates,
    losses: item.derrotas,
    gf: item.gols_pro,
    ga: item.gols_contra,
    saldo: item.saldo_gols,
    aproveitamento: item.aproveitamento,
    variacao: item.variacao_posicao,
    form: mapForm(item.ultimos_jogos),
    color: teamColors[item.time.sigla] ?? 'bg-slate-700',
    zone: mapZone(item.faixa_classificacao),
    escudo: item.time.escudo,
    timeId: item.time.time_id,
  }))
}

export function buildClassificacaoStats(items: ClassificacaoItem[], favorite?: string): ClassificacaoStats {
  const lider = items[0]
  const melhorAtaque = items.reduce((best, current) =>
    current.gols_pro > best.gols_pro ? current : best,
  )
  const maiorSequencia = items.reduce((best, current) => {
    const streak = countWinStreak(current.ultimos_jogos)
    const bestStreak = countWinStreak(best.ultimos_jogos)
    return streak > bestStreak ? current : best
  })

  const stats: ClassificacaoStats = {
    lider: {
      nome: lider.time.nome_popular,
      pontos: lider.pontos,
      escudo: lider.time.escudo,
      sigla: lider.time.sigla,
      color: teamColors[lider.time.sigla] ?? 'bg-slate-700',
    },
    melhorAtaque: {
      nome: melhorAtaque.time.nome_popular,
      gols: melhorAtaque.gols_pro,
      jogos: melhorAtaque.jogos,
    },
    maiorSequencia: {
      nome: maiorSequencia.time.nome_popular,
      vitorias: countWinStreak(maiorSequencia.ultimos_jogos),
    },
  }

  if (favorite) {
    const favorito = items.find((item) => item.time.nome_popular === favorite)
    if (favorito) {
      stats.timeFavorito = {
        posicao: favorito.posicao,
        variacao: favorito.variacao_posicao,
        nome: favorito.time.nome_popular,
      }
    }
  }

  return stats
}

export function formatSaldoGols(saldo: number): string {
  if (saldo > 0) return `+${saldo}`
  return String(saldo)
}

export function formatVariacao(variacao: number): string {
  if (variacao > 0) return `+${variacao} posições`
  if (variacao < 0) return `${variacao} posições`
  return 'sem alteração'
}

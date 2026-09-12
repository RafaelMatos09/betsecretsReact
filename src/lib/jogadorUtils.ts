import type { JogadorTime, PlayerStatus, PosicaoFiltro } from '@/types/jogador'

export function getInitials(name?: string) {
  if (!name?.trim()) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function calcAge(isoDate?: string | null) {
  if (!isoDate) return null
  const birth = new Date(isoDate)
  if (Number.isNaN(birth.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const monthDiff = now.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age -= 1
  return age
}

export function categoriaPosicao(posicao?: string): Exclude<PosicaoFiltro, 'todos'> | 'outros' {
  const value = (posicao ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (!value) return 'outros'
  if (/(gol|gk|goleiro)/.test(value)) return 'goleiros'
  if (/(def|zag|lateral|beque)/.test(value)) return 'defensores'
  if (/(mei|vol|armador|mid)/.test(value)) return 'meias'
  if (/(ata|ponta|centroav|st|fwd)/.test(value)) return 'atacantes'
  return 'outros'
}

export function displayName(player: Pick<JogadorTime, 'apelido' | 'nome'>) {
  return player.apelido?.trim() || player.nome?.trim() || 'Jogador'
}

export function statusLabel(status: PlayerStatus) {
  const map: Record<PlayerStatus, string> = {
    disponivel: 'Disponível',
    reserva: 'Reserva',
    suspenso: 'Suspenso',
    ausente: 'Ausente',
  }
  return map[status]
}

export function statusRing(status: PlayerStatus) {
  const map: Record<PlayerStatus, string> = {
    disponivel: 'ring-emerald-400',
    reserva: 'ring-amber-400',
    suspenso: 'ring-red-500',
    ausente: 'ring-zinc-400',
  }
  return map[status]
}

export function statusDot(status: PlayerStatus) {
  const map: Record<PlayerStatus, string> = {
    disponivel: 'bg-emerald-400',
    reserva: 'bg-amber-400',
    suspenso: 'bg-red-500',
    ausente: 'bg-zinc-400',
  }
  return map[status]
}

export function emptyStats() {
  return {
    jogos: 0,
    gols: 0,
    assistencias: 0,
    cartoesAmarelos: 0,
    cartoesVermelhos: 0,
    media: 0,
    presenca: 0,
  }
}

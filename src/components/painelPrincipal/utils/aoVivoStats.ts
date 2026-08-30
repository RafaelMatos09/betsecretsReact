import type { AoVivoStats, PartidaAoVivo } from '@/types/partidas'

export function buildAoVivoStats(partidas: PartidaAoVivo[]): AoVivoStats {
  const campeonatos = new Set(partidas.map((partida) => partida.campeonato.campeonato_id))

  let totalGols = 0
  let partidasEmpatadas = 0

  for (const partida of partidas) {
    const mandante = partida.placar_mandante ?? 0
    const visitante = partida.placar_visitante ?? 0
    totalGols += mandante + visitante
    if (mandante === visitante) partidasEmpatadas += 1
  }

  return {
    totalPartidas: partidas.length,
    totalCampeonatos: campeonatos.size,
    totalGols,
    partidasEmpatadas,
  }
}

export function formatStatusPartida(status: string, disputaPenalti: boolean): string {
  if (disputaPenalti) return 'Pênaltis'

  const labels: Record<string, string> = {
    andamento: 'Ao vivo',
    encerrado: 'Encerrado',
    agendado: 'Agendado',
    adiado: 'Adiado',
    cancelado: 'Cancelado',
    'intervalo': 'Intervalo',
  }

  return labels[status] ?? status
}

export function isPartidaAoVivo(status: string): boolean {
  return status === 'andamento' || status === 'intervalo'
}

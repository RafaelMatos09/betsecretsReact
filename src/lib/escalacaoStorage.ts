import { DEFAULT_FORMATION_ID } from '@/lib/formacoes'
import type { EscalacaoState } from '@/types/escalacao'

const TIME_KEY = 'betsecrets_society_time_id'

function lineupKey(timeId: number) {
  return `betsecrets_society_lineup_${timeId}`
}

export function readSelectedTimeId(): number | null {
  const raw = localStorage.getItem(TIME_KEY)
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

export function writeSelectedTimeId(timeId: number) {
  localStorage.setItem(TIME_KEY, String(timeId))
}

export function readEscalacao(timeId: number): EscalacaoState {
  const raw = localStorage.getItem(lineupKey(timeId))
  if (!raw) return { formationId: DEFAULT_FORMATION_ID, slots: {} }
  try {
    const parsed = JSON.parse(raw) as EscalacaoState
    return {
      formationId: parsed.formationId || DEFAULT_FORMATION_ID,
      slots: parsed.slots ?? {},
    }
  } catch {
    return { formationId: DEFAULT_FORMATION_ID, slots: {} }
  }
}

export function writeEscalacao(timeId: number, state: EscalacaoState) {
  localStorage.setItem(lineupKey(timeId), JSON.stringify(state))
}

import type { Formation } from '@/types/formacao'

export const FORMATIONS: Formation[] = [
  {
    id: '1-2-2-1',
    label: '1-2-2-1',
    slots: [
      { id: 'gk', role: 'GK', label: 'Goleiro', x: 50, y: 90 },
      { id: 'def-l', role: 'DEF', label: 'Defensor esquerdo', x: 28, y: 68 },
      { id: 'def-r', role: 'DEF', label: 'Defensor direito', x: 72, y: 68 },
      { id: 'mid-l', role: 'MID', label: 'Meia esquerdo', x: 28, y: 42 },
      { id: 'mid-r', role: 'MID', label: 'Meia direito', x: 72, y: 42 },
      { id: 'fwd', role: 'FWD', label: 'Atacante', x: 50, y: 16 },
    ],
  },
  {
    id: '1-3-1-1',
    label: '1-3-1-1',
    slots: [
      { id: 'gk', role: 'GK', label: 'Goleiro', x: 50, y: 90 },
      { id: 'def-l', role: 'DEF', label: 'Defensor esquerdo', x: 20, y: 68 },
      { id: 'def-c', role: 'DEF', label: 'Defensor central', x: 50, y: 70 },
      { id: 'def-r', role: 'DEF', label: 'Defensor direito', x: 80, y: 68 },
      { id: 'mid', role: 'MID', label: 'Meia', x: 50, y: 42 },
      { id: 'fwd', role: 'FWD', label: 'Atacante', x: 50, y: 16 },
    ],
  },
  {
    id: '1-1-3-1',
    label: '1-1-3-1',
    slots: [
      { id: 'gk', role: 'GK', label: 'Goleiro', x: 50, y: 90 },
      { id: 'def', role: 'DEF', label: 'Defensor', x: 50, y: 70 },
      { id: 'mid-l', role: 'MID', label: 'Meia esquerdo', x: 18, y: 42 },
      { id: 'mid-c', role: 'MID', label: 'Meia central', x: 50, y: 44 },
      { id: 'mid-r', role: 'MID', label: 'Meia direito', x: 82, y: 42 },
      { id: 'fwd', role: 'FWD', label: 'Atacante', x: 50, y: 16 },
    ],
  },
  {
    id: '2-2-1',
    label: '2-2-1',
    slots: [
      { id: 'gk', role: 'GK', label: 'Goleiro', x: 50, y: 90 },
      { id: 'def-l', role: 'DEF', label: 'Defensor esquerdo', x: 30, y: 66 },
      { id: 'def-r', role: 'DEF', label: 'Defensor direito', x: 70, y: 66 },
      { id: 'mid-l', role: 'MID', label: 'Meia esquerdo', x: 30, y: 40 },
      { id: 'mid-r', role: 'MID', label: 'Meia direito', x: 70, y: 40 },
      { id: 'fwd', role: 'FWD', label: 'Atacante', x: 50, y: 16 },
    ],
  },
]

export const DEFAULT_FORMATION_ID = '1-2-2-1'

export function getFormation(id: string): Formation {
  return FORMATIONS.find((item) => item.id === id) ?? FORMATIONS[0]
}

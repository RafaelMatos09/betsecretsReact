export type SlotRole = 'GK' | 'DEF' | 'MID' | 'FWD'

export interface FormationSlot {
  id: string
  role: SlotRole
  label: string
  x: number
  y: number
}

export interface Formation {
  id: string
  label: string
  slots: FormationSlot[]
}

import { FORMATIONS } from '@/lib/formacoes'

interface FormationSelectorProps {
  value: string
  onChange: (id: string) => void
}

export function FormationSelector({ value, onChange }: FormationSelectorProps) {
  return (
    <label className="flex h-9 items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm">
      <span className="hidden text-xs text-muted-foreground sm:inline">Formação</span>
      <select
        className="bg-transparent font-semibold outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {FORMATIONS.map((formation) => (
          <option key={formation.id} value={formation.id}>
            {formation.label}
          </option>
        ))}
      </select>
    </label>
  )
}

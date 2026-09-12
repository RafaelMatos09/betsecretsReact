import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { PlayerAvatar } from './PlayerAvatar'
import type { JogadorFormValues } from '@/types/jogador'

interface PlayerModalProps {
  open: boolean
  title: string
  initial?: Partial<JogadorFormValues>
  saving?: boolean
  onClose: () => void
  onSave: (values: JogadorFormValues) => void
}

const emptyForm: JogadorFormValues = {
  nome: '',
  apelido: '',
  numeroCamisa: 0,
  posicao: 'Meia',
  dataNascimento: '',
  peDominante: 'Destro',
  altura: 0,
  peso: 0,
  telefone: '',
  foto: '',
}

export function PlayerModal({ open, title, initial, saving, onClose, onSave }: PlayerModalProps) {
  const [form, setForm] = useState<JogadorFormValues>(emptyForm)

  useEffect(() => {
    if (!open) return
    setForm({ ...emptyForm, ...initial })
  }, [open, initial])

  function update<K extends keyof JogadorFormValues>(key: K, value: JogadorFormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleFile(file?: File) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update('foto', String(reader.result ?? ''))
    reader.readAsDataURL(file)
  }

  return (
    <Dialog open={open} onClose={onClose} title={title} description="Dados enviados para a API de jogadores." className="max-w-3xl">
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault()
          onSave(form)
        }}
      >
        <div className="md:col-span-2 flex items-center gap-4">
          <PlayerAvatar name={form.nome} photo={form.foto} number={form.numeroCamisa} status="disponivel" size="lg" />
          <label className="text-sm">
            <span className="mb-1 block font-medium">Foto</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleFile(event.target.files?.[0])}
              className="block w-full text-sm"
            />
            <input
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              placeholder="Ou informe uma URL"
              value={form.foto.startsWith('data:') ? '' : form.foto}
              onChange={(event) => update('foto', event.target.value)}
            />
          </label>
        </div>
        <Field label="Nome" required>
          <input
            required
            className={inputClass}
            value={form.nome}
            onChange={(event) => update('nome', event.target.value)}
          />
        </Field>
        <Field label="Apelido">
          <input className={inputClass} value={form.apelido} onChange={(event) => update('apelido', event.target.value)} />
        </Field>
        <Field label="Número da camisa">
          <input
            type="number"
            className={inputClass}
            value={form.numeroCamisa}
            onChange={(event) => update('numeroCamisa', Number(event.target.value))}
          />
        </Field>
        <Field label="Posição">
          <select className={inputClass} value={form.posicao} onChange={(event) => update('posicao', event.target.value)}>
            <option>Goleiro</option>
            <option>Defensor</option>
            <option>Meia</option>
            <option>Atacante</option>
          </select>
        </Field>
        <Field label="Data de nascimento">
          <input
            type="date"
            className={inputClass}
            value={form.dataNascimento}
            onChange={(event) => update('dataNascimento', event.target.value)}
          />
        </Field>
        <Field label="Pé dominante">
          <select className={inputClass} value={form.peDominante} onChange={(event) => update('peDominante', event.target.value)}>
            <option>Destro</option>
            <option>Canhoto</option>
            <option>Ambidestro</option>
          </select>
        </Field>
        <Field label="Altura (m)">
          <input
            type="number"
            step="0.01"
            className={inputClass}
            value={form.altura}
            onChange={(event) => update('altura', Number(event.target.value))}
          />
        </Field>
        <Field label="Peso (kg)">
          <input
            type="number"
            step="0.1"
            className={inputClass}
            value={form.peso}
            onChange={(event) => update('peso', Number(event.target.value))}
          />
        </Field>
        <Field label="Telefone">
          <input className={inputClass} value={form.telefone} onChange={(event) => update('telefone', event.target.value)} />
        </Field>
        <div className="md:col-span-2 mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="text-sm">
      <span className="mb-1 block font-medium">
        {label}
        {required ? ' *' : ''}
      </span>
      {children}
    </label>
  )
}

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40'

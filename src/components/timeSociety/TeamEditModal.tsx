import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import type { TimeSociety } from '@/types/escalacao'
import { useEffect, useState } from 'react'

interface TeamEditModalProps {
  open: boolean
  time?: TimeSociety
  saving?: boolean
  onClose: () => void
  onSave: (payload: TimeSociety) => void
}

export function TeamEditModal({ open, time, saving, onClose, onSave }: TeamEditModalProps) {
  const [form, setForm] = useState<TimeSociety>({ anoFundacao: 0 })

  useEffect(() => {
    if (open && time) setForm(time)
  }, [open, time])

  return (
    <Dialog open={open} onClose={onClose} title="Editar time" className="max-w-lg">
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          onSave(form)
        }}
      >
        <input className={inputClass} placeholder="Nome" value={form.nome ?? ''} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        <input className={inputClass} placeholder="Sigla" value={form.sigla ?? ''} onChange={(e) => setForm({ ...form, sigla: e.target.value })} />
        <input className={inputClass} placeholder="URL do escudo" value={form.escudo ?? ''} onChange={(e) => setForm({ ...form, escudo: e.target.value })} />
        <input className={inputClass} placeholder="Técnico" value={form.tecnico ?? ''} onChange={(e) => setForm({ ...form, tecnico: e.target.value })} />
        <input className={inputClass} placeholder="Telefone" value={form.telefone ?? ''} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
        <input className={inputClass} placeholder="Instagram" value={form.instagram ?? ''} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} placeholder="Cor principal" value={form.corPrincipal ?? ''} onChange={(e) => setForm({ ...form, corPrincipal: e.target.value })} />
          <input className={inputClass} placeholder="Cor secundária" value={form.corSecundaria ?? ''} onChange={(e) => setForm({ ...form, corSecundaria: e.target.value })} />
        </div>
        <div className="mt-2 flex justify-end gap-2">
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

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm'

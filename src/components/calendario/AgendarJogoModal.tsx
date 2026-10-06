import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import type { Campeonato, TimeSociety } from '@/types/escalacao'
import type { AgendarJogoValues } from '@/types/calendario'

interface AgendarJogoModalProps {
  open: boolean
  saving?: boolean
  campeonatos: Campeonato[]
  times: TimeSociety[]
  campeonatoId?: number
  timeFixoId?: number
  onClose: () => void
  onSave: (values: AgendarJogoValues) => void
}

const inputClass = 'h-10 w-full rounded-lg border border-input bg-background px-3 text-sm'

export function AgendarJogoModal({
  open,
  saving,
  campeonatos,
  times,
  campeonatoId,
  timeFixoId,
  onClose,
  onSave,
}: AgendarJogoModalProps) {
  const [mando, setMando] = useState<'casa' | 'visitante'>('casa')
  const [adversarioId, setAdversarioId] = useState<number | ''>('')
  const [casaId, setCasaId] = useState<number | ''>('')
  const [visitanteId, setVisitanteId] = useState<number | ''>('')
  const [formCampeonatoId, setFormCampeonatoId] = useState<number | ''>('')
  const [dataPrevista, setDataPrevista] = useState('')
  const [horarioPrevisto, setHorarioPrevisto] = useState('')
  const [localPrevisto, setLocalPrevisto] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const adversarios = useMemo(
    () => times.filter((item) => item.id && item.id !== timeFixoId),
    [times, timeFixoId],
  )

  useEffect(() => {
    if (!open) return
    setMando('casa')
    setAdversarioId('')
    setCasaId(timeFixoId ?? '')
    setVisitanteId('')
    setFormCampeonatoId(campeonatoId ?? campeonatos[0]?.id ?? '')
    setDataPrevista('')
    setHorarioPrevisto('')
    setLocalPrevisto('')
    setObservacoes('')
  }, [open, campeonatoId, campeonatos, timeFixoId])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const campeonato = Number(formCampeonatoId)
    const casa = timeFixoId ? (mando === 'casa' ? timeFixoId : Number(adversarioId)) : Number(casaId)
    const visitante = timeFixoId
      ? mando === 'visitante'
        ? timeFixoId
        : Number(adversarioId)
      : Number(visitanteId)

    if (!campeonato || !casa || !visitante || !dataPrevista) return
    onSave({
      campeonatoId: campeonato,
      timeCasaId: casa,
      timeVisitanteId: visitante,
      dataPrevista,
      horarioPrevisto,
      localPrevisto,
      observacoes,
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Agendar jogo"
      description="O jogo entra no calendário como previsto. A escalação pode ser gravada nele em seguida."
      className="max-w-xl"
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Campeonato</span>
          <select
            className={inputClass}
            value={formCampeonatoId}
            onChange={(event) => setFormCampeonatoId(Number(event.target.value))}
            required
          >
            <option value="">Selecione</option>
            {campeonatos.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome} {item.temporada ? `· ${item.temporada}` : ''}
              </option>
            ))}
          </select>
        </label>

        {timeFixoId ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMando('casa')}
                className={`rounded-xl border px-3 py-3 text-left text-sm ${mando === 'casa' ? 'border-emerald-700 bg-emerald-950 text-white' : 'border-border bg-background'}`}
              >
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">Mando</span>
                <span className="mt-1 block font-display text-lg font-bold">Em casa</span>
              </button>
              <button
                type="button"
                onClick={() => setMando('visitante')}
                className={`rounded-xl border px-3 py-3 text-left text-sm ${mando === 'visitante' ? 'border-emerald-700 bg-emerald-950 text-white' : 'border-border bg-background'}`}
              >
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">Mando</span>
                <span className="mt-1 block font-display text-lg font-bold">Visitante</span>
              </button>
            </div>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Adversário</span>
              <select
                className={inputClass}
                value={adversarioId}
                onChange={(event) => setAdversarioId(Number(event.target.value))}
                required
              >
                <option value="">Selecione o adversário</option>
                {adversarios.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium">Time da casa</span>
              <select
                className={inputClass}
                value={casaId}
                onChange={(event) => setCasaId(Number(event.target.value))}
                required
              >
                <option value="">Selecione</option>
                {times.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Visitante</span>
              <select
                className={inputClass}
                value={visitanteId}
                onChange={(event) => setVisitanteId(Number(event.target.value))}
                required
              >
                <option value="">Selecione</option>
                {times.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Data</span>
            <input
              type="date"
              className={inputClass}
              value={dataPrevista}
              onChange={(event) => setDataPrevista(event.target.value)}
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Horário</span>
            <input
              type="time"
              className={inputClass}
              value={horarioPrevisto}
              onChange={(event) => setHorarioPrevisto(event.target.value)}
            />
          </label>
        </div>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Local previsto</span>
          <input
            className={inputClass}
            value={localPrevisto}
            onChange={(event) => setLocalPrevisto(event.target.value)}
            placeholder="Campo, quadra ou ginásio"
            maxLength={150}
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Observações</span>
          <textarea
            className="min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            value={observacoes}
            onChange={(event) => setObservacoes(event.target.value)}
            placeholder="Uniforme, atraso, campo molhado..."
          />
        </label>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Agendar jogo'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

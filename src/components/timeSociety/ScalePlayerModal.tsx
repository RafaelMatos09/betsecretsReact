import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { PlayerAvatar } from './PlayerAvatar'
import { displayName } from '@/lib/jogadorUtils'
import type { FormationSlot } from '@/types/formacao'
import type { JogadorTime } from '@/types/jogador'

interface ScalePlayerModalProps {
  open: boolean
  player?: JogadorTime
  slots: FormationSlot[]
  currentSlotId?: string
  selectedSlotId: string
  onSelectSlot: (slotId: string) => void
  onClose: () => void
  onConfirm: () => void
}

export function ScalePlayerModal({
  open,
  player,
  slots,
  currentSlotId,
  selectedSlotId,
  onSelectSlot,
  onClose,
  onConfirm,
}: ScalePlayerModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={currentSlotId && player ? 'Alterar posição' : 'Escalar jogador'}
      description="Escolha a posição no campo. A escalação fica no cliente até você salvar."
      className="max-w-lg"
    >
      {player && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <PlayerAvatar name={displayName(player)} photo={player.foto} number={player.numeroCamisa} status="disponivel" />
            <div>
              <p className="font-semibold">{displayName(player)}</p>
              <p className="text-sm text-muted-foreground">
                #{player.numeroCamisa} · {player.posicao ?? '—'}
              </p>
              {currentSlotId && (
                <p className="text-xs text-muted-foreground">
                  Posição atual: {slots.find((slot) => slot.id === currentSlotId)?.label ?? currentSlotId}
                </p>
              )}
            </div>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Nova posição</span>
            <select
              className="w-full rounded-lg border border-input bg-background px-3 py-2"
              value={selectedSlotId}
              onChange={(event) => onSelectSlot(event.target.value)}
            >
              {slots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onConfirm} disabled={!selectedSlotId}>
              Confirmar
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  )
}

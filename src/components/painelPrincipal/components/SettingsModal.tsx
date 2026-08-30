import { Bell, CircleHelp, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Configurações</h2>
            <p className="mt-1 text-sm text-muted-foreground">Personalize sua experiência no BetSecrets.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted"
            aria-label="Fechar configurações"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <button type="button" className="flex items-center gap-3 rounded-xl bg-muted p-4 text-left">
            <UserRound className="size-5 text-primary" />
            <span>
              <b className="block text-sm">Meu perfil</b>
              <small className="text-muted-foreground">Dados e preferências pessoais</small>
            </span>
          </button>
          <button type="button" className="flex items-center gap-3 rounded-xl p-4 text-left hover:bg-muted">
            <Bell className="size-5 text-primary" />
            <span>
              <b className="block text-sm">Notificações</b>
              <small className="text-muted-foreground">Alertas de jogos e palpites</small>
            </span>
          </button>
          <button type="button" className="flex items-center gap-3 rounded-xl p-4 text-left hover:bg-muted">
            <CircleHelp className="size-5 text-primary" />
            <span>
              <b className="block text-sm">Central de ajuda</b>
              <small className="text-muted-foreground">Tire suas dúvidas</small>
            </span>
          </button>
        </div>
        <Button onClick={onClose} className="mt-6 w-full">
          Salvar alterações
        </Button>
      </div>
    </div>
  )
}

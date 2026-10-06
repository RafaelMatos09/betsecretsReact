import { cn } from '@/lib/utils'

interface BairroFutLogoProps {
  className?: string
  markClassName?: string
  wordmark?: boolean
  subtitle?: string
  tone?: 'light' | 'dark'
}

export function BairroFutLogo({
  className,
  markClassName,
  wordmark = false,
  subtitle,
  tone = 'dark',
}: BairroFutLogoProps) {
  const light = tone === 'light'

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className={cn('size-9 shrink-0', markClassName)}
      >
        <rect width="64" height="64" rx="16" fill="#1B3A2A" />
        <path d="M0 40h64M0 48h64" stroke="#2F6A45" strokeWidth="6" />
        <path d="M14 34.5 32 22l18 12.5" stroke="#F3C15A" strokeWidth="3" strokeLinejoin="round" />
        <path d="M20 34.5V46h24V34.5" stroke="#F6F1E4" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="32" cy="18" r="7" fill="#F6F1E4" />
        <path d="M32 12.2 33.6 16h4l-3.2 2.4 1.2 3.8L32 19.8l-3.6 2.4 1.2-3.8-3.2-2.4h4z" fill="#1B3A2A" />
      </svg>
      {wordmark && (
        <span className="min-w-0 text-left">
          <span className={cn('block font-display text-lg font-bold leading-none tracking-tight', light ? 'text-white' : 'text-foreground')}>
            Bairro<span className="text-[#E2A93B]">Fut</span>
          </span>
          {subtitle && (
            <span className={cn('mt-1 block font-mono text-[10px] uppercase tracking-[0.18em]', light ? 'text-white/55' : 'text-muted-foreground')}>
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  )
}

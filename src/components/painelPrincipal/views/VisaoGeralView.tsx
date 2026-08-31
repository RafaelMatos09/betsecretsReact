import { useMemo } from 'react'
import {
  Activity,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Goal,
  Loader2,
  MapPin,
  RefreshCw,
  Trophy,
  Users,
} from 'lucide-react'
import type { ApiMatch, ClassificacaoItem } from '@/types/tabela'
import { QuadroClassificacao } from '../components/QuadroClassificacao'
import type { Team } from '../data/teams'
import type { NavItemId } from '../data/navGroups'
import {
  buildProjecoesClassificacao,
  buildResumoClassificacao,
  buildRodadaStats,
  formatMatchStatus,
  isMatchLive,
} from '../utils/tabelaStats'

interface VisaoGeralViewProps {
  matches: ApiMatch[]
  competitionName: string
  round: string
  classificacaoItems: ClassificacaoItem[]
  classificacaoTeams: Team[]
  loading: boolean
  error: string | null
  favorite?: string
  onNavigate: (id: NavItemId) => void
}

function TeamEscudo({ nome, sigla, escudo }: { nome: string; sigla: string; escudo: string }) {
  if (escudo) {
    return (
      <img
        src={escudo}
        alt={nome}
        className="size-9 rounded-full bg-muted object-contain p-1 shadow-sm"
      />
    )
  }

  return (
    <span className="inline-flex size-9 items-center justify-center rounded-full bg-muted font-mono text-[9px] font-black tracking-tight text-muted-foreground shadow-sm">
      {sigla.slice(0, 3)}
    </span>
  )
}

export function VisaoGeralView({
  matches,
  competitionName,
  round,
  classificacaoItems,
  classificacaoTeams,
  loading,
  error,
  favorite,
  onNavigate,
}: VisaoGeralViewProps) {
  const rodadaStats = useMemo(() => buildRodadaStats(matches), [matches])
  const resumoClassificacao = useMemo(
    () => buildResumoClassificacao(classificacaoItems),
    [classificacaoItems],
  )
  const projecoes = useMemo(
    () => buildProjecoesClassificacao(classificacaoItems),
    [classificacaoItems],
  )

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
            <Trophy className="size-3" />
            {competitionName || 'Brasileirão'}
          </div>
          <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Acompanhe o campeonato.
            <br />
            <span className="text-primary">Tabela e jogos da rodada.</span>
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            Classificação atualizada, destaques da temporada e partidas da {round.toLowerCase() || 'rodada atual'}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-semibold shadow-sm">
            {round || '—'}
          </span>
          <span className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-semibold shadow-sm">
            {rodadaStats.totalPartidas} jogos
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Jogos ao vivo</span>
            <Activity className="size-4 text-destructive" />
          </div>
          {loading ? (
            <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
          ) : (
            <>
              <p className="mt-4 font-display text-3xl font-bold">{rodadaStats.partidasAoVivo}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                de {rodadaStats.totalPartidas} jogos na rodada
              </p>
            </>
          )}
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Encerrados</span>
            <Trophy className="size-4 text-accent-foreground" />
          </div>
          {loading ? (
            <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
          ) : (
            <>
              <p className="mt-4 font-display text-3xl font-bold">{rodadaStats.partidasEncerradas}</p>
              <p className="mt-1 text-xs text-muted-foreground">partidas finalizadas na rodada</p>
            </>
          )}
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Gols na rodada</span>
            <Goal className="size-4 text-primary" />
          </div>
          {loading ? (
            <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
          ) : (
            <>
              <p className="mt-4 font-display text-3xl font-bold">
                {rodadaStats.totalGols}{' '}
                <span className="font-sans text-sm font-medium text-muted-foreground">gols</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">soma dos placares da rodada</p>
            </>
          )}
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Empates</span>
            <RefreshCw className="size-4 text-primary" />
          </div>
          {loading ? (
            <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
          ) : (
            <>
              <p className="mt-4 font-display text-3xl font-bold">{rodadaStats.partidasEmpatadas}</p>
              <p className="mt-1 text-xs text-muted-foreground">jogos com placar igual</p>
            </>
          )}
        </div>
      </div>

      <QuadroClassificacao
        teams={classificacaoTeams}
        resumo={resumoClassificacao}
        projecoes={projecoes}
        loading={loading}
        error={error}
        favorite={favorite}
      />

      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-display text-2xl font-bold tracking-tight">Jogos da rodada</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Partidas da {round.toLowerCase() || 'rodada atual'} via API do campeonato.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-full bg-destructive" /> Ao vivo
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-full bg-muted-foreground" /> Encerrado
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-full bg-accent" /> Agendado
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 px-5 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando jogos da rodada...
          </div>
        ) : matches.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            Nenhum jogo disponível para esta rodada.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {matches.map((match) => {
              const aoVivo = isMatchLive(match.status)
              const mandante = match.score.home ?? 0
              const visitante = match.score.away ?? 0

              return (
                <div
                  key={match.id}
                  className="group px-5 py-5 transition-colors hover:bg-muted/30"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {competitionName || 'Brasileirão'}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide ${
                          aoVivo
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {aoVivo && (
                          <span className="size-1.5 rounded-full bg-destructive" />
                        )}
                        {formatMatchStatus(match.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="size-3" />
                        {match.date} · {match.time}
                      </span>
                      {match.venue && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3" />
                          {match.venue}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
                    <div className="flex items-center justify-end gap-3 md:justify-end">
                      <span className="text-right font-semibold">{match.homeTeam.name}</span>
                      <TeamEscudo
                        nome={match.homeTeam.name}
                        sigla={match.homeTeam.shortName}
                        escudo={match.homeTeam.badge}
                      />
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <p className="font-display text-3xl font-bold tracking-tight">
                        {match.started ? mandante : '—'}
                        <span className="mx-2 text-muted-foreground">×</span>
                        {match.started ? visitante : '—'}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                        {match.started ? `${mandante} × ${visitante}` : match.time}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <TeamEscudo
                        nome={match.awayTeam.name}
                        sigla={match.awayTeam.shortName}
                        escudo={match.awayTeam.badge}
                      />
                      <span className="font-semibold">{match.awayTeam.name}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <div className="flex items-center justify-between border-t border-border bg-muted/25 px-5 py-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            {matches.length} partidas · {round.toLowerCase() || 'rodada atual'}
          </p>
          <button type="button" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            Ver classificação <ChevronRight className="size-3" />
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <button
          type="button"
          onClick={() => onNavigate('classificacao')}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent">
            <Trophy className="size-5 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-display font-bold">Classificação</p>
            <p className="mt-1 text-xs text-muted-foreground">Veja a tabela do Brasileirão</p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate('meus-palpites')}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <ClipboardList className="size-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-display font-bold">Faça seus palpites</p>
            <p className="mt-1 text-xs text-muted-foreground">Palpite nos jogos da rodada</p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate('painel-palpites')}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent">
            <Users className="size-5 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-display font-bold">Painel da galera</p>
            <p className="mt-1 text-xs text-muted-foreground">Veja os palpites dos usuários</p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
      </div>
    </>
  )
}

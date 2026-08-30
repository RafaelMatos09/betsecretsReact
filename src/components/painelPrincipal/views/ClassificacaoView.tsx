import { Activity, ArrowUp, BarChart3, ChevronRight, ClipboardList, Loader2, SlidersHorizontal, Sparkles, Star, Trophy, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ClassificacaoStats } from '@/types/tabela'
import { TeamMark } from '../components/TeamMark'
import type { Team } from '../data/teams'
import type { NavItemId } from '../data/navGroups'
import { formatSaldoGols, formatVariacao } from '../utils/tabelaStats'

interface ClassificacaoViewProps {
  favorite: string
  round: string
  teams: Team[]
  stats: ClassificacaoStats | null
  loading: boolean
  error: string | null
  onFavoriteToggle: () => void
  onNavigate: (id: NavItemId) => void
}

export function ClassificacaoView({
  favorite,
  round,
  teams,
  stats,
  loading,
  error,
  onFavoriteToggle,
  onNavigate,
}: ClassificacaoViewProps) {
  const totalJogos = teams[0]?.games ?? 38
  const totalPartidas = teams.length > 0 ? (teams.length * totalJogos) / 2 : 380
  const liderTeam = teams.find((team) => team.pos === 1)
  const favoriteTeam = teams.find((team) => team.name === favorite)

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
            <Activity className="size-3" /> Temporada completa
          </div>
          <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            A corrida pelo título
            <br />
            <span className="text-primary">começa aqui.</span>
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            Acompanhe o desempenho dos times, confira as zonas de classificação e faça seus palpites para a próxima rodada.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <SlidersHorizontal className="size-4 text-muted-foreground" /> Filtros
          </Button>
          <span className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-semibold shadow-sm">
            {round}
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
            <span className="stat-label">Líder atual</span>
            <Trophy className="size-4 text-accent-foreground" />
          </div>
          {stats && liderTeam ? (
            <div className="mt-4 flex items-center gap-3">
              <TeamMark team={liderTeam} />
              <div>
                <p className="font-display text-xl font-bold">{stats.lider.nome}</p>
                <p className="font-mono text-xs text-muted-foreground">{stats.lider.pontos} pontos</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">{loading ? 'Carregando...' : '—'}</p>
          )}
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Melhor ataque</span>
            <ArrowUp className="size-4 text-primary" />
          </div>
          {stats ? (
            <>
              <p className="mt-4 font-display text-3xl font-bold">
                {stats.melhorAtaque.gols}{' '}
                <span className="font-sans text-sm font-medium text-muted-foreground">gols</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {stats.melhorAtaque.nome} · {stats.melhorAtaque.jogos} jogos
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">{loading ? 'Carregando...' : '—'}</p>
          )}
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Maior sequência</span>
            <Sparkles className="size-4 text-accent-foreground" />
          </div>
          {stats ? (
            <>
              <p className="mt-4 font-display text-3xl font-bold">
                {stats.maiorSequencia.vitorias}{' '}
                <span className="font-sans text-sm font-medium text-muted-foreground">vitórias</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{stats.maiorSequencia.nome} em alta</p>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">{loading ? 'Carregando...' : '—'}</p>
          )}
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Seu time</span>
            <BarChart3 className="size-4 text-primary" />
          </div>
          {stats?.timeFavorito ? (
            <>
              <p className="mt-4 font-display text-3xl font-bold">
                #{stats.timeFavorito.posicao}{' '}
                <span className="font-sans text-sm font-medium text-muted-foreground">na tabela</span>
              </p>
              <p className="mt-1 text-xs text-primary">{formatVariacao(stats.timeFavorito.variacao)}</p>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              {loading ? 'Carregando...' : 'Selecione um time favorito'}
            </p>
          )}
        </div>
      </div>

      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-display text-2xl font-bold tracking-tight">Tabela do campeonato</h3>
          <p className="mt-1 text-sm text-muted-foreground">Atualizada após os jogos da {round.toLowerCase()}.</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-primary" /> Libertadores</span>
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-primary/50" /> Pré-Libertadores</span>
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-accent" /> Sul-Americana</span>
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-destructive" /> Rebaixamento</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 px-5 py-16 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Carregando classificação...
            </div>
          ) : teams.length === 0 ? (
            <div className="px-5 py-16 text-center text-sm text-muted-foreground">
              Nenhum dado de classificação disponível.
            </div>
          ) : (
            <table className="w-full min-w-[780px] text-left">
              <thead>
                <tr className="border-b border-border bg-muted/45 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="w-16 px-5 py-4 font-medium">#</th>
                  <th className="px-3 py-4 font-medium">Clube</th>
                  <th className="px-3 py-4 text-center font-medium">P</th>
                  <th className="px-3 py-4 text-center font-medium">J</th>
                  <th className="px-3 py-4 text-center font-medium">V</th>
                  <th className="px-3 py-4 text-center font-medium">E</th>
                  <th className="px-3 py-4 text-center font-medium">D</th>
                  <th className="px-3 py-4 text-center font-medium">SG</th>
                  <th className="px-3 py-4 text-center font-medium">Forma</th>
                  <th className="px-5 py-4 text-right font-medium">Aproveit.</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr
                    key={team.timeId ?? team.name}
                    className={`group border-b border-border/70 transition-colors hover:bg-muted/40 ${team.name === favorite ? 'bg-accent/30' : ''}`}
                  >
                    <td className="relative px-5 py-3.5">
                      <span
                        className={`absolute left-0 top-0 h-full w-1 ${
                          team.zone === 'libertadores' || team.zone === 'pre-libertadores'
                            ? 'bg-primary'
                            : team.zone === 'sul-americana'
                              ? 'bg-accent'
                              : team.zone === 'rebaixamento'
                                ? 'bg-destructive'
                                : 'bg-transparent'
                        }`}
                      />
                      <span className="font-mono text-sm text-muted-foreground">{String(team.pos).padStart(2, '0')}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-3">
                        <TeamMark team={team} />
                        <span className="font-semibold">{team.name}</span>
                        {team.name === favorite && <Star className="size-3.5 fill-accent text-accent-foreground" />}
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-center font-display text-lg font-bold">{team.pts}</td>
                    <td className="px-3 py-3.5 text-center font-mono text-xs text-muted-foreground">{team.games}</td>
                    <td className="px-3 py-3.5 text-center font-mono text-xs text-muted-foreground">{team.wins}</td>
                    <td className="px-3 py-3.5 text-center font-mono text-xs text-muted-foreground">{team.draws}</td>
                    <td className="px-3 py-3.5 text-center font-mono text-xs text-muted-foreground">{team.losses}</td>
                    <td className="px-3 py-3.5 text-center font-mono text-xs font-semibold">
                      {formatSaldoGols(team.saldo ?? team.gf - team.ga)}
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex justify-center gap-1">
                        {team.form.map((result, index) => (
                          <span
                            key={`${team.name}-${index}`}
                            className={`flex size-5 items-center justify-center rounded-full font-mono text-[9px] font-bold ${
                              result === 'V'
                                ? 'bg-primary/15 text-primary'
                                : result === 'E'
                                  ? 'bg-muted text-muted-foreground'
                                  : 'bg-destructive/10 text-destructive'
                            }`}
                          >
                            {result}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-mono text-xs font-semibold">
                        {team.aproveitamento ?? Math.round((team.pts / (team.games * 3)) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border bg-muted/25 px-5 py-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            {teams.length || 20} clubes · {totalPartidas} partidas na temporada
          </p>
          <button type="button" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            Ver regulamento <ChevronRight className="size-3" />
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <button
          type="button"
          onClick={onFavoriteToggle}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent">
            {favoriteTeam ? (
              <TeamMark team={favoriteTeam} />
            ) : (
              <Star className="size-5 fill-accent-foreground text-accent-foreground" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-display font-bold">Meu time: {favorite}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {favoriteTeam
                ? `#${String(favoriteTeam.pos).padStart(2, '0')} · ${favoriteTeam.pts} pts`
                : 'Clique para trocar o favorito'}
            </p>
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
            <p className="mt-1 text-xs text-muted-foreground">8 jogos aguardando seu palpite</p>
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

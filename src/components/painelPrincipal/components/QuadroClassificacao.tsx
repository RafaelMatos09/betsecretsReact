import { ArrowDown, ArrowUp, Loader2, Minus, Shield, Target, TrendingUp, Trophy } from 'lucide-react'
import type { ProjecaoTime, ResumoClassificacao } from '@/types/tabela'
import { TeamMark } from './TeamMark'
import type { Team } from '../data/teams'

interface QuadroClassificacaoProps {
  teams: Team[]
  resumo: ResumoClassificacao | null
  projecoes: ProjecaoTime[]
  loading: boolean
  error: string | null
  favorite?: string
}

function zoneBarClass(zone: ProjecaoTime['zone']): string {
  switch (zone) {
    case 'libertadores':
    case 'pre-libertadores':
      return 'bg-primary'
    case 'sul-americana':
      return 'bg-accent'
    case 'rebaixamento':
      return 'bg-destructive'
    default:
      return 'bg-transparent'
  }
}

function VariacaoBadge({ variacao }: { variacao: number }) {
  if (variacao > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary">
        <ArrowUp className="size-2.5" />
        {variacao}
      </span>
    )
  }

  if (variacao < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-destructive/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-destructive">
        <ArrowDown className="size-2.5" />
        {Math.abs(variacao)}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 font-mono text-[9px] font-bold text-muted-foreground">
      <Minus className="size-2.5" />
    </span>
  )
}

export function QuadroClassificacao({
  teams,
  resumo,
  projecoes,
  loading,
  error,
  favorite,
}: QuadroClassificacaoProps) {
  const liderTeam = teams.find((team) => team.pos === 1)

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-muted/25 px-5 py-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Brasileirão Série A
            </p>
            <h3 className="mt-1 font-display text-xl font-bold tracking-tight">
              Quadro da temporada
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Estatísticas atuais e projeção até a rodada {resumo?.totalRodadas ?? 38} com base no aproveitamento.
            </p>
          </div>
          {resumo && (
            <span className="w-fit rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs font-semibold">
              Rodada {resumo.rodadaAtual} de {resumo.totalRodadas}
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        {error && (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando dados da classificação...
          </div>
        ) : (
          <>
            <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="stat-label">Líder</span>
                  <Trophy className="size-3.5 text-accent-foreground" />
                </div>
                {resumo && liderTeam ? (
                  <div className="mt-3 flex items-center gap-2.5">
                    <TeamMark team={liderTeam} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-sm">{resumo.lider.nome}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{resumo.lider.pontos} pts</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">—</p>
                )}
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="stat-label">Melhor ataque</span>
                  <Target className="size-3.5 text-primary" />
                </div>
                {resumo ? (
                  <>
                    <p className="mt-3 truncate font-semibold text-sm">{resumo.melhorAtaque.nome}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {resumo.melhorAtaque.gols} gols em {resumo.melhorAtaque.jogos} jogos
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">—</p>
                )}
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="stat-label">Melhor defesa</span>
                  <Shield className="size-3.5 text-primary" />
                </div>
                {resumo ? (
                  <>
                    <p className="mt-3 truncate font-semibold text-sm">{resumo.melhorDefesa.nome}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {resumo.melhorDefesa.golsContra} gols sofridos
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">—</p>
                )}
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="stat-label">Média de gols</span>
                  <TrendingUp className="size-3.5 text-accent-foreground" />
                </div>
                {resumo ? (
                  <>
                    <p className="mt-3 font-display text-2xl font-bold">{resumo.mediaGolsPorJogo}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">por jogo na tabela</p>
                  </>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">—</p>
                )}
              </div>
            </div>

            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Projeção por time
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] uppercase tracking-wide text-muted-foreground">
                <span className="flex items-center gap-1"><i className="size-1.5 rounded-full bg-primary" /> Libertadores</span>
                <span className="flex items-center gap-1"><i className="size-1.5 rounded-full bg-accent" /> Sul-Americana</span>
                <span className="flex items-center gap-1"><i className="size-1.5 rounded-full bg-destructive" /> Rebaixamento</span>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {projecoes.map((projecao) => {
                const team = teams.find((item) => item.timeId === projecao.timeId)
                const isFavorite = projecao.nome === favorite

                return (
                  <div
                    key={projecao.timeId}
                    className={`relative overflow-hidden rounded-xl border border-border bg-background p-3 transition-colors hover:bg-muted/30 ${
                      isFavorite ? 'ring-1 ring-accent' : ''
                    }`}
                  >
                    <span className={`absolute left-0 top-0 h-full w-1 ${zoneBarClass(projecao.zone)}`} />

                    <div className="flex items-start justify-between gap-2 pl-1">
                      <div className="flex min-w-0 items-center gap-2">
                        {team ? (
                          <TeamMark team={team} />
                        ) : (
                          <span className="inline-flex size-9 items-center justify-center rounded-full bg-muted font-mono text-[9px] font-bold">
                            {projecao.sigla.slice(0, 3)}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{projecao.nome}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            {projecao.aproveitamento}% aproveit.
                          </p>
                        </div>
                      </div>
                      <VariacaoBadge variacao={projecao.variacaoPosicao} />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 pl-1">
                      <div className="rounded-lg bg-muted/40 px-2 py-1.5">
                        <p className="font-mono text-[9px] uppercase tracking-wide text-muted-foreground">Posição</p>
                        <p className="font-mono text-sm font-bold">
                          {String(projecao.posicaoAtual).padStart(2, '0')}
                          <span className="mx-1 text-muted-foreground">→</span>
                          {String(projecao.posicaoProjetada).padStart(2, '0')}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/40 px-2 py-1.5">
                        <p className="font-mono text-[9px] uppercase tracking-wide text-muted-foreground">Pontos</p>
                        <p className="font-mono text-sm font-bold">
                          {projecao.pontosAtuais}
                          <span className="mx-1 text-muted-foreground">→</span>
                          {projecao.pontosProjetados}
                        </p>
                      </div>
                    </div>

                    {projecao.jogosRestantes > 0 && (
                      <p className="mt-2 pl-1 font-mono text-[9px] text-muted-foreground">
                        +{projecao.jogosRestantes} jogos restantes
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

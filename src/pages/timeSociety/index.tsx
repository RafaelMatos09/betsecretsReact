import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { ToastProvider, useToast } from '@/components/ui/toast'
import { BenchPlayers } from '@/components/timeSociety/BenchPlayers'
import { ElencoPanel } from '@/components/timeSociety/ElencoPanel'
import { PlayerDrawer } from '@/components/timeSociety/PlayerDrawer'
import { PlayerModal } from '@/components/timeSociety/PlayerModal'
import { ScalePlayerModal } from '@/components/timeSociety/ScalePlayerModal'
import { SoccerField } from '@/components/timeSociety/SoccerField'
import { TeamEditModal } from '@/components/timeSociety/TeamEditModal'
import { TeamHeader } from '@/components/timeSociety/TeamHeader'
import { getFormation } from '@/lib/formacoes'
import { readEscalacao, readSelectedTimeId, writeEscalacao, writeSelectedTimeId } from '@/lib/escalacaoStorage'
import { categoriaPosicao, emptyStats } from '@/lib/jogadorUtils'
import * as timeSocietyService from '@/services/timeSocietyService'
import type { Campeonato, EscalacaoState, TimeSociety } from '@/types/escalacao'
import type { Jogador, JogadorFormValues, JogadorTime, PlayerStatus, PosicaoFiltro } from '@/types/jogador'

function errorMessage(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined
    return data?.message || err.message || fallback
  }
  return fallback
}

function toDateInput(value?: string | null) {
  if (!value) return ''
  return value.slice(0, 10)
}

export default function TimeSocietyRoute() {
  return (
    <ToastProvider>
      <TimeSocietyPage />
    </ToastProvider>
  )
}

function TimeSocietyPage() {
  const { toast } = useToast()
  const [times, setTimes] = useState<TimeSociety[]>([])
  const [timeId, setTimeId] = useState<number | null>(readSelectedTimeId)
  const [elenco, setElenco] = useState<JogadorTime[]>([])
  const [campeonato, setCampeonato] = useState<Campeonato>()
  const [golsByJogador, setGolsByJogador] = useState<Map<number, number>>(new Map())
  const [detailsById, setDetailsById] = useState<Map<number, Jogador>>(new Map())
  const [escalacao, setEscalacao] = useState<EscalacaoState>({ formationId: '1-2-2-1', slots: {} })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<PosicaoFiltro>('todos')

  const [playerModal, setPlayerModal] = useState<{ mode: 'create' | 'edit'; player?: JogadorTime } | null>(null)
  const [playerForm, setPlayerForm] = useState<Partial<JogadorFormValues>>()
  const [scaleModal, setScaleModal] = useState<{ player: JogadorTime; currentSlotId?: string } | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState('')
  const [drawerPlayer, setDrawerPlayer] = useState<JogadorTime | null>(null)
  const [removePlayer, setRemovePlayer] = useState<JogadorTime | null>(null)
  const [editTeamOpen, setEditTeamOpen] = useState(false)

  const time = times.find((item) => item.id === timeId)
  const formation = getFormation(escalacao.formationId)

  const starters = useMemo(() => new Set(Object.values(escalacao.slots)), [escalacao.slots])
  const elencoById = useMemo(() => new Map(elenco.map((item) => [item.id, item])), [elenco])

  const playerStatus = useCallback(
    (player?: JogadorTime): PlayerStatus => {
      if (!player) return 'ausente'
      return starters.has(player.id) ? 'disponivel' : 'reserva'
    },
    [starters],
  )

  const load = useCallback(async (selectedId?: number | null) => {
    setLoading(true)
    setError(null)
    try {
      const [listaTimes, campeonatos] = await Promise.all([
        timeSocietyService.listarTimes(),
        timeSocietyService.listarCampeonatos().catch(() => [] as Campeonato[]),
      ])
      const ativos = listaTimes.filter((item) => item.ativo !== false)
      setTimes(ativos)

      const stored = selectedId ?? readSelectedTimeId()
      const current = ativos.find((item) => item.id === stored) ?? ativos[0]
      const currentId = current?.id ?? null
      setTimeId(currentId)
      if (currentId) writeSelectedTimeId(currentId)

      const atualCampeonato =
        campeonatos.find((item) => {
          const status = item.status?.toLowerCase() ?? ''
          return status.includes('ativo') || status.includes('andamento')
        }) ?? campeonatos[0]
      setCampeonato(atualCampeonato)

      if (atualCampeonato?.id) {
        const artilharia = await timeSocietyService.listarArtilharia(atualCampeonato.id).catch(() => [])
        setGolsByJogador(new Map(artilharia.map((item) => [item.jogadorId ?? 0, item.gols ?? 0])))
      } else {
        setGolsByJogador(new Map())
      }

      if (!currentId) {
        setElenco([])
        return
      }

      const lista = await timeSocietyService.listarElenco(currentId)
      setElenco(lista)
      setEscalacao(readEscalacao(currentId))

      const details = await Promise.all(
        lista.map(async (item) => {
          try {
            return [item.jogadorId, await timeSocietyService.consultarJogador(item.jogadorId)] as const
          } catch {
            return [item.jogadorId, undefined] as const
          }
        }),
      )
      setDetailsById(new Map(details.filter((entry): entry is readonly [number, Jogador] => Boolean(entry[1]))))
    } catch (err) {
      setError(errorMessage(err, 'Não foi possível carregar o Time Society.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleSelectTime(id: number) {
    writeSelectedTimeId(id)
    setTimeId(id)
    await load(id)
  }

  function handleChangeFormation(formationId: string) {
    const next = getFormation(formationId)
    const previousSlots = getFormation(escalacao.formationId).slots
    const occupied = previousSlots
      .map((slot) => escalacao.slots[slot.id])
      .filter((id): id is number => typeof id === 'number')
    const slots: Record<string, number> = {}
    next.slots.forEach((slot, index) => {
      if (occupied[index] != null) slots[slot.id] = occupied[index]
    })
    setEscalacao({ formationId, slots })
  }

  function assignToSlot(slotId: string, elencoId: number) {
    setEscalacao((current) => {
      const slots = { ...current.slots }
      for (const [key, value] of Object.entries(slots)) {
        if (value === elencoId || key === slotId) delete slots[key]
      }
      slots[slotId] = elencoId
      return { ...current, slots }
    })
  }

  function openScale(player: JogadorTime, currentSlotId?: string) {
    const firstFree = formation.slots.find((slot) => !escalacao.slots[slot.id])?.id ?? formation.slots[0]?.id ?? ''
    setSelectedSlotId(currentSlotId ?? firstFree)
    setScaleModal({ player, currentSlotId })
  }

  async function openCreatePlayer() {
    setPlayerForm(undefined)
    setPlayerModal({ mode: 'create' })
  }

  async function openEditPlayer(player: JogadorTime) {
    try {
      const details = await timeSocietyService.consultarJogador(player.jogadorId)
      setPlayerForm({
        nome: details.nome ?? player.nome ?? '',
        apelido: details.apelido ?? player.apelido ?? '',
        numeroCamisa: player.numeroCamisa || details.numeroPreferido,
        posicao: details.posicao ?? player.posicao ?? 'Meia',
        dataNascimento: toDateInput(details.dataNascimento),
        peDominante: details.peDominante ?? 'Destro',
        altura: details.altura,
        peso: details.peso,
        telefone: details.telefone ?? '',
        foto: details.foto ?? player.foto ?? '',
      })
      setPlayerModal({ mode: 'edit', player })
    } catch (err) {
      toast(errorMessage(err, 'Não foi possível carregar o jogador.'), 'error')
    }
  }

  async function savePlayer(values: JogadorFormValues) {
    if (!timeId) return
    setSaving(true)
    try {
      const payload: Jogador = {
        nome: values.nome,
        apelido: values.apelido,
        dataNascimento: values.dataNascimento || null,
        telefone: values.telefone,
        foto: values.foto,
        peDominante: values.peDominante,
        posicao: values.posicao,
        altura: values.altura,
        peso: values.peso,
        numeroPreferido: values.numeroCamisa,
      }

      if (playerModal?.mode === 'edit' && playerModal.player) {
        await timeSocietyService.atualizarJogador({ ...payload, id: playerModal.player.jogadorId })
        toast('Jogador atualizado.')
      } else {
        const created = await timeSocietyService.cadastrarJogador(payload)
        if (!created.id) throw new Error('Jogador criado sem identificador.')
        await timeSocietyService.cadastrarJogadorTime({
          jogadorId: created.id,
          timeId,
          numeroCamisa: values.numeroCamisa,
        })
        toast('Jogador cadastrado no elenco.')
      }
      setPlayerModal(null)
      await load(timeId)
    } catch (err) {
      toast(errorMessage(err, 'Não foi possível salvar o jogador.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function confirmRemove() {
    if (!removePlayer) return
    setSaving(true)
    try {
      await timeSocietyService.encerrarVinculo(removePlayer.id, new Date())
      setEscalacao((current) => {
        const slots = { ...current.slots }
        for (const [key, value] of Object.entries(slots)) {
          if (value === removePlayer.id) delete slots[key]
        }
        return { ...current, slots }
      })
      toast('Jogador removido do elenco.')
      setRemovePlayer(null)
      await load(timeId)
    } catch (err) {
      toast(errorMessage(err, 'Não foi possível remover o jogador.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function saveTeam(payload: TimeSociety) {
    setSaving(true)
    try {
      await timeSocietyService.atualizarTime(payload)
      toast('Time atualizado.')
      setEditTeamOpen(false)
      await load(timeId)
    } catch (err) {
      toast(errorMessage(err, 'Não foi possível atualizar o time.'), 'error')
    } finally {
      setSaving(false)
    }
  }

  function saveLineup() {
    if (!timeId) return
    writeEscalacao(timeId, escalacao)
    toast('Escalação salva neste dispositivo.')
  }

  const bench = elenco.filter((player) => !starters.has(player.id))
  const filteredElenco = elenco.filter((player) => {
    const haystack = `${player.nome ?? ''} ${player.apelido ?? ''} ${player.numeroCamisa}`.toLowerCase()
    const matchesQuery = haystack.includes(query.trim().toLowerCase())
    const category = categoriaPosicao(player.posicao)
    const matchesFilter = filter === 'todos' || category === filter
    return matchesQuery && matchesFilter
  })

  const stats = {
    total: elenco.length,
    goleiros: elenco.filter((player) => categoriaPosicao(player.posicao) === 'goleiros').length,
    linha: elenco.filter((player) => categoriaPosicao(player.posicao) !== 'goleiros').length,
    disponiveis: elenco.length,
    lesionados: 0,
    suspensos: 0,
  }

  const drawerDetails = drawerPlayer ? detailsById.get(drawerPlayer.jogadorId) : null
  const drawerStats = {
    ...emptyStats(),
    gols: drawerPlayer ? (golsByJogador.get(drawerPlayer.jogadorId) ?? 0) : 0,
  }

  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="h-[420px] animate-pulse rounded-3xl bg-muted" />
        <div className="h-[420px] animate-pulse rounded-3xl bg-muted" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-card p-6">
        <p className="font-semibold text-destructive">{error}</p>
        <button type="button" className="mt-3 text-sm underline" onClick={() => void load(timeId)}>
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <TeamHeader
        time={time}
        times={times}
        campeonato={campeonato}
        formationId={escalacao.formationId}
        stats={stats}
        onSelectTime={(id) => void handleSelectTime(id)}
        onChangeFormation={handleChangeFormation}
        onEditTeam={() => setEditTeamOpen(true)}
        onNewPlayer={() => void openCreatePlayer()}
        onSaveLineup={saveLineup}
      />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <SoccerField
            formation={formation}
            elencoById={elencoById}
            slotMap={escalacao.slots}
            playerStatus={playerStatus}
            onSlotClick={(slotId, player) => {
              if (player) openScale(player, slotId)
            }}
            onDropPlayer={assignToSlot}
          />
          <BenchPlayers players={bench} playerStatus={playerStatus} onScale={(player) => openScale(player)} />
        </div>
        <ElencoPanel
          players={filteredElenco}
          detailsById={detailsById}
          query={query}
          filter={filter}
          playerStatus={playerStatus}
          onQuery={setQuery}
          onFilter={setFilter}
          onEdit={(player) => void openEditPlayer(player)}
          onRemove={setRemovePlayer}
          onView={setDrawerPlayer}
        />
      </div>

      <PlayerModal
        open={Boolean(playerModal)}
        title={playerModal?.mode === 'edit' ? 'Editar jogador' : 'Novo jogador'}
        initial={playerForm}
        saving={saving}
        onClose={() => setPlayerModal(null)}
        onSave={(values) => void savePlayer(values)}
      />
      <ScalePlayerModal
        open={Boolean(scaleModal)}
        player={scaleModal?.player}
        slots={formation.slots}
        currentSlotId={scaleModal?.currentSlotId}
        selectedSlotId={selectedSlotId}
        onSelectSlot={setSelectedSlotId}
        onClose={() => setScaleModal(null)}
        onConfirm={() => {
          if (scaleModal && selectedSlotId) {
            assignToSlot(selectedSlotId, scaleModal.player.id)
            setScaleModal(null)
            toast('Posição atualizada no campo.')
          }
        }}
      />
      <PlayerDrawer
        open={Boolean(drawerPlayer)}
        onClose={() => setDrawerPlayer(null)}
        elenco={drawerPlayer ?? undefined}
        details={drawerDetails}
        stats={drawerStats}
        status={drawerPlayer ? playerStatus(drawerPlayer) : 'ausente'}
      />
      <TeamEditModal
        open={editTeamOpen}
        time={time}
        saving={saving}
        onClose={() => setEditTeamOpen(false)}
        onSave={(payload) => void saveTeam(payload)}
      />
      <AlertDialog
        open={Boolean(removePlayer)}
        title="Remover jogador"
        description={`Encerrar o vínculo de ${removePlayer?.nome ?? 'este jogador'} com o time?`}
        confirmLabel="Remover"
        loading={saving}
        onCancel={() => setRemovePlayer(null)}
        onConfirm={() => void confirmRemove()}
      />
    </div>
  )
}

import type { Campeonato, PartidaEvento, TimeSociety } from '@/types/escalacao'
import type { Jogador, JogadorTime } from '@/types/jogador'
import api from './api'

export async function listarTimes(): Promise<TimeSociety[]> {
  const { data } = await api.get<TimeSociety[]>('/api/Time/listar-times')
  return data
}

export async function atualizarTime(payload: TimeSociety): Promise<void> {
  await api.put('/api/Time/atualizar-time', payload)
}

export async function cadastrarJogador(payload: Jogador): Promise<Jogador> {
  const { data } = await api.post<Jogador>('/api/Jogador/cadastra-jogador', payload)
  return data
}

export async function consultarJogador(id: number): Promise<Jogador> {
  const { data } = await api.get<Jogador>(`/api/Jogador/consultar-jogador/${id}`)
  return data
}

export async function buscarJogadores(nome: string): Promise<Jogador[]> {
  const { data } = await api.get<Jogador[]>('/api/Jogador/buscar-jogadores', {
    params: { nome },
  })
  return data
}

export async function atualizarJogador(payload: Jogador): Promise<void> {
  await api.put('/api/Jogador/atualizar-jogador', payload)
}

export async function excluirJogador(id: number): Promise<void> {
  await api.delete(`/api/Jogador/excluir-jogador/${id}`)
}

export async function cadastrarJogadorTime(payload: {
  jogadorId: number
  timeId: number
  numeroCamisa: number
}): Promise<JogadorTime> {
  const { data } = await api.post<JogadorTime>('/api/JogadorTime/cadastrar-jogador-time', payload)
  return data
}

export async function listarElenco(timeId: number): Promise<JogadorTime[]> {
  const { data } = await api.get<JogadorTime[]>(`/api/JogadorTime/listar-elenco/${timeId}`)
  return data
}

export async function listarHistoricoJogador(jogadorId: number): Promise<JogadorTime[]> {
  const { data } = await api.get<JogadorTime[]>(
    `/api/JogadorTime/listar-historico-jogador/${jogadorId}`,
  )
  return data
}

export async function encerrarVinculo(id: number, dataFim: Date): Promise<void> {
  await api.put(`/api/JogadorTime/encerrar-vinculo/${id}`, null, {
    params: { dataFim: dataFim.toISOString() },
  })
}

export async function listarCampeonatos(): Promise<Campeonato[]> {
  const { data } = await api.get<Campeonato[]>('/api/Campeonato/listar-campeonatos')
  return data
}

export async function listarArtilharia(campeonatoId: number): Promise<PartidaEvento[]> {
  const { data } = await api.get<PartidaEvento[]>(
    `/api/PartidaEvento/listar-artilharia/${campeonatoId}`,
  )
  return data
}

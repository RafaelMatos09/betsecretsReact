import type { CadastroPayload, LoginPayload, LoginResponse, Usuario } from '@/types/auth'
import api from './api'

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.get<LoginResponse>('/api/Usuario/login', {
    params: {
      email: payload.email,
      senha: payload.senha,
    },
  })
  return data
}

export async function cadastrar(payload: CadastroPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/api/Usuario/cadastro', payload)
  return data
}

export async function listarUsuarios(): Promise<Usuario[]> {
  const { data } = await api.get<Usuario[]>('/api/Usuario/listar')
  return data
}

export interface Usuario {
  id?: string
  nome?: string
  userName?: string
  email?: string
  fotoUrl?: string
}

export interface LoginResponse {
  token: string
  usuario: Usuario
}

export interface CadastroPayload {
  nome: string
  email: string
  senha: string
}

export interface LoginPayload {
  email: string
  senha: string
}

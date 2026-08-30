import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CadastroPayload, LoginPayload, Usuario } from '@/types/auth'
import * as usuarioService from '@/services/usuarioService'

interface AuthContextValue {
  user: Usuario | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (payload: LoginPayload) => Promise<void>
  cadastrar: (payload: CadastroPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'betsecrets_token'
const USER_KEY = 'betsecrets_user'

function readStoredUser(): Usuario | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Usuario
  } catch {
    return null
  }
}

function persistSession(token: string, user: Usuario) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<Usuario | null>(() => readStoredUser())
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true)
    try {
      const response = await usuarioService.login(payload)
      persistSession(response.token, response.usuario)
      setToken(response.token)
      setUser(response.usuario)
    } finally {
      setLoading(false)
    }
  }, [])

  const cadastrar = useCallback(async (payload: CadastroPayload) => {
    setLoading(true)
    try {
      const response = await usuarioService.cadastrar(payload)
      persistSession(response.token, response.usuario)
      setToken(response.token)
      setUser(response.usuario)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      loading,
      login,
      cadastrar,
      logout,
    }),
    [user, token, loading, login, cadastrar, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

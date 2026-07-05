import { create } from 'zustand'
import type { User } from '../types/admin'

type AuthState = {
  accessToken: string | null
  user: User | null
  setSession: (accessToken: string, user: User) => void
  logout: () => void
}

const storedToken = localStorage.getItem('ars_admin_token')
const storedUser = localStorage.getItem('ars_admin_user')

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: storedToken,
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  setSession: (accessToken, user) => {
    localStorage.setItem('ars_admin_token', accessToken)
    localStorage.setItem('ars_admin_user', JSON.stringify(user))
    set({ accessToken, user })
  },
  logout: () => {
    localStorage.removeItem('ars_admin_token')
    localStorage.removeItem('ars_admin_user')
    set({ accessToken: null, user: null })
  },
}))


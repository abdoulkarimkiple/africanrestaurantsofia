import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/useAuthStore'
import type { User } from '../../types/admin'

type LoginResponse = {
  accessToken: string
  user: User
}

export function AdminLoginPage() {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.accessToken)
  const setSession = useAuthStore((state) => state.setSession)
  const [email, setEmail] = useState('admin@africanrestaurantsofia.com')
  const [password, setPassword] = useState('Admin123!')

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post<LoginResponse>('/api/v1/auth/login', {
        email,
        password,
      })
      return response.data
    },
    onSuccess: (data) => {
      setSession(data.accessToken, data.user)
      navigate('/admin')
    },
  })

  if (token) {
    return <Navigate to="/admin" replace />
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    loginMutation.mutate()
  }

  return (
    <main className="grid min-h-screen bg-[#f1eee7] p-4 text-[#2a2114] lg:grid-cols-[1fr_520px]">
      <section className="relative hidden overflow-hidden rounded-[32px] bg-[#fff7e6] p-10 text-[#2a2114] lg:block">
        <img
          src="/brand/logo.jpeg"
          alt="African Restaurant Sofia"
          className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover opacity-15"
        />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/brand/logo.jpeg"
              alt=""
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-[#d9a323]"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b58116]">
                Premium Ghost Kitchen
              </p>
              <p className="text-xl font-bold">African Restaurant Sofia</p>
            </div>
          </div>
          <div className="max-w-xl">
            <h1 className="text-6xl font-bold leading-tight">
              Dashboard admin restaurant
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#6f5a31]">
              Pilote les plats, categories, commandes, clients et parametres de
              ton restaurant depuis une interface claire et premium.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-4">
        <form
          className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl shadow-[#8b6a1f]/10"
          onSubmit={handleSubmit}
        >
          <img
            src="/brand/logo.jpeg"
            alt="African Restaurant Sofia"
            className="mb-8 h-20 w-20 rounded-3xl object-cover"
          />
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b58116]">
            Connexion admin
          </p>
          <h2 className="mt-2 text-4xl font-bold">Bienvenue</h2>
          <label className="mt-8 block text-sm font-semibold">Email</label>
          <input
            className="mt-2 h-12 w-full rounded-xl border border-stone-200 px-4 outline-none focus:border-[#d9a323]"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
          />
          <label className="mt-5 block text-sm font-semibold">Mot de passe</label>
          <input
            className="mt-2 h-12 w-full rounded-xl border border-stone-200 px-4 outline-none focus:border-[#d9a323]"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
          />
          {loginMutation.isError ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              Identifiants invalides.
            </p>
          ) : null}
          <button
            className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-[#d9a323] font-bold text-[#2a2114] transition hover:bg-[#f4c84f]"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
      </section>
    </main>
  )
}

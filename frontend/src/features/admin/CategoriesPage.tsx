import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../../lib/api'
import type { Category } from '../../types/admin'
import { PageTitle } from './AdminShell'
import { slugify } from './utils'

export function CategoriesPage() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () =>
      (
        await api.get<Category[]>('/api/v1/categories', {
          params: { includeInactive: true },
        })
      ).data,
  })

  const createMutation = useMutation({
    mutationFn: async () =>
      api.post('/api/v1/categories', {
        name,
        slug: slugify(name),
        description,
        isActive: true,
        sortOrder: categories.length + 1,
      }),
    onSuccess: async () => {
      setName('')
      setDescription('')
      await queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/api/v1/categories/${id}`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] }),
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createMutation.mutate()
  }

  return (
    <section>
      <PageTitle
        title="Categories"
        subtitle="Organise les familles de plats visibles sur le menu."
      />
      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <form className="rounded-2xl bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold">Nouvelle categorie</h2>
          <input
            className="mt-5 h-11 w-full rounded-xl border px-3"
            placeholder="Nom"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <textarea
            className="mt-3 min-h-28 w-full rounded-xl border p-3"
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <button className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#d9a323] font-bold text-[#2a2114]">
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </form>

        <div className="grid gap-3 md:grid-cols-2">
          {categories.map((category) => (
            <div className="rounded-2xl bg-white p-5 shadow-sm" key={category.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-bold">{category.name}</p>
                  <p className="mt-2 text-sm text-stone-500">
                    {category.description}
                  </p>
                </div>
                <button
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-red-600"
                  onClick={() => deleteMutation.mutate(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-5 text-sm font-semibold text-[#9b6a22]">
                {category.products?.length ?? 0} plats
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

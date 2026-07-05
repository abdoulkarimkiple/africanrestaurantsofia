import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserX } from 'lucide-react'
import { api } from '../../lib/api'
import type { User } from '../../types/admin'
import { PageTitle } from './AdminShell'

export function CustomersPage() {
  const queryClient = useQueryClient()
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get<User[]>('/api/v1/users')).data,
  })

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/api/v1/users/${id}`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  return (
    <section>
      <PageTitle
        title="Clients"
        subtitle="Consulte les comptes clients et membres de l'equipe."
      />
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase text-stone-400">
              <tr>
                <th className="py-3">Nom</th>
                <th>Email</th>
                <th>Telephone</th>
                <th>Role</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr className="border-t" key={user.id}>
                  <td className="py-4 font-bold">
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone ?? '-'}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className="rounded-full bg-[#fff0c7] px-3 py-1 text-xs font-bold text-[#9b6a22]">
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-red-600"
                      onClick={() => deactivateMutation.mutate(user.id)}
                      title="Desactiver"
                    >
                      <UserX className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

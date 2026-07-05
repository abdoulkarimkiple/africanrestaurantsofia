import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { Order, OrderStatus } from '../../types/admin'
import { PageTitle } from './AdminShell'
import { formatCurrency, formatDate } from './utils'

const orderStatuses: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY_FOR_DELIVERY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
]

export function OrdersPage() {
  const queryClient = useQueryClient()
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => (await api.get<Order[]>('/api/v1/orders')).data,
  })

  const statusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: OrderStatus
    }) => api.patch(`/api/v1/orders/${id}/status`, { status }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  })

  return (
    <section>
      <PageTitle
        title="Commandes"
        subtitle="Suis les commandes de la reception a la livraison."
      />
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="text-xs uppercase text-stone-400">
              <tr>
                <th className="py-3">Commande</th>
                <th>Client</th>
                <th>Articles</th>
                <th>Total</th>
                <th>Paiement</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr className="border-t" key={order.id}>
                  <td className="py-4">
                    <p className="font-bold">{order.orderNumber}</p>
                    <p className="text-xs text-stone-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </td>
                  <td>
                    <p className="font-semibold">
                      {order.customerFirstName} {order.customerLastName}
                    </p>
                    <p className="text-xs text-stone-500">{order.customerEmail}</p>
                  </td>
                  <td>{order.items.length} article(s)</td>
                  <td className="font-bold">{formatCurrency(order.totalCents)}</td>
                  <td>{order.payment?.status ?? 'Aucun'}</td>
                  <td>
                    <select
                      className="h-10 rounded-xl border px-3 text-sm"
                      value={order.status}
                      onChange={(event) =>
                        statusMutation.mutate({
                          id: order.id,
                          status: event.target.value as OrderStatus,
                        })
                      }
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
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


import { useQuery } from '@tanstack/react-query'
import {
  ArrowUpRight,
  ClipboardList,
  DollarSign,
  ShoppingBag,
  Users,
} from 'lucide-react'
import { api } from '../../lib/api'
import type { DashboardSummary } from '../../types/admin'
import { PageTitle } from './AdminShell'
import { formatCurrency, formatDate } from './utils'

function StatCard({
  label,
  value,
  tone = 'light',
  icon: Icon,
}: {
  label: string
  value: string | number
  tone?: 'light' | 'dark'
  icon: typeof Users
}) {
  return (
    <div
      className={[
        'rounded-2xl p-5 shadow-sm',
        tone === 'dark'
          ? 'bg-[#d9a323] text-[#2a2114] shadow-[#d9a323]/25'
          : 'bg-white text-[#2a2114]',
      ].join(' ')}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold opacity-80">{label}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b58116]/20">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-6 text-5xl font-bold">{value}</p>
      <p className="mt-3 flex items-center gap-1 text-sm opacity-70">
        <ArrowUpRight className="h-4 w-4" />
        Donnees en temps reel
      </p>
    </div>
  )
}

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () =>
      (await api.get<DashboardSummary>('/api/v1/dashboard/summary')).data,
  })

  return (
    <section>
      <PageTitle
        title="Dashboard"
        subtitle="Vue generale des operations de la ghost kitchen."
      />
      {isLoading ? (
        <div className="rounded-2xl bg-white p-8">Chargement...</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Revenu paye"
              value={formatCurrency(data?.revenueCents ?? 0)}
              tone="dark"
              icon={DollarSign}
            />
            <StatCard
              label="Produits"
              value={data?.productsCount ?? 0}
              icon={ShoppingBag}
            />
            <StatCard
              label="Commandes en attente"
              value={data?.pendingOrdersCount ?? 0}
              icon={ClipboardList}
            />
            <StatCard label="Clients" value={data?.usersCount ?? 0} icon={Users} />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold">Commandes recentes</h2>
              <div className="mt-4 space-y-3">
                {data?.recentOrders.length ? (
                  data.recentOrders.map((order) => (
                    <div
                      className="flex items-center justify-between rounded-xl bg-[#f6f4ef] p-4"
                      key={order.id}
                    >
                      <div>
                        <p className="font-bold">{order.orderNumber}</p>
                        <p className="text-sm text-stone-500">
                          {order.customerFirstName} {order.customerLastName} ·{' '}
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <p className="font-bold">{formatCurrency(order.totalCents)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-stone-500">Aucune commande recente.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[#eadfca] bg-white p-5 text-[#2a2114] shadow-sm">
              <h2 className="text-xl font-bold">Operations</h2>
              <div className="mt-6 h-40 rounded-2xl bg-[radial-gradient(circle_at_top,#f4c84f,#d9a323_52%,#8b5f13_100%)] p-5 text-[#2a2114]">
                <p className="text-sm text-[#5f4720]">Ghost kitchen New York</p>
                <p className="mt-8 text-4xl font-bold">
                  {data?.deliveredOrdersCount ?? 0}
                </p>
                <p className="text-sm text-[#5f4720]">commandes livrees</p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

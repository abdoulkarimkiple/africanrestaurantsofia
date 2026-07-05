import {
  Bell,
  Boxes,
  ChartNoAxesCombined,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ShoppingBag,
  Users,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

type NavItem = {
  to: string
  label: string
  icon: ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Produits', icon: ShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Commandes', icon: ClipboardList },
  { to: '/admin/customers', label: 'Clients', icon: Users },
  { to: '/admin/settings', label: 'Parametres', icon: Settings },
]

export function AdminShell() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#f1eee7] p-3 text-[#2a2114] md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-48px)] max-w-[1500px] grid-cols-1 overflow-hidden rounded-[28px] border border-white bg-[#fbfaf6] shadow-2xl shadow-[#8b6a1f]/10 md:grid-cols-[280px_1fr]">
        <aside className="flex flex-col border-b border-[#eadfca] bg-white/75 p-5 md:border-b-0 md:border-r">
          <div className="flex items-center gap-3">
            <img
              src="/brand/logo.jpeg"
              alt="African Restaurant Sofia"
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-[#d9a323]/50"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#b58116]">
                Sofia
              </p>
              <p className="text-lg font-bold">Admin</p>
            </div>
          </div>

          <nav className="mt-10 space-y-1">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) =>
                    [
                      'flex h-12 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition',
                      isActive
                        ? 'bg-[#d9a323] text-[#2a2114] shadow-lg shadow-[#d9a323]/25'
                        : 'text-stone-500 hover:bg-[#fbf3df] hover:text-[#2a2114]',
                    ].join(' ')
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-[#eadfca] bg-[#fff7e6] p-4 text-[#2a2114] shadow-sm shadow-[#d9a323]/10">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#d9a323] text-[#2a2114]">
              <Boxes className="h-5 w-5" />
            </div>
            <p className="text-lg font-semibold leading-6">Ghost kitchen</p>
            <p className="mt-1 text-xs leading-5 text-[#7c6a4b]">
              Commandes, menu et clients dans un seul cockpit.
            </p>
          </div>
        </aside>

        <main className="min-w-0 p-4 md:p-6">
          <header className="mb-4 flex flex-col gap-3 rounded-2xl bg-white/85 p-4 shadow-sm shadow-[#8b6a1f]/5 md:flex-row md:items-center md:justify-between">
            <div className="flex h-12 flex-1 items-center gap-3 rounded-xl bg-[#f3f3f0] px-4 text-stone-400">
              <Search className="h-5 w-5" />
              <span className="text-sm">Rechercher dans le dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2a2114] shadow-sm">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3 rounded-full bg-white py-1 pl-1 pr-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4c84f] font-bold text-[#2a2114]">
                  {user?.firstName?.[0] ?? 'A'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold">
                    {user?.firstName ?? 'Admin'} {user?.lastName ?? ''}
                  </p>
                  <p className="text-xs text-stone-500">{user?.email}</p>
                </div>
              </div>
              <button
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9a323]/50 text-[#9b6a22]"
                onClick={handleLogout}
                title="Deconnexion"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function PageTitle({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b58116]">
          African Restaurant Sofia
        </p>
        <h1 className="mt-1 text-4xl font-bold tracking-normal">{title}</h1>
        <p className="mt-2 text-sm text-stone-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 text-sm font-semibold text-[#b58116]">
        <ChartNoAxesCombined className="h-4 w-4" />
        Live operations
      </div>
    </div>
  )
}

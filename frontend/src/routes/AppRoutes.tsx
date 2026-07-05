import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLoginPage } from '../features/admin/AdminLoginPage'
import { AdminShell } from '../features/admin/AdminShell'
import { CategoriesPage } from '../features/admin/CategoriesPage'
import { CustomersPage } from '../features/admin/CustomersPage'
import { DashboardPage } from '../features/admin/DashboardPage'
import { OrdersPage } from '../features/admin/OrdersPage'
import { ProductsPage } from '../features/admin/ProductsPage'
import { ProtectedAdminRoute } from '../features/admin/ProtectedAdminRoute'
import { SettingsPage } from '../features/admin/SettingsPage'
import { HomePage } from '../pages/HomePage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<AdminShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

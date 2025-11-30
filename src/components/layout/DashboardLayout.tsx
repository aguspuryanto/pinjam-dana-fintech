// src/components/layout/DashboardLayout.tsx
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    // Clear any user data from localStorage or context
    localStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('isAuthenticated')
    navigate('/login')
  }

  // Ajukan Pinjaman
  // Bayar Tagihan
  // Kelola Rekening
  // Verifikasi KYC
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Ajukan Pinjaman',
      path: '/loan/apply',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Bayar Tagihan',
      path: '/payment',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Kelola Rekening',
      path: '/bank',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Verifikasi KYC',
      path: '/kyc',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <User className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-30 h-screen w-64 -translate-x-full transform border-r bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0',
          {
            'translate-x-0': isSidebarOpen,
          }
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-6">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center space-x-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  {
                    'bg-accent text-accent-foreground':
                      location.pathname === item.path,
                  }
                )}
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="border-t p-4">
            <Button
              variant="outline"
              className="w-full justify-start space-x-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="flex h-16 items-center border-b bg-white px-4 shadow-sm lg:ml-64">
          <button
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-auto">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:ml-64">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
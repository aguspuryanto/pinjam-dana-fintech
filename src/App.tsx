// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
// import DashboardPage from './pages/dashboard/DashboardPage'
import DashboardPage from './pages/dashboard/Dashboard'
import ProfilePage from './pages/profile/ProfilePage'
import LoginPage from './pages/auth/LoginPage'
import Register from './pages/auth/Register'
import KYC from './pages/kyc/KYC'
import ApplyLoan from './pages/loan/ApplyLoan'
import Payment from './pages/payment/Payment'
import BankAccount from './pages/bank/BankAccount'

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') || sessionStorage.getItem('isAuthenticated')
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          
          <Route path="/kyc" element={<KYC />} />
          <Route path="/loan/apply" element={<ApplyLoan />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/bank" element={<BankAccount />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
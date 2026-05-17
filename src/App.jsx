import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Trade from './pages/Trade'

function AppInner() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const hideNavOn = ['/login', '/signup']
  const showNav = !hideNavOn.includes(location.pathname)

  return (
    <>
      {showNav && <Navbar user={user} onLogout={logout} />}
      <Routes>
        <Route path="/"          element={<Home />}      />
        <Route path="/login"     element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup"    element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trade"     element={<Trade />}     />
        <Route path="*"          element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

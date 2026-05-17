import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Simulated user data store
const MOCK_USERS = {
  'demo@369xchange.com': {
    id: 'usr_001',
    email: 'demo@369xchange.com',
    password: 'demo1234',
    name: 'Alex Rivera',
    kyc: 'verified',
    createdAt: '2024-01-15',
    portfolio: {
      BTC:  { amount: 0.52831, avgBuy: 67000 },
      ETH:  { amount: 4.218,   avgBuy: 2800  },
      SOL:  { amount: 48.5,    avgBuy: 140   },
      USDT: { amount: 15240,   avgBuy: 1     },
      BNB:  { amount: 3.1,     avgBuy: 420   },
    },
    transactions: [
      { id: 'tx1', type: 'buy',  sym: 'BTC',  amount: 0.1,   price: 98500,  total: 9850,  date: '2026-05-10', status: 'completed' },
      { id: 'tx2', type: 'sell', sym: 'ETH',  amount: 1.5,   price: 3920,   total: 5880,  date: '2026-05-09', status: 'completed' },
      { id: 'tx3', type: 'buy',  sym: 'SOL',  amount: 20,    price: 178,    total: 3560,  date: '2026-05-08', status: 'completed' },
      { id: 'tx4', type: 'deposit', sym: 'USDT', amount: 5000, price: 1,   total: 5000,  date: '2026-05-05', status: 'completed' },
      { id: 'tx5', type: 'buy',  sym: 'BNB',  amount: 1.1,   price: 590,    total: 649,   date: '2026-05-01', status: 'completed' },
    ],
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('369x_user')
      return s ? JSON.parse(s) : null
    } catch { return null }
  })

  const login = (email, password) => {
    const found = MOCK_USERS[email.toLowerCase()]
    if (!found || found.password !== password) {
      throw new Error('Invalid email or password')
    }
    const { password: _, ...safe } = found
    setUser(safe)
    localStorage.setItem('369x_user', JSON.stringify(safe))
    return safe
  }

  const signup = (email, password, name) => {
    if (MOCK_USERS[email.toLowerCase()]) {
      throw new Error('Account already exists')
    }
    const newUser = {
      id: 'usr_' + Date.now(),
      email,
      name,
      kyc: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      portfolio: { USDT: { amount: 0, avgBuy: 1 } },
      transactions: [],
    }
    setUser(newUser)
    localStorage.setItem('369x_user', JSON.stringify(newUser))
    return newUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('369x_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

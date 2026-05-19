import { createContext, useContext, useState, useEffect } from 'react'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('369x_user')
      return s ? JSON.parse(s) : null
    } catch { return null }
  })
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        // User signed in with Google, create/restore user profile
        const existingData = localStorage.getItem('369x_google_' + fbUser.uid)
        let userData
        
        if (existingData) {
          userData = JSON.parse(existingData)
          userData.photoURL = fbUser.photoURL // Update photo in case it changed
        } else {
          userData = {
            id: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            photoURL: fbUser.photoURL,
            kyc: 'pending',
            createdAt: new Date().toISOString().split('T')[0],
            portfolio: { USDT: { amount: 0, avgBuy: 1 } },
            transactions: [],
            isGoogleUser: true,
          }
          localStorage.setItem('369x_google_' + fbUser.uid, JSON.stringify(userData))
        }
        
        setUser(userData)
        localStorage.setItem('369x_user', JSON.stringify(userData))
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const loginWithGoogle = async () => {
    try {
      // Configure provider for better compatibility
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      })
      
      const result = await signInWithPopup(auth, googleProvider)
      const fbUser = result.user
      
      // Check if this Google user exists in local storage
      const existingData = localStorage.getItem('369x_google_' + fbUser.uid)
      let userData
      
      if (existingData) {
        userData = JSON.parse(existingData)
        userData.photoURL = fbUser.photoURL // Update photo in case it changed
      } else {
        userData = {
          id: fbUser.uid,
          email: fbUser.email,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          photoURL: fbUser.photoURL,
          kyc: 'pending',
          createdAt: new Date().toISOString().split('T')[0],
          portfolio: { USDT: { amount: 0, avgBuy: 1 } },
          transactions: [],
          isGoogleUser: true,
        }
        localStorage.setItem('369x_google_' + fbUser.uid, JSON.stringify(userData))
      }
      
      setUser(userData)
      localStorage.setItem('369x_user', JSON.stringify(userData))
      return userData
    } catch (error) {
      console.error('Google sign-in error:', error)
      // Provide more user-friendly error messages
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.')
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up was blocked. Please allow pop-ups for this site.')
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized for Google Sign-In. Please deploy to an authorized domain.')
      }
      throw new Error(error.message || 'Failed to sign in with Google')
    }
  }

  const signup = (email, password, name) => {
    // Check if email already exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('369x_users') || '{}')
    if (existingUsers[email.toLowerCase()]) {
      throw new Error('Account already exists with this email')
    }
    
    const newUser = {
      id: 'usr_' + Date.now(),
      email,
      name,
      password, // In production, this should be hashed
      kyc: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      portfolio: { USDT: { amount: 0, avgBuy: 1 } },
      transactions: [],
    }
    
    // Store user in users collection
    existingUsers[email.toLowerCase()] = newUser
    localStorage.setItem('369x_users', JSON.stringify(existingUsers))
    
    // Set current user (without password in active session)
    const { password: _, ...safeUser } = newUser
    setUser(safeUser)
    localStorage.setItem('369x_user', JSON.stringify(safeUser))
    return safeUser
  }

  const login = (email, password) => {
    const existingUsers = JSON.parse(localStorage.getItem('369x_users') || '{}')
    const found = existingUsers[email.toLowerCase()]
    
    if (!found || found.password !== password) {
      throw new Error('Invalid email or password')
    }
    
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem('369x_user', JSON.stringify(safeUser))
    return safeUser
  }

  const logout = async () => {
    // Sign out from Firebase if signed in with Google
    if (firebaseUser) {
      try {
        await signOut(auth)
      } catch (error) {
        console.error('Firebase sign out error:', error)
      }
    }
    setUser(null)
    setFirebaseUser(null)
    localStorage.removeItem('369x_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

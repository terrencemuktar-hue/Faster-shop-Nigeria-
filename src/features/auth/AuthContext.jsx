import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../../lib/firebase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false)
      return undefined
    }

    let unsubscribeProfile = () => {}
    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
      unsubscribeProfile()
      setUser(nextUser)

      if (!nextUser) {
        setProfile(null)
        setLoading(false)
        return
      }

      setLoading(true)
      unsubscribeProfile = onSnapshot(doc(db, 'users', nextUser.uid), (profileSnapshot) => {
        setProfile(profileSnapshot.exists() ? profileSnapshot.data() : null)
        setLoading(false)
      }, (error) => {
        console.error('Unable to load the account profile:', error)
        setProfile(null)
        setLoading(false)
      })
    })

    return () => {
      unsubscribeAuth()
      unsubscribeProfile()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
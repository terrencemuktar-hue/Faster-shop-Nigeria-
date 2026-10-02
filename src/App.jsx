import AuthPage from './features/auth/AuthPage.jsx'
import { useAuth } from './features/auth/AuthContext.jsx'
import HomePage from './features/home/HomePage.jsx'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-state" role="status">Checking your account...</div>
  }

  return user ? <HomePage /> : <AuthPage />
}
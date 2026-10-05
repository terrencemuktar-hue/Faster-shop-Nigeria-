import AuthPage from './features/auth/AuthPage';
import { useAuth } from './features/auth/AuthContext.jsx';
import HomePage from './features/home/HomePage.jsx';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-state" role="status">Checking your account...</div>
  }

  return (
    <>
      {user ? <HomePage /> : <AuthPage />}
      <Analytics />
    </>
  )
}

import { useState } from 'react'
import {
  ArrowRight,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Zap,
} from 'lucide-react'
import { isFirebaseConfigured } from '../../lib/firebase.js'
import { useAuth } from './AuthContext.jsx'
import {
  createAccount,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
} from './authService.js'

const firebaseErrorMessages = {
  'auth/email-already-in-use': 'There is already an account with this email.',
  'auth/invalid-credential': 'That email and password combination did not match.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/popup-closed-by-user': 'The Google sign-in window was closed before finishing.',
  'auth/popup-blocked': 'Your browser blocked the Google sign-in window. Allow pop-ups and try again.',
  'auth/weak-password': 'Choose a password with at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Wait a moment, then try again.',
}

function getErrorMessage(error) {
  return firebaseErrorMessages[error.code] ?? error.message ?? 'Something went wrong. Please try again.'
}

function Brand({ inverse = false }) {
  return (
    <a className={`brand${inverse ? ' brand--inverse' : ''}`} href="/" aria-label="Faster Shop home">
      <span className="brand__mark"><Zap size={18} fill="currentColor" /></span>
      <span>faster<span className="brand__shop">shop</span></span>
    </a>
  )
}

export default function AuthPage({ initialRole = 'buyer', onContinue }) {
  const { user, profile, loading } = useAuth()
  const [mode, setMode] = useState('signup')
  const [role, setRole] = useState(initialRole)
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)

    const formData = new FormData(event.currentTarget)

    try {
      if (mode === 'signup') {
        await createAccount({
          name: formData.get('name'),
          email: formData.get('email'),
          password: formData.get('password'),
          role,
          storeName: formData.get('storeName') || '',
        })
      } else {
        await signInWithEmail({
          email: formData.get('email'),
          password: formData.get('password'),
        })
      }
    } catch (authError) {
      setError(getErrorMessage(authError))
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogleSignIn() {
    setError('')
    setBusy(true)

    try {
      await signInWithGoogle()
    } catch (authError) {
      setError(getErrorMessage(authError))
    } finally {
      setBusy(false)
    }
  }

  async function handleSignOut() {
    setError('')
    setBusy(true)

    try {
      await signOutUser()
    } catch (authError) {
      setError(getErrorMessage(authError))
    } finally {
      setBusy(false)
    }
  }

  const configured = isFirebaseConfigured
  const isSignup = mode === 'signup'

  return (
    <main className="auth-layout">
      <section className="editorial" aria-label="Faster Shop">
        <div className="editorial__image" />
        <div className="editorial__shade" />
        <header className="editorial__header">
          <Brand inverse />
          <span className="editorial__location">LAGOS, NIGERIA <span>●</span></span>
        </header>
        <div className="editorial__content">
          <span className="eyebrow"><Sparkles size={13} /> GOOD FINDS, CLOSER</span>
          <h1>Your next<br />favourite is<br /><em>around here.</em></h1>
          <p>Independent labels. Original style.<br />Straight from the people who made it.</p>
        </div>
        <footer className="editorial__footer">
          <span><span className="editorial__dot" /> MADE FOR HERE</span>
          <span>01 / 03</span>
        </footer>
      </section>

      <section className="auth-panel">
        <header className="mobile-header"><Brand /></header>

        <div className="auth-content">
          {loading ? (
            <div className="loading-state" role="status">Checking your account...</div>
          ) : user ? (
            <div className="signed-in">
              <div className="signed-in__icon"><ShoppingBag size={24} /></div>
              <span className="eyebrow eyebrow--dark">ACCOUNT READY</span>
              <h2>Good to have<br />you here.</h2>
              <p className="signed-in__email">{profile?.displayName || user.displayName || user.email}</p>
              <div className="role-row"><ShieldCheck size={16} /> {profile?.role ?? 'buyer'} account</div>
              {profile?.role === 'vendor' && profile.vendorStatus !== 'approved' && (
                <p className="setup-notice" role="status">Your vendor application is pending approval. You can browse and shop while we review your store.</p>
              )}
              {onContinue && <button className="button button--primary" type="button" onClick={onContinue}>Continue to Faster Shop <ArrowRight size={16} /></button>}
              <button className="button button--secondary signout-button" onClick={handleSignOut} disabled={busy}>
                <LogOut size={16} /> Sign out
              </button>
              {error && <p className="form-error" role="alert">{error}</p>}
            </div>
          ) : (
            <>
              <div className="form-heading">
                <span className="eyebrow eyebrow--dark">{isSignup ? (role === 'vendor' ? 'START YOUR STORE' : 'A BETTER WAY TO SHOP') : 'WELCOME BACK'}</span>
                <h2>{isSignup ? (role === 'vendor' ? <>Make room<br />for your <em>brand.</em></> : <>Find your<br />kind of <em>different.</em></>) : <>Your finds<br />missed <em>you.</em></>}</h2>
                <p>{isSignup ? (role === 'vendor' ? 'Create a vendor account. Store management unlocks after approval.' : 'Create an account and meet the makers behind your next favourite.') : 'Pick up right where you left off.'}</p>
              </div>

              {!configured && (
                <div className="setup-notice" role="status">
                  <strong>Firebase setup needed</strong>
                  <span>Add your Firebase web app settings to <code>.env.local</code> to turn on authentication.</span>
                </div>
              )}

              {error && <p className="form-error" role="alert">{error}</p>}

              <button className="button button--google" type="button" onClick={handleGoogleSignIn} disabled={!configured || busy}>
                <span className="google-mark" aria-hidden="true">G</span>
                Continue with Google
              </button>

              <div className="divider"><span /> <span>or with email</span> <span /></div>

              <form className="auth-form" onSubmit={handleSubmit}>
                {isSignup && (
                  <>
                    <fieldset className="account-type-picker" disabled={!configured || busy}>
                      <legend>Account type</legend>
                      <button type="button" className={role === 'buyer' ? 'account-type-picker__option account-type-picker__option--active' : 'account-type-picker__option'} aria-pressed={role === 'buyer'} onClick={() => setRole('buyer')}><ShoppingBag size={15} /> Buyer</button>
                      <button type="button" className={role === 'vendor' ? 'account-type-picker__option account-type-picker__option--active' : 'account-type-picker__option'} aria-pressed={role === 'vendor'} onClick={() => setRole('vendor')}><Sparkles size={15} /> Vendor</button>
                    </fieldset>
                    <label className="field">
                      <span>{role === 'vendor' ? 'Your name' : 'Your name'}</span>
                      <input autoComplete="name" name="name" placeholder="e.g. Amara Okafor" required disabled={!configured || busy} />
                    </label>
                    {role === 'vendor' && (
                      <label className="field">
                        <span>Store name</span>
                        <input autoComplete="organization" name="storeName" placeholder="The name customers will see" required disabled={!configured || busy} />
                      </label>
                    )}
                  </>
                )}
                <label className="field">
                  <span>Email address</span>
                  <input autoComplete="email" name="email" type="email" placeholder="you@example.com" required disabled={!configured || busy} />
                </label>
                <label className="field">
                  <span>Password</span>
                  <span className="password-input">
                    <input autoComplete={isSignup ? 'new-password' : 'current-password'} minLength="6" name="password" placeholder="At least 6 characters" required type={showPassword ? 'text' : 'password'} disabled={!configured || busy} />
                    <button aria-label={showPassword ? 'Hide password' : 'Show password'} className="password-toggle" onClick={() => setShowPassword(!showPassword)} type="button" disabled={!configured || busy}>
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </span>
                </label>
                <button className="button button--primary" type="submit" disabled={!configured || busy}>
                  {busy ? 'One moment...' : isSignup ? 'Create your account' : 'Sign in'}
                  {!busy && <ArrowRight size={17} />}
                </button>
              </form>

              <p className="switch-mode">
                {isSignup ? 'Already have an account?' : 'New around here?'}{' '}
                <button type="button" onClick={() => { setMode(isSignup ? 'signin' : 'signup'); setError('') }}>
                  {isSignup ? 'Sign in' : 'Create an account'}
                </button>
              </p>
            </>
          )}
        </div>

        <footer className="auth-footer">
          <span>© {new Date().getFullYear()} Faster Shop Nigeria</span>
          <span><ShieldCheck size={14} /> YOUR DETAILS STAY YOURS</span>
        </footer>
      </section>
    </main>
  )
}
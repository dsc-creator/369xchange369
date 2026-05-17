import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Signup() {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [agree,    setAgree]    = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { signup } = useAuth()
  const navigate   = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agree) { setError('Please accept the terms to continue.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError('')
    setLoading(true)
    try {
      await signup(email, password, name)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(0,229,160,0.06) 0%, transparent 60%)',
    }}>
      <div style={{
        width: '100%', maxWidth: 440,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 40,
        position: 'relative', overflow: 'hidden',
        animation: 'fadeUp .4s ease both',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--accent-green), var(--accent-cyan), transparent)' }} />

        <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20 }}>
            <span style={{ color: 'var(--text-primary)' }}>369</span>
            <span style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>x</span>
            <span style={{ color: 'var(--text-primary)' }}>change</span>
          </div>
        </Link>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 6 }}>
          Create your account
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>
          Start trading in minutes. No fees to sign up.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'FULL NAME',       type: 'text',     val: name,     set: setName,     ph: 'John Doe' },
            { label: 'EMAIL ADDRESS',   type: 'email',    val: email,    set: setEmail,    ph: 'you@example.com' },
            { label: 'PASSWORD',        type: 'password', val: password, set: setPassword, ph: 'Min. 8 characters' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: 0.5 }}>
                {f.label}
              </label>
              <input
                type={f.type}
                value={f.val}
                onChange={e => f.set(e.target.value)}
                placeholder={f.ph}
                required
                style={{
                  width: '100%', padding: '13px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)', fontSize: 15,
                  outline: 'none', transition: 'border-color .2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-cyan)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
              />
            </div>
          ))}

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginTop: 4 }}>
            <input
              type="checkbox"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              style={{ marginTop: 2, accentColor: 'var(--accent-cyan)', width: 15, height: 15 }}
            />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              I agree to the{' '}
              <Link to="/" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>Terms of Service</Link>
              {' '}and{' '}
              <Link to="/" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>Privacy Policy</Link>
            </span>
          </label>

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,77,106,0.1)', border: '1px solid rgba(255,77,106,0.3)',
              fontSize: 13, color: 'var(--accent-red)',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px', border: 'none', borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-green))',
              color: 'var(--bg-base)',
              fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'opacity .2s',
              marginTop: 4,
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', marginTop: 24 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-cyan)', fontWeight: 600, textDecoration: 'none' }}>Log In</Link>
        </p>
      </div>
    </div>
  )
}

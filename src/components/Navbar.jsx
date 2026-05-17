import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Markets', href: '/#markets' },
    { label: 'Trade',   to: '/trade' },
    { label: 'Earn',    href: '/#earn' },
    { label: 'About',   to: '/about' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: 68,
      background: scrolled ? 'rgba(7,11,20,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.35s ease',
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto', padding: '0 40px',
        height: '100%', display: 'flex', alignItems: 'center', gap: 40,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
            letterSpacing: '-0.5px',
          }}>
            <span style={{ color: 'var(--text-primary)' }}>369</span>
            <span style={{
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-green))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>x</span>
            <span style={{ color: 'var(--text-primary)' }}>change</span>
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {navLinks.map(link => (
            link.to
              ? <Link key={link.label} to={link.to} style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                  color: location.pathname === link.to ? 'var(--text-primary)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  background: location.pathname === link.to ? 'rgba(255,255,255,0.06)' : 'transparent',
                  transition: 'all .2s',
                }}
                onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => {
                  e.target.style.color = location.pathname === link.to ? 'var(--text-primary)' : 'var(--text-secondary)'
                  e.target.style.background = location.pathname === link.to ? 'rgba(255,255,255,0.06)' : 'transparent'
                }}
              >{link.label}</Link>
              : <a key={link.label} href={link.href} style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                  color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' }}
              >{link.label}</a>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
          {user ? (
            <>
              <Link to="/dashboard" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 16px', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.04)',
                textDecoration: 'none', fontSize: 13, fontWeight: 600,
                color: 'var(--text-primary)',
                transition: 'all .2s',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-green))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: 'var(--bg-base)',
                }}>
                  {user.email?.[0]?.toUpperCase() ?? 'U'}
                </div>
                Dashboard
              </Link>
              <button onClick={onLogout} style={{
                padding: '7px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', transition: 'all .2s',
              }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                padding: '7px 18px', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
                textDecoration: 'none', transition: 'all .2s',
              }}>Log In</Link>
              <Link to="/signup" style={{
                padding: '8px 20px', borderRadius: 'var(--radius-sm)', border: 'none',
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-green))',
                color: 'var(--bg-base)', fontSize: 13, fontWeight: 700,
                textDecoration: 'none',
              }}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

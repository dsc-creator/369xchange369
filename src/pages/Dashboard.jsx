import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCoins } from '../hooks/useCoins'
import MiniChart from '../components/MiniChart'

const PORTFOLIO_COINS = [
  { sym: 'BTC',  name: 'Bitcoin',   icon: '₿', color: '#f7931a', amount: 0.52831 },
  { sym: 'ETH',  name: 'Ethereum',  icon: 'Ξ', color: '#627eea', amount: 4.218   },
  { sym: 'SOL',  name: 'Solana',    icon: '◎', color: '#9945ff', amount: 48.5    },
  { sym: 'USDT', name: 'Tether',    icon: '₮', color: '#26a17b', amount: 15240   },
  { sym: 'BNB',  name: 'BNB',       icon: 'B', color: '#f3ba2f', amount: 3.1     },
]

const TXNS = [
  { type: 'buy',     sym: 'BTC',  icon: '₿', color: '#f7931a', amount: '+0.1 BTC',    usd: '$9,850',  date: 'May 10', status: 'completed' },
  { type: 'sell',    sym: 'ETH',  icon: 'Ξ', color: '#627eea', amount: '-1.5 ETH',    usd: '$5,880',  date: 'May 9',  status: 'completed' },
  { type: 'buy',     sym: 'SOL',  icon: '◎', color: '#9945ff', amount: '+20 SOL',     usd: '$3,560',  date: 'May 8',  status: 'completed' },
  { type: 'deposit', sym: 'USDT', icon: '₮', color: '#26a17b', amount: '+5,000 USDT', usd: '$5,000',  date: 'May 5',  status: 'completed' },
  { type: 'buy',     sym: 'BNB',  icon: 'B', color: '#f3ba2f', amount: '+1.1 BNB',    usd: '$649',    date: 'May 1',  status: 'completed' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { coins } = useCoins()
  const [activeSection, setActiveSection] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) return <Navigate to="/login" />

  // Calculate portfolio values using live prices
  const portfolioItems = PORTFOLIO_COINS.map(pc => {
    const livePrice = coins.find(c => c.sym === pc.sym)?.price ?? 0
    const value     = pc.amount * livePrice
    const change    = coins.find(c => c.sym === pc.sym)?.change ?? 0
    return { ...pc, price: livePrice, value, change, up: change >= 0 }
  })

  const totalValue = portfolioItems.reduce((sum, i) => sum + i.value, 0)
  const topAlloc   = portfolioItems.sort((a, b) => b.value - a.value)

  const navItems = [
    { id: 'overview',  icon: '⬡', label: 'Overview'   },
    { id: 'portfolio', icon: '◈', label: 'Portfolio'   },
    { id: 'trade',     icon: '⇄', label: 'Trade',      link: '/trade' },
    { id: 'history',   icon: '⏱', label: 'History'    },
    { id: 'deposit',   icon: '↓', label: 'Deposit'    },
  ]

  const handleNavClick = (id) => {
    setActiveSection(id)
    setSidebarOpen(false)
  }

  return (
    <>
      <style>{`
        .dashboard-wrapper {
          margin-top: 68px;
          min-height: calc(100vh - 68px);
        }
        .dashboard-layout {
          display: flex;
          min-height: calc(100vh - 68px);
        }
        @media (max-width: 900px) {
          .dashboard-layout {
            flex-direction: column;
          }
        }
        .dashboard-sidebar {
          width: 220px;
          flex-shrink: 0;
          background: var(--bg-surface);
          border-right: 1px solid var(--border);
          padding: 28px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: sticky;
          top: 68px;
          height: calc(100vh - 68px);
          transition: transform 0.3s ease;
          z-index: 100;
        }
        @media (max-width: 900px) {
          .dashboard-sidebar {
            position: fixed;
            left: 0;
            top: 68px;
            bottom: 0;
            width: 280px;
            height: auto;
            transform: translateX(-100%);
            box-shadow: 4px 0 20px rgba(0,0,0,0.3);
          }
          .dashboard-sidebar.open {
            transform: translateX(0);
          }
        }
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          top: 68px;
          background: rgba(0,0,0,0.6);
          z-index: 99;
        }
        @media (max-width: 900px) {
          .sidebar-overlay.open {
            display: block;
          }
        }
        .mobile-header {
          display: none;
          padding: 14px 20px;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border);
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        @media (max-width: 900px) {
          .mobile-header {
            display: flex;
          }
        }
        .menu-toggle {
          display: none;
          background: none;
          border: 1px solid var(--border);
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        @media (max-width: 900px) {
          .menu-toggle {
            display: flex;
            align-items: center;
            gap: 8px;
          }
        }
        .dashboard-main {
          flex: 1;
          padding: 32px 40px;
          overflow: auto;
        }
        @media (max-width: 900px) {
          .dashboard-main {
            padding: 24px 20px;
          }
        }
        @media (max-width: 480px) {
          .dashboard-main {
            padding: 20px 16px;
          }
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }
        @media (max-width: 900px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        @media (max-width: 768px) {
          .portfolio-grid {
            grid-template-columns: 1fr;
          }
        }
        .balance-card {
          background: linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(0,229,160,0.07) 100%);
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-lg);
          padding: 32px 36px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .balance-card {
            padding: 24px 20px;
            border-radius: var(--radius-md);
          }
        }
        @media (max-width: 480px) {
          .balance-card {
            padding: 20px 16px;
          }
        }
        .balance-stats {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }
        @media (max-width: 480px) {
          .balance-stats {
            flex-direction: column;
            gap: 8px;
          }
        }
        .holdings-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 22px;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        @media (max-width: 480px) {
          .holdings-row {
            padding: 12px 14px;
            gap: 10px;
          }
        }
        .deposit-methods {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .deposit-method {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s;
        }
        @media (max-width: 480px) {
          .deposit-method {
            padding: 14px 12px;
            gap: 10px;
          }
          .deposit-method > div:last-of-type {
            display: none;
          }
        }
        .txn-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 22px;
        }
        @media (max-width: 480px) {
          .txn-row {
            padding: 14px 16px;
            gap: 12px;
          }
        }
        .portfolio-card {
          padding: 20px 22px;
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          transition: border-color .2s;
        }
        @media (max-width: 480px) {
          .portfolio-card {
            padding: 16px;
          }
        }
      `}</style>

      <div className="dashboard-wrapper">
        {/* Mobile Header */}
        <div className="mobile-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span style={{ fontSize: 18 }}>☰</span>
            Menu
          </button>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            {navItems.find(n => n.id === activeSection)?.label || 'Dashboard'}
          </span>
          <div style={{ width: 70 }} /> {/* Spacer for centering */}
        </div>

        <div className="dashboard-layout">
          {/* Sidebar Overlay */}
          <div 
            className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
            onClick={() => setSidebarOpen(false)}
          />

        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div style={{ marginBottom: 20, padding: '0 12px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
              Account
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-green))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 800, color: 'var(--bg-base)',
                flexShrink: 0,
              }}>
                {user.name?.[0] ?? 'U'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name ?? 'User'}</div>
                <div style={{ fontSize: 10, color: user.kyc === 'verified' ? 'var(--accent-green)' : 'var(--accent-amber)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {user.kyc === 'verified' ? '✓ Verified' : '⏳ KYC Pending'}
                </div>
              </div>
            </div>
          </div>

          {navItems.map(item => (
            item.link
              ? <Link key={item.id} to={item.link} style={{ textDecoration: 'none' }} onClick={() => setSidebarOpen(false)}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                    fontSize: 14, fontWeight: 500,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all .15s',
                  }}>
                    <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
                    {item.label}
                  </div>
                </Link>
              : <div key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                    fontSize: 14, fontWeight: activeSection === item.id ? 600 : 500,
                    background: activeSection === item.id ? 'rgba(0,212,255,0.08)' : 'transparent',
                    color: activeSection === item.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    borderLeft: activeSection === item.id ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                    cursor: 'pointer', transition: 'all .15s',
                  }}
                >
                  <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
                  {item.label}
                </div>
          ))}

          <div style={{ marginTop: 'auto' }}>
            <div style={{
              padding: '14px 12px',
              background: 'rgba(0,212,255,0.06)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-accent)',
            }}>
              <div style={{ fontSize: 10, color: 'var(--accent-cyan)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                Earn up to
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
                7.12% <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>APY</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Stake SOL</div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="dashboard-main">

          {/* Overview */}
          {activeSection === 'overview' && (
            <div style={{ animation: 'fadeUp .35s ease both' }}>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>
                  Good day, {user.name?.split(' ')[0] ?? 'Trader'} 👋
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{"Here's your portfolio at a glance."}</p>
              </div>

              {/* Balance card */}
              <div className="balance-card">
                <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Total Portfolio Value</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 700, letterSpacing: '-2px', marginBottom: 8 }}>
                  ${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
                <div className="balance-stats">
                  <span style={{ fontSize: 13, color: 'var(--accent-green)', fontWeight: 600 }}>▲ +$3,247.20 this month</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>+4.24% vs last month</span>
                </div>
              </div>

              {/* Stat cards */}
              <div className="stats-grid">
                {[
                  { label: 'Assets Held',     val: portfolioItems.length,        sub: 'Unique tokens',     icon: '◈', color: 'var(--accent-cyan)' },
                  { label: "Today's P&L",     val: '+$482.30',                   sub: '+1.82% today',     icon: '↑', color: 'var(--accent-green)' },
                  { label: 'Open Orders',     val: '3',                          sub: 'Active positions',  icon: '⇄', color: 'var(--accent-amber)' },
                ].map(s => (
                  <div key={s.label} style={{
                    padding: '20px 22px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: 0.5 }}>{s.label.toUpperCase()}</div>
                      <div style={{ fontSize: 18, color: s.color }}>{s.icon}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-1px', marginBottom: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Holdings table */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Holdings</div>
                  <button onClick={() => setActiveSection('portfolio')} style={{ fontSize: 12, color: 'var(--accent-cyan)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    View All →
                  </button>
                </div>
                {topAlloc.map((coin, i) => (
                  <div key={coin.sym} className="holdings-row"
                    style={{ borderBottom: i < topAlloc.length - 1 ? '1px solid var(--border)' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${coin.color}22`, color: coin.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, flexShrink: 0 }}>{coin.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{coin.sym}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{coin.amount.toFixed(coin.amount < 1 ? 5 : 2)} {coin.sym}</div>
                    </div>
                    <div style={{ width: 60, display: 'none' }} className="chart-cell">
                      <MiniChart up={coin.up} width={60} height={28} strokeWidth={1} />
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>
                        ${coin.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </div>
                      <div style={{ fontSize: 12, color: coin.up ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600 }}>
                        {coin.up ? '+' : ''}{coin.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History section */}
          {activeSection === 'history' && (
            <div style={{ animation: 'fadeUp .35s ease both' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 24 }}>Transaction History</h2>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                {TXNS.map((tx, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px',
                    borderBottom: i < TXNS.length - 1 ? '1px solid var(--border)' : 'none',
                    flexWrap: 'wrap',
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: tx.type === 'buy' ? 'rgba(0,229,160,0.12)' : tx.type === 'sell' ? 'rgba(255,77,106,0.12)' : 'rgba(0,212,255,0.12)',
                      color: tx.type === 'buy' ? 'var(--accent-green)' : tx.type === 'sell' ? 'var(--accent-red)' : 'var(--accent-cyan)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, flexShrink: 0,
                    }}>{tx.icon}</div>
                    <div style={{ flex: 1, minWidth: 100 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, textTransform: 'capitalize' }}>{tx.type} {tx.sym}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{tx.date}</div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 80 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>{tx.amount}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{tx.usd}</div>
                    </div>
                    <div style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: 'rgba(0,229,160,0.1)', color: 'var(--accent-green)',
                    }}>
                      {tx.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deposit section */}
          {activeSection === 'deposit' && (
            <div style={{ animation: 'fadeUp .35s ease both', maxWidth: 500 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>Deposit Funds</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>Choose your preferred deposit method.</p>

              <div className="deposit-methods">
                {[
                  { icon: '₿', label: 'Crypto Transfer', desc: 'Send BTC, ETH, SOL and more', color: '#f7931a', badge: 'Instant' },
                  { icon: '💳', label: 'Debit / Credit Card', desc: 'Visa, Mastercard accepted', color: '#627eea', badge: 'Fast' },
                  { icon: '🏦', label: 'Bank Transfer (SEPA)', desc: 'EUR transfers, 0 fee', color: '#00aae4', badge: '1-3 days' },
                  { icon: '⚡', label: 'Wire (SWIFT)', desc: 'International wire transfers', color: '#f3ba2f', badge: '2-5 days' },
                ].map(m => (
                  <div key={m.label} className="deposit-method"
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.background = 'rgba(0,212,255,0.04)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${m.color}22`, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{m.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{m.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{m.desc}</div>
                    </div>
                    <div style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(0,212,255,0.1)', color: 'var(--accent-cyan)', flexShrink: 0 }}>{m.badge}</div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>›</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio section */}
          {activeSection === 'portfolio' && (
            <div style={{ animation: 'fadeUp .35s ease both' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 24 }}>My Portfolio</h2>

              <div className="portfolio-grid">
                {portfolioItems.map(coin => (
                  <div key={coin.sym} style={{
                    padding: '20px 22px',
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'border-color .2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-accent)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${coin.color}22`, color: coin.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, flexShrink: 0 }}>{coin.icon}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{coin.sym}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{coin.name}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: coin.up ? 'rgba(0,229,160,0.12)' : 'rgba(255,77,106,0.12)', color: coin.up ? 'var(--accent-green)' : 'var(--accent-red)', flexShrink: 0 }}>
                        {coin.up ? '+' : ''}{coin.change.toFixed(2)}%
                      </div>
                    </div>
                    <MiniChart up={coin.up} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Holdings</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>{coin.amount.toFixed(coin.amount < 1 ? 5 : 2)} {coin.sym}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Value</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>${coin.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
        </div>
      </div>
    </>
  )
}

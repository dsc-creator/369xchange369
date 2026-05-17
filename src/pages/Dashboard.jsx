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

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)', marginTop: 68 }}>

      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        padding: '28px 16px',
        display: 'flex', flexDirection: 'column', gap: 4,
        position: 'sticky', top: 68, height: 'calc(100vh - 68px)',
      }}>
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
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name ?? 'User'}</div>
              <div style={{ fontSize: 10, color: user.kyc === 'verified' ? 'var(--accent-green)' : 'var(--accent-amber)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {user.kyc === 'verified' ? '✓ Verified' : '⏳ KYC Pending'}
              </div>
            </div>
          </div>
        </div>

        {navItems.map(item => (
          item.link
            ? <Link key={item.id} to={item.link} style={{ textDecoration: 'none' }}>
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
                onClick={() => setActiveSection(item.id)}
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
      <main style={{ flex: 1, padding: '32px 40px', overflow: 'auto' }}>

        {/* Overview */}
        {activeSection === 'overview' && (
          <div style={{ animation: 'fadeUp .35s ease both' }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>
                Good day, {user.name?.split(' ')[0] ?? 'Trader'} 👋
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Here's your portfolio at a glance.</p>
            </div>

            {/* Balance card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(0,229,160,0.07) 100%)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-lg)', padding: '32px 36px',
              marginBottom: 24, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Total Portfolio Value</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 44, fontWeight: 700, letterSpacing: '-2px', marginBottom: 8 }}>
                ${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </div>
              <div style={{ display: 'flex', gap: 24 }}>
                <span style={{ fontSize: 13, color: 'var(--accent-green)', fontWeight: 600 }}>▲ +$3,247.20 this month</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>+4.24% vs last month</span>
              </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
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
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-1px', marginBottom: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Holdings table */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Holdings</div>
                <button onClick={() => setActiveSection('portfolio')} style={{ fontSize: 12, color: 'var(--accent-cyan)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  View All →
                </button>
              </div>
              {topAlloc.map((coin, i) => (
                <div key={coin.sym} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 22px',
                  borderBottom: i < topAlloc.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background .15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${coin.color}22`, color: coin.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, flexShrink: 0 }}>{coin.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{coin.sym}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{coin.amount.toFixed(coin.amount < 1 ? 5 : 2)} {coin.sym}</div>
                  </div>
                  <div style={{ width: 60 }}>
                    <MiniChart up={coin.up} width={60} height={28} strokeWidth={1} />
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 100 }}>
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
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 24 }}>Transaction History</h2>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {TXNS.map((tx, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px',
                  borderBottom: i < TXNS.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: tx.type === 'buy' ? 'rgba(0,229,160,0.12)' : tx.type === 'sell' ? 'rgba(255,77,106,0.12)' : 'rgba(0,212,255,0.12)',
                    color: tx.type === 'buy' ? 'var(--accent-green)' : tx.type === 'sell' ? 'var(--accent-red)' : 'var(--accent-cyan)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, flexShrink: 0,
                  }}>{tx.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, textTransform: 'capitalize' }}>{tx.type} {tx.sym}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{tx.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
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
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>Deposit Funds</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>Choose your preferred deposit method.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '₿', label: 'Crypto Transfer', desc: 'Send BTC, ETH, SOL and more', color: '#f7931a', badge: 'Instant' },
                { icon: '💳', label: 'Debit / Credit Card', desc: 'Visa, Mastercard accepted', color: '#627eea', badge: 'Fast' },
                { icon: '🏦', label: 'Bank Transfer (SEPA)', desc: 'EUR transfers, 0 fee', color: '#00aae4', badge: '1-3 days' },
                { icon: '⚡', label: 'Wire (SWIFT)', desc: 'International wire transfers', color: '#f3ba2f', badge: '2-5 days' },
              ].map(m => (
                <div key={m.label} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '18px 20px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer', transition: 'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.background = 'rgba(0,212,255,0.04)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${m.color}22`, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{m.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{m.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{m.desc}</div>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(0,212,255,0.1)', color: 'var(--accent-cyan)' }}>{m.badge}</div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio section */}
        {activeSection === 'portfolio' && (
          <div style={{ animation: 'fadeUp .35s ease both' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 24 }}>My Portfolio</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
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
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${coin.color}22`, color: coin.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>{coin.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{coin.sym}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{coin.name}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: coin.up ? 'rgba(0,229,160,0.12)' : 'rgba(255,77,106,0.12)', color: coin.up ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      {coin.up ? '+' : ''}{coin.change.toFixed(2)}%
                    </div>
                  </div>
                  <MiniChart up={coin.up} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Holdings</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>{coin.amount.toFixed(coin.amount < 1 ? 5 : 3)} {coin.sym}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Value</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>
                        ${coin.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

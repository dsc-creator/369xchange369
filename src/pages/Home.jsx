import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCoins } from '../hooks/useCoins'
import MiniChart from '../components/MiniChart'

const EARN_ASSETS = [
  { sym: 'SOL',  name: 'Solana',   color: '#9945ff', icon: '◎', apy: '7.12%' },
  { sym: 'USDT', name: 'Tether',   color: '#26a17b', icon: '₮', apy: '4.00%' },
  { sym: 'USDC', name: 'USD Coin', color: '#2775ca', icon: 'Ⓒ', apy: '4.00%' },
  { sym: 'ETH',  name: 'Ethereum', color: '#627eea', icon: 'Ξ', apy: '2.00%' },
  { sym: 'ADA',  name: 'Cardano',  color: '#0033ad', icon: '₳', apy: '2.00%' },
  { sym: 'BTC',  name: 'Bitcoin',  color: '#f7931a', icon: '₿', apy: '0.25%' },
]

const STEPS = [
  { n: '01', icon: '👤', title: 'Create Account',  desc: 'Sign up in under 2 minutes with just your email.' },
  { n: '02', icon: '✅', title: 'Verify Identity',  desc: 'Fast AI-powered KYC — most done in under 5 minutes.' },
  { n: '03', icon: '💳', title: 'Deposit Funds',    desc: 'Fund via card, bank transfer, SEPA, SWIFT, or crypto.' },
  { n: '04', icon: '🚀', title: 'Start Trading',    desc: 'Access 300+ markets, earn rewards, or go leveraged.' },
]

export default function Home() {
  const { coins, lastUpdated, loading } = useCoins()
  const [activeTab,  setActiveTab]  = useState('buy')
  const [marketTab,  setMarketTab]  = useState('gainers')
  const [payAmt,     setPayAmt]     = useState('500')
  const [getAmt,     setGetAmt]     = useState('0.004838')
  const [countdown,  setCountdown]  = useState(30)

  const btcPrice = coins.find(c => c.sym === 'BTC')?.price ?? 103_247

  useEffect(() => {
    const id = setInterval(() => setCountdown(c => c <= 1 ? 30 : c - 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (lastUpdated) setCountdown(30)
  }, [lastUpdated])

  const handlePay = (v) => {
    setPayAmt(v)
    setGetAmt(((parseFloat(v) || 0) / btcPrice).toFixed(6))
  }

  const tickerCoins = [...coins, ...coins]

  const displayCoins = marketTab === 'gainers'
    ? [...coins].sort((a, b) => b.change - a.change)
    : marketTab === 'decliners'
    ? [...coins].sort((a, b) => a.change - b.change)
    : [...coins].sort(() => Math.random() - 0.5)

  return (
    <>
      <style>{`
        .home-page { animation: fadeUp .5s ease both; }
        .ticker-track { animation: ticker 45s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }
        .widget-float { animation: floatY 7s ease-in-out infinite; }
        .market-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 20px;
          cursor: pointer;
          transition: transform .2s, border-color .2s, box-shadow .2s;
        }
        .market-card:hover {
          transform: translateY(-3px);
          border-color: var(--border-accent);
          box-shadow: var(--glow-cyan);
        }
        .earn-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 18px;
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .earn-row:hover { border-color: var(--border-accent); background: rgba(0,212,255,0.04); }
        .step-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--border);
          padding: 32px 24px;
          transition: background .2s, border-color .2s;
        }
        .step-card:hover { background: rgba(0,212,255,0.04); border-color: var(--border-accent); }
        .trust-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 32px 24px;
          text-align: center;
          transition: transform .2s, border-color .2s;
        }
        .trust-card:hover { transform: translateY(-3px); border-color: var(--border-accent); }
        .feature-item { transition: transform .2s; }
        .feature-item:hover { transform: translateX(4px); }
        .trade-btn {
          width: 100%; padding: 9px; margin-top: 14px;
          background: var(--bg-base);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--accent-cyan);
          font-family: var(--font-display);
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.5px; text-transform: uppercase;
          cursor: pointer;
          transition: background .2s, border-color .2s;
        }
        .trade-btn:hover { background: rgba(0,212,255,0.08); border-color: rgba(0,212,255,0.4); }
        .widget-cta {
          width: 100%; padding: 15px; margin-top: 14px; border: none;
          background: linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-green) 100%);
          color: var(--bg-base);
          border-radius: var(--radius-sm);
          font-family: var(--font-display);
          font-size: 15px; font-weight: 800;
          cursor: pointer;
          transition: opacity .2s, transform .15s, box-shadow .2s;
        }
        .widget-cta:hover { opacity: .92; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(0,212,255,0.3); }
        .cta-main {
          padding: 16px 44px; border-radius: 999px; border: none;
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-green));
          color: var(--bg-base);
          font-family: var(--font-display); font-size: 15px; font-weight: 800;
          cursor: pointer; text-decoration: none; display: inline-block;
          transition: transform .15s, box-shadow .2s;
        }
        .cta-main:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,212,255,0.35); }
        .cta-outline {
          padding: 16px 44px; border-radius: 999px;
          border: 1px solid var(--border); background: transparent;
          color: var(--text-primary);
          font-family: var(--font-display); font-size: 15px; font-weight: 600;
          cursor: pointer; text-decoration: none; display: inline-block;
          transition: border-color .2s, background .2s;
        }
        .cta-outline:hover { border-color: var(--border-accent); background: rgba(0,212,255,0.06); }
        .footer-link {
          display: block; font-size: 13px; color: var(--text-secondary);
          text-decoration: none; margin-bottom: 10px; transition: color .15s;
        }
        .footer-link:hover { color: var(--text-primary); }
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
          margin: 0 40px;
        }
        .pulse-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent-cyan);
          animation: pulse 2s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>

      <div className="home-page" style={{ paddingTop: 68 }}>

        {/* ── PRICE TICKER ── */}
        <div style={{
          background: 'rgba(8,12,20,0.95)',
          borderBottom: '1px solid var(--border)',
          height: 36, overflow: 'hidden',
          display: 'flex', alignItems: 'center',
        }}>
          <div className="ticker-track" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
            {tickerCoins.map((c, i) => (
              <div key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '0 28px', fontSize: 12, fontWeight: 500,
                borderRight: '1px solid var(--border)',
                fontFamily: 'var(--font-mono)',
              }}>
                <span style={{ color: c.color, fontSize: 14 }}>{c.icon}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{c.sym}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{c.priceStr}</span>
                <span style={{ color: c.up ? 'var(--accent-green)' : 'var(--accent-red)', fontSize: 11 }}>
                  {c.changeStr}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── HERO ── */}
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
          {/* Hero background glow */}
          <div style={{
            position: 'absolute', top: 68, left: '50%', transform: 'translateX(-50%)',
            width: 800, height: 600, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex', alignItems: 'center',
            padding: '100px 0 80px', gap: 60,
            minHeight: 'calc(100vh - 104px)',
            position: 'relative',
          }}>
            {/* Left copy */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', borderRadius: 999,
                background: 'rgba(0,212,255,0.1)',
                border: '1px solid rgba(0,212,255,0.2)',
                fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)',
                marginBottom: 28, letterSpacing: 1, textTransform: 'uppercase',
              }}>
                <span className="pulse-dot" />
                Live on 185+ Countries
              </div>

              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(42px, 5vw, 72px)',
                fontWeight: 800, lineHeight: 1.02,
                letterSpacing: '-3px', marginBottom: 24,
              }}>
                Trade{' '}
                <span style={{
                  background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-green) 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>Crypto</span>
                <br />
                Built for{' '}
                <span style={{ color: 'var(--accent-amber)' }}>2026</span>
              </h1>

              <p style={{
                fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8,
                maxWidth: 460, marginBottom: 44,
              }}>
                369xchange gives you the fastest, most secure platform to buy, sell,
                trade and earn crypto — with up to 20× leverage and real-time markets.
              </p>

              <div style={{ display: 'flex', gap: 16, marginBottom: 56 }}>
                <Link to="/signup" className="cta-main">Start Trading Free →</Link>
                <Link to="/trade" className="cta-outline">Live Markets</Link>
              </div>

              <div style={{ display: 'flex', gap: 48 }}>
                {[['$7.5B+', 'Total Volume'], ['15M+', 'Users'], ['300+', 'Markets']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 700,
                      color: 'var(--text-primary)', letterSpacing: '-1px',
                    }}>{val}</div>
                    <div style={{
                      fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600,
                      marginTop: 4, letterSpacing: 1.5, textTransform: 'uppercase',
                    }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trade Widget */}
            <div className="widget-float" style={{
              flexShrink: 0, width: 400,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 32,
              backdropFilter: 'blur(30px)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6), var(--glow-cyan)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, transparent, var(--accent-cyan), var(--accent-amber), transparent)',
              }} />

              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 22,
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700 }}>
                  Quick Trade
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 11, color: 'var(--accent-green)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  <span className="pulse-dot" style={{ background: 'var(--accent-green)', width: 5, height: 5 }} />
                  LIVE
                </div>
              </div>

              {/* Tabs */}
              <div style={{
                display: 'flex', gap: 4, marginBottom: 22,
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 'var(--radius-sm)', padding: 4,
              }}>
                {['buy', 'sell', 'convert'].map(t => (
                  <button key={t} onClick={() => setActiveTab(t)} style={{
                    flex: 1, padding: '8px 0', borderRadius: 6, border: 'none',
                    background: activeTab === t ? 'var(--bg-base)' : 'transparent',
                    color: activeTab === t ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-display)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    transition: 'all .2s',
                  }}>
                    {t[0].toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {/* You Pay */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginBottom: 8,
              }}>
                <label style={{ display: 'block', fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                  You Pay
                </label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={payAmt}
                    onChange={e => handlePay(e.target.value)}
                    style={{
                      background: 'none', border: 'none', outline: 'none',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700,
                      width: '100%', letterSpacing: '-1px',
                    }}
                  />
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px', background: 'var(--bg-base)',
                    borderRadius: 8, border: '1px solid var(--border)',
                    fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    <span style={{ color: '#26a17b', fontWeight: 800 }}>$</span> USD ▾
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)',
                  color: 'var(--accent-cyan)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, cursor: 'pointer',
                }}>⇅</div>
              </div>

              {/* You Get */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginBottom: 8,
              }}>
                <label style={{ display: 'block', fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                  You Get
                </label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <input readOnly value={getAmt} style={{
                    background: 'none', border: 'none', outline: 'none',
                    color: 'var(--accent-cyan)',
                    fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700,
                    width: '100%', letterSpacing: '-1px',
                  }} />
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px', background: 'var(--bg-base)',
                    borderRadius: 8, border: '1px solid var(--border)',
                    fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    <span style={{ color: '#f7931a', fontWeight: 800 }}>₿</span> BTC ▾
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginTop: 10 }}>
                <span style={{ fontFamily: 'var(--font-mono)' }}>
                  1 BTC ≈ ${btcPrice.toLocaleString()}
                </span>
                <span style={{ color: 'var(--accent-cyan)' }}>↻ {countdown}s</span>
              </div>

              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <button className="widget-cta">
                  {activeTab === 'buy' ? 'Buy Now' : activeTab === 'sell' ? 'Sell Now' : 'Convert Now'} →
                </button>
              </Link>

              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
                Fast KYC · 24/7 Support ·{' '}
                <Link to="/terms" style={{ color: 'var(--accent-cyan)' }}>Terms</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="section-divider" />

        {/* ── MARKETS ── */}
        <section id="markets" style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: 8 }}>
                  Live Markets
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, letterSpacing: '-1.5px', margin: 0 }}>
                  Real-time Prices
                </h2>
              </div>
              <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)', padding: 4 }}>
                {[['gainers', '🚀 Gainers'], ['decliners', '📉 Decliners'], ['trending', '🔥 Trending']].map(([k, l]) => (
                  <button key={k} onClick={() => setMarketTab(k)} style={{
                    padding: '7px 16px', borderRadius: 6,
                    border: marketTab === k ? '1px solid var(--border)' : 'none',
                    background: marketTab === k ? 'var(--bg-elevated)' : 'transparent',
                    color: marketTab === k ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    transition: 'all .2s',
                  }}>{l}</button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{
                    height: 180, borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {displayCoins.map(c => (
                  <div key={c.sym} className="market-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: `${c.color}22`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, flexShrink: 0,
                      }}>
                        <span style={{ color: c.color, fontWeight: 800 }}>{c.icon}</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{c.sym}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.name}</div>
                      </div>
                      <div style={{
                        marginLeft: 'auto', padding: '3px 8px', borderRadius: 20,
                        fontSize: 10, fontWeight: 700,
                        background: c.up ? 'rgba(0,229,160,0.12)' : 'rgba(255,77,106,0.12)',
                        color: c.up ? 'var(--accent-green)' : 'var(--accent-red)',
                      }}>
                        {c.changeStr}
                      </div>
                    </div>

                    <div style={{ margin: '10px 0' }}>
                      <MiniChart up={c.up} />
                    </div>

                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 2 }}>
                      {c.priceStr}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: c.up ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      {c.up ? '▲' : '▼'} {c.changeStr} (24h)
                    </div>

                    <Link to="/trade" style={{ textDecoration: 'none' }}>
                      <button className="trade-btn">Trade {c.sym}</button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="section-divider" />

        {/* ── FEATURES ── */}
        <section style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
              {/* Portfolio preview */}
              <div style={{
                height: 500, borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)', overflow: 'hidden',
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', inset: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 4, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    Portfolio Overview
                  </div>
                  {[
                    { icon: '₿', name: 'Bitcoin',   val: '$52,847.30', color: '#f7931a', chg: '+4.82%' },
                    { icon: 'Ξ', name: 'Ethereum',  val: '$8,241.00',  color: '#627eea', chg: '+3.17%' },
                    { icon: '◎', name: 'Solana',    val: '$3,692.50',  color: '#9945ff', chg: '+6.44%' },
                    { icon: '₮', name: 'USDT',      val: '$15,000.00', color: '#26a17b', chg: '±0.00%' },
                  ].map(r => (
                    <div key={r.name} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px',
                      background: 'var(--bg-base)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                    }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${r.color}22`, color: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{r.icon}</div>
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{r.name}</div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>{r.val}</div>
                        <div style={{ fontSize: 11, color: 'var(--accent-green)' }}>{r.chg}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 'auto', padding: '16px 18px', background: 'rgba(0,212,255,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-accent)' }}>
                    <div style={{ fontSize: 10, color: 'var(--accent-cyan)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Total Balance</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, letterSpacing: '-1px' }}>$79,780.80</div>
                    <div style={{ fontSize: 12, color: 'var(--accent-green)', marginTop: 4 }}>▲ +$3,247.20 this month</div>
                  </div>
                </div>
              </div>

              {/* Features list */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: 12 }}>
                  Why 369xchange
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16 }}>
                  Built different.<br />Built for you.
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.75, marginBottom: 40 }}>
                  Not just another exchange. 369xchange is engineered for the next generation of digital asset traders
                  — with the tools, security and speed that actually matter.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  {[
                    { icon: '🔐', title: 'Bank-Grade Security',     desc: 'PCI DSS Level 1 certified. Multi-sig cold wallets. 2FA everywhere. Your funds are always protected.' },
                    { icon: '⚡', title: 'Lightning Execution',      desc: 'Sub-millisecond order matching with deep liquidity pools. Never miss a trade due to lag.' },
                    { icon: '🌍', title: '185+ Countries Supported', desc: 'Fiat on-ramps for USD, EUR, GBP and more — with SEPA, SWIFT, cards and e-wallets.' },
                    { icon: '📈', title: 'Up to 20× Leverage',       desc: 'Advanced margin trading with isolated and cross-margin modes. Manage risk your way.' },
                  ].map(f => (
                    <div key={f.title} className="feature-item" style={{ display: 'flex', gap: 18 }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                        background: 'rgba(0,212,255,0.1)', border: '1px solid var(--border-accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                      }}>{f.icon}</div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 5 }}>{f.title}</h4>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── STEPS ── */}
        <section style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: 10 }}>Get Started</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 14 }}>
                Up and trading<br />in minutes
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 460, margin: '0 auto' }}>
                No complex setup. Just sign up, verify, deposit and start trading.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {STEPS.map((step, i) => (
                <div key={step.n} className="step-card" style={{
                  borderRadius: i === 0 ? 'var(--radius-md) 0 0 var(--radius-md)' : i === STEPS.length - 1 ? '0 var(--radius-md) var(--radius-md) 0' : 0,
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 52, fontWeight: 700, color: 'rgba(0,212,255,0.12)', lineHeight: 1, marginBottom: 18, letterSpacing: '-3px' }}>{step.n}</div>
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{step.icon}</div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{step.title}</h4>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── EARN ── */}
        <section id="earn" style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
            <div style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 28, padding: 60, overflow: 'hidden', position: 'relative',
            }}>
              <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: 12 }}>Earn Rewards</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16 }}>
                    Put your<br />crypto to work
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>
                    Earn up to 12% annually just by holding supported assets. Flexible staking and fixed savings —
                    pick what fits your strategy.
                  </p>

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                      <button style={{
                        padding: '11px 26px', borderRadius: 999, border: 'none',
                        background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-green))',
                        color: 'var(--bg-base)', fontFamily: 'var(--font-display)',
                        fontSize: 14, fontWeight: 700, cursor: 'pointer',
                      }}>Start Earning →</button>
                    </Link>
                  </div>

                  <div style={{ padding: '16px 20px', background: 'rgba(0,212,255,0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-accent)', display: 'inline-block' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>SOL Estimated Yearly</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, letterSpacing: '-1px' }}>
                      <span style={{ color: 'var(--accent-cyan)' }}>7.12</span> SOL
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>for 100 SOL staked ≈ $1,314/yr</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>Top Earning Assets</div>
                  {EARN_ASSETS.map(a => (
                    <div key={a.sym} className="earn-row">
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${a.color}22`, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>{a.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{a.sym}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.name}</div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--accent-cyan)' }}>
                        {a.apy} <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>APY</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── TRUST ── */}
        <section style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: 10 }}>Trust &amp; Scale</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1 }}>
                Trusted by millions.<br />Proven since 2013.
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 14 }}>
              {[
                { icon: '👥', val: '15M+',  lbl: 'Registered Users Worldwide' },
                { icon: '🌐', val: '185+',  lbl: 'Countries & Territories' },
                { icon: '💰', val: '$7.5B', lbl: 'Total Deposits Processed' },
              ].map(t => (
                <div key={t.lbl} className="trust-card">
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{t.icon}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, letterSpacing: '-2px', color: 'var(--accent-cyan)', marginBottom: 8 }}>{t.val}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{t.lbl}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[
                { icon: '🛡️', title: 'PCI DSS Level 1',   sub: 'Annual security audits' },
                { icon: '📋', title: 'FinCEN Registered',  sub: 'MSB License #1804170' },
                { icon: '🔒', title: 'Cold Storage',       sub: 'Multi-sig protection' },
                { icon: '⚙️', title: '99.99% Uptime',      sub: 'Enterprise SLA' },
              ].map(b => (
                <div key={b.title} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', padding: '18px 16px',
                }}>
                  <div style={{ fontSize: 22 }}>{b.icon}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{b.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── CTA ── */}
        <section style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
            <div style={{
              borderRadius: 28, padding: '80px 60px', textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(0,212,255,0.07) 0%, rgba(245,166,35,0.05) 100%)',
              border: '1px solid var(--border-accent)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 800, letterSpacing: '-2px', marginBottom: 18, position: 'relative' }}>
                Start Trading Today.<br />
                The Future is{' '}
                <span style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Now.</span>
              </h2>
              <p style={{ fontSize: 17, color: 'var(--text-secondary)', marginBottom: 44, position: 'relative' }}>
                Join 15 million traders on the platform built for the next era of digital finance.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', position: 'relative' }}>
                <Link to="/signup" className="cta-main">Create Free Account →</Link>
                <a href="#markets" className="cta-outline">Explore Markets</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', padding: '60px 0 32px' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.5px', marginBottom: 14 }}>
                  <span style={{ color: 'var(--text-primary)' }}>369</span>
                  <span style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>x</span>
                  <span style={{ color: 'var(--text-primary)' }}>change</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 280 }}>
                  Your all-in-one crypto platform to buy, sell, trade, hold and earn — since 2013. Built for everyone, everywhere.
                </p>
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  {['𝕏', 'T', 'f', 'in'].map((icon, i) => (
                    <div key={i} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, cursor: 'pointer' }}>{icon}</div>
                  ))}
                </div>
              </div>

              {[
                { title: 'Products', links: [['Instant Buy', '/trade'], ['Spot Trading', '/trade'], ['Margin Trading', '/trade'], ['Earn & Staking', '/earn'], ['Wallet', '/dashboard']] },
                { title: 'Company',  links: [['About Us', '/'], ['Careers', '/'], ['Press', '/'], ['Blog', '/'], ['Help Center', '/']] },
                { title: 'Markets',  links: [['Bitcoin (BTC)', '/trade'], ['Ethereum (ETH)', '/trade'], ['Solana (SOL)', '/trade'], ['XRP', '/trade'], ['All Prices', '/#markets']] },
              ].map(col => (
                <div key={col.title}>
                  <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, marginBottom: 18, color: 'var(--text-primary)', letterSpacing: 0.5, textTransform: 'uppercase' }}>{col.title}</h5>
                  {col.links.map(([label, to]) => (
                    <Link key={label} to={to} className="footer-link">{label}</Link>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 28, borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>© 369xchange.com 2026 · All rights reserved.</p>
              <div style={{ display: 'flex', gap: 20 }}>
                {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map(label => (
                  <Link key={label} to="/" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>{label}</Link>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}

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
        
        /* Responsive styles */
        .home-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 40px;
        }
        @media (max-width: 768px) {
          .home-container {
            padding: 0 20px;
          }
          .section-divider {
            margin: 0 20px;
          }
        }
        .hero-section {
          display: flex;
          align-items: center;
          padding: 100px 0 80px;
          gap: 60px;
          min-height: calc(100vh - 104px);
          position: relative;
        }
        @media (max-width: 1024px) {
          .hero-section {
            flex-direction: column;
            padding: 60px 0;
            gap: 40px;
            min-height: auto;
          }
        }
        .hero-content {
          flex: 1;
        }
        @media (max-width: 1024px) {
          .hero-content {
            text-align: center;
          }
        }
        .hero-cta-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 56px;
        }
        @media (max-width: 1024px) {
          .hero-cta-buttons {
            justify-content: center;
            margin-bottom: 40px;
          }
        }
        @media (max-width: 480px) {
          .hero-cta-buttons {
            flex-direction: column;
            gap: 12px;
          }
          .cta-main, .cta-outline {
            padding: 14px 32px;
            text-align: center;
            width: 100%;
          }
        }
        .hero-stats {
          display: flex;
          gap: 48px;
        }
        @media (max-width: 1024px) {
          .hero-stats {
            justify-content: center;
          }
        }
        @media (max-width: 480px) {
          .hero-stats {
            gap: 24px;
            flex-wrap: wrap;
          }
        }
        .trade-widget {
          flex-shrink: 0;
          width: 400px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 32px;
          backdrop-filter: blur(30px);
          box-shadow: 0 40px 80px rgba(0,0,0,0.6), var(--glow-cyan);
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 1024px) {
          .trade-widget {
            width: 100%;
            max-width: 420px;
            animation: none !important;
          }
        }
        @media (max-width: 480px) {
          .trade-widget {
            padding: 24px;
          }
        }
        .market-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 1024px) {
          .market-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .market-grid {
            grid-template-columns: 1fr;
          }
        }
        .market-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 36px;
        }
        @media (max-width: 768px) {
          .market-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
        .market-tabs {
          display: flex;
          gap: 4px;
          background: rgba(255,255,255,0.04);
          border-radius: var(--radius-sm);
          padding: 4px;
        }
        @media (max-width: 480px) {
          .market-tabs {
            width: 100%;
          }
          .market-tabs button {
            flex: 1;
            padding: 7px 10px !important;
            font-size: 11px !important;
          }
        }
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
        .portfolio-preview {
          height: 500px;
          border-radius: var(--radius-lg);
          background: var(--bg-surface);
          border: 1px solid var(--border);
          overflow: hidden;
          position: relative;
        }
        @media (max-width: 900px) {
          .portfolio-preview {
            height: 400px;
            order: 1;
          }
          .features-content {
            order: 0;
          }
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
        }
        @media (max-width: 900px) {
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .steps-grid {
            grid-template-columns: 1fr;
          }
          .step-card {
            border-radius: var(--radius-sm) !important;
          }
        }
        .earn-section-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .earn-section-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
        .earn-cta-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }
        .trust-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 14px;
        }
        @media (max-width: 768px) {
          .trust-stats-grid {
            grid-template-columns: 1fr;
          }
        }
        .trust-badges-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        @media (max-width: 900px) {
          .trust-badges-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .trust-badges-grid {
            grid-template-columns: 1fr;
          }
        }
        .final-cta {
          border-radius: 28px;
          padding: 80px 60px;
          text-align: center;
          background: linear-gradient(135deg, rgba(0,212,255,0.07) 0%, rgba(245,166,35,0.05) 100%);
          border: 1px solid var(--border-accent);
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .final-cta {
            padding: 60px 24px;
            border-radius: 20px;
          }
          .final-cta h2 {
            font-size: 36px !important;
          }
        }
        @media (max-width: 480px) {
          .final-cta {
            padding: 48px 20px;
          }
          .final-cta h2 {
            font-size: 28px !important;
          }
        }
        .final-cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          position: relative;
        }
        @media (max-width: 480px) {
          .final-cta-buttons {
            flex-direction: column;
            gap: 12px;
          }
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 48px;
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }
        @media (max-width: 768px) {
          .footer-bottom {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }
        .footer-socials {
          display: flex;
          gap: 12px;
        }
        .earn-section-wrapper {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 60px;
          overflow: hidden;
          position: relative;
        }
        @media (max-width: 768px) {
          .earn-section-wrapper {
            padding: 32px 20px;
            border-radius: 20px;
          }
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
        <div className="home-container">
          {/* Hero background glow */}
          <div style={{
            position: 'absolute', top: 68, left: '50%', transform: 'translateX(-50%)',
            width: 800, height: 600, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div className="hero-section">
            {/* Left copy */}
            <div className="hero-content">
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
                fontSize: 'clamp(36px, 5vw, 72px)',
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
                trade and earn crypto — with up to 20x leverage and real-time markets.
              </p>

              <div className="hero-cta-buttons">
                <Link to="/signup" className="cta-main">Start Trading Free</Link>
                <Link to="/trade" className="cta-outline">Live Markets</Link>
              </div>

              <div className="hero-stats">
                {[['$7.5B+', 'Total Volume'], ['15M+', 'Users'], ['300+', 'Markets']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700,
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
            <div className="trade-widget widget-float">
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <input
                    type="number"
                    value={payAmt}
                    onChange={e => handlePay(e.target.value)}
                    style={{
                      background: 'none', border: 'none', outline: 'none',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)', fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 700,
                      width: '100%', letterSpacing: '-1px', minWidth: 0,
                    }}
                  />
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px', background: 'var(--bg-base)',
                    borderRadius: 8, border: '1px solid var(--border)',
                    fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    <span style={{ color: '#26a17b', fontWeight: 800 }}>$</span> USD
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <input readOnly value={getAmt} style={{
                    background: 'none', border: 'none', outline: 'none',
                    color: 'var(--accent-cyan)',
                    fontFamily: 'var(--font-mono)', fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 700,
                    width: '100%', letterSpacing: '-1px', minWidth: 0,
                  }} />
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px', background: 'var(--bg-base)',
                    borderRadius: 8, border: '1px solid var(--border)',
                    fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    <span style={{ color: '#f7931a', fontWeight: 800 }}>₿</span> BTC
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginTop: 10, flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)' }}>
                  1 BTC ≈ ${btcPrice.toLocaleString()}
                </span>
                <span style={{ color: 'var(--accent-cyan)' }}>↻ {countdown}s</span>
              </div>

              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <button className="widget-cta">
                  {activeTab === 'buy' ? 'Buy Now' : activeTab === 'sell' ? 'Sell Now' : 'Convert Now'}
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
          <div className="home-container">
            <div className="market-header">
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: 8 }}>
                  Live Markets
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-1.5px', margin: 0 }}>
                  Real-time Prices
                </h2>
              </div>
              <div className="market-tabs">
                {[['gainers', '🚀 Gainers'], ['decliners', '📉 Decliners'], ['trending', '🔥 Trending']].map(([k, l]) => (
                  <button key={k} onClick={() => setMarketTab(k)} style={{
                    padding: '7px 16px', borderRadius: 6,
                    border: marketTab === k ? '1px solid var(--border)' : 'none',
                    background: marketTab === k ? 'var(--bg-elevated)' : 'transparent',
                    color: marketTab === k ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', transition: 'all .2s',
                  }}>{l}</button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="market-grid">
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
              <div className="market-grid">
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
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{c.sym}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                      </div>
                      <div style={{
                        padding: '3px 8px', borderRadius: 20,
                        fontSize: 10, fontWeight: 700, flexShrink: 0,
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
          <div className="home-container">
            <div className="features-grid">
              {/* Portfolio preview */}
              <div className="portfolio-preview">
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
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${r.color}22`, color: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{r.icon}</div>
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 500, minWidth: 0 }}>{r.name}</div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>{r.val}</div>
                        <div style={{ fontSize: 11, color: 'var(--accent-green)' }}>{r.chg}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 'auto', padding: '16px 18px', background: 'rgba(0,212,255,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-accent)' }}>
                    <div style={{ fontSize: 10, color: 'var(--accent-cyan)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Total Balance</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 700, letterSpacing: '-1px' }}>$79,780.80</div>
                    <div style={{ fontSize: 12, color: 'var(--accent-green)', marginTop: 4 }}>▲ +$3,247.20 this month</div>
                  </div>
                </div>
              </div>

              {/* Features list */}
              <div className="features-content">
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: 12 }}>
                  Why 369xchange
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16 }}>
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
                    { icon: '📈', title: 'Up to 20x Leverage',       desc: 'Advanced margin trading with isolated and cross-margin modes. Manage risk your way.' },
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
          <div className="home-container">
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: 10 }}>Get Started</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 14 }}>
                Up and trading<br />in minutes
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 460, margin: '0 auto' }}>
                No complex setup. Just sign up, verify, deposit and start trading.
              </p>
            </div>

            <div className="steps-grid">
              {STEPS.map((step, i) => (
                <div key={step.n} className="step-card" style={{
                  borderRadius: i === 0 ? 'var(--radius-md) 0 0 var(--radius-md)' : i === STEPS.length - 1 ? '0 var(--radius-md) var(--radius-md) 0' : 0,
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 700, color: 'rgba(0,212,255,0.12)', lineHeight: 1, marginBottom: 18, letterSpacing: '-3px' }}>{step.n}</div>
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
          <div className="home-container">
            <div className="earn-section-wrapper">
              <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

              <div className="earn-section-grid">
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: 12 }}>Earn Rewards</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16 }}>
                    Put your<br />crypto to work
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>
                    Earn up to 12% annually just by holding supported assets. Flexible staking and fixed savings —
                    pick what fits your strategy.
                  </p>

                  <div className="earn-cta-buttons">
                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                      <button style={{
                        padding: '11px 26px', borderRadius: 999, border: 'none',
                        background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-green))',
                        color: 'var(--bg-base)', fontFamily: 'var(--font-display)',
                        fontSize: 14, fontWeight: 700, cursor: 'pointer',
                      }}>Start Earning</button>
                    </Link>
                  </div>

                  <div style={{ padding: '16px 20px', background: 'rgba(0,212,255,0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-accent)', display: 'inline-block' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>SOL Estimated Yearly</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, letterSpacing: '-1px' }}>
                      <span style={{ color: 'var(--accent-cyan)' }}>7.12</span> SOL
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>for 100 SOL staked ≈ $1,314/yr</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>Top Earning Assets</div>
                  {EARN_ASSETS.map(a => (
                    <div key={a.sym} className="earn-row">
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${a.color}22`, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, flexShrink: 0 }}>{a.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{a.sym}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.name}</div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--accent-cyan)', flexShrink: 0 }}>
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
          <div className="home-container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: 10 }}>Trust &amp; Scale</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1 }}>
                Trusted by millions.<br />Proven since 2013.
              </h2>
            </div>

            <div className="trust-stats-grid">
              {[
                { icon: '👥', val: '15M+',  lbl: 'Registered Users Worldwide' },
                { icon: '🌐', val: '185+',  lbl: 'Countries & Territories' },
                { icon: '💰', val: '$7.5B', lbl: 'Total Deposits Processed' },
              ].map(t => (
                <div key={t.lbl} className="trust-card">
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{t.icon}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(32px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-2px', color: 'var(--accent-cyan)', marginBottom: 8 }}>{t.val}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{t.lbl}</div>
                </div>
              ))}
            </div>

            <div className="trust-badges-grid">
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
                  <div style={{ fontSize: 22, flexShrink: 0 }}>{b.icon}</div>
                  <div style={{ minWidth: 0 }}>
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
          <div className="home-container">
            <div className="final-cta">
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-2px', marginBottom: 18, position: 'relative' }}>
                Start Trading Today.<br />
                The Future is{' '}
                <span style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Now.</span>
              </h2>
              <p style={{ fontSize: 17, color: 'var(--text-secondary)', marginBottom: 44, position: 'relative' }}>
                Join 15 million traders on the platform built for the next era of digital finance.
              </p>
              <div className="final-cta-buttons">
                <Link to="/signup" className="cta-main">Create Free Account</Link>
                <a href="#markets" className="cta-outline">Explore Markets</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', padding: '60px 0 32px' }}>
          <div className="home-container">
            <div className="footer-grid">
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.5px', marginBottom: 14 }}>
                  <span style={{ color: 'var(--text-primary)' }}>369</span>
                  <span style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>x</span>
                  <span style={{ color: 'var(--text-primary)' }}>change</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 280 }}>
                  The next-generation crypto exchange trusted by millions worldwide.
                </p>
              </div>
              {[
                { title: 'Products', links: ['Spot Trading', 'Margin Trading', 'Earn', 'Launchpad'] },
                { title: 'Company', links: ['About', 'Careers', 'Press', 'Blog'] },
                { title: 'Support', links: ['Help Center', 'API Docs', 'Status', 'Contact'] },
              ].map(col => (
                <div key={col.title}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, letterSpacing: 0.5, textTransform: 'uppercase' }}>{col.title}</div>
                  {col.links.map(link => (
                    <a key={link} href="#" className="footer-link">{link}</a>
                  ))}
                </div>
              ))}
            </div>

            <div className="footer-bottom">
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                &copy; 2026 369xchange. All rights reserved.
              </div>
              <div className="footer-socials">
                {['𝕏', 'in', '📱', '💬'].map((icon, i) => (
                  <a key={i} href="#" style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}>{icon}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

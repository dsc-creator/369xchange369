import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCoins } from '../hooks/useCoins'
import MiniChart from '../components/MiniChart'

const ORDER_BOOK_ASKS = [
  { price: 103680, size: 0.824, total: 85432 },
  { price: 103620, size: 1.231, total: 127374 },
  { price: 103580, size: 0.445, total: 46043 },
  { price: 103540, size: 2.100, total: 217434 },
  { price: 103510, size: 0.672, total: 69558 },
]
const ORDER_BOOK_BIDS = [
  { price: 103490, size: 1.540, total: 159374 },
  { price: 103460, size: 0.923, total: 95481 },
  { price: 103420, size: 3.210, total: 332128 },
  { price: 103390, size: 0.811, total: 83849 },
  { price: 103350, size: 1.620, total: 167427 },
]

export default function Trade() {
  const { coins, lastUpdated } = useCoins()
  const [selectedCoin, setSelectedCoin] = useState('BTC')
  const [orderType,    setOrderType]    = useState('market')
  const [side,         setSide]         = useState('buy')
  const [amount,       setAmount]       = useState('')
  const [price,        setPrice]        = useState('')
  const [marketsOpen,  setMarketsOpen]  = useState(false)
  const [orderPanelOpen, setOrderPanelOpen] = useState(false)

  const coin    = coins.find(c => c.sym === selectedCoin) ?? coins[0]
  const usdVal  = parseFloat(amount || 0) * (coin?.price ?? 0)

  return (
    <>
      <style>{`
        .trade-layout {
          margin-top: 68px;
          display: flex;
          height: calc(100vh - 68px);
        }
        @media (max-width: 1024px) {
          .trade-layout {
            flex-direction: column;
            height: auto;
            min-height: calc(100vh - 68px);
          }
        }
        .markets-sidebar {
          width: 220px;
          flex-shrink: 0;
          background: var(--bg-surface);
          border-right: 1px solid var(--border);
          overflow: auto;
        }
        @media (max-width: 1024px) {
          .markets-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid var(--border);
            max-height: none;
            overflow: visible;
          }
          .markets-sidebar.closed .markets-list {
            display: none;
          }
        }
        .markets-toggle {
          display: none;
          width: 100%;
          padding: 14px 20px;
          background: var(--bg-surface);
          border: none;
          border-bottom: 1px solid var(--border);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
        }
        @media (max-width: 1024px) {
          .markets-toggle {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
        .markets-list {
          padding: 0;
        }
        @media (max-width: 1024px) {
          .markets-list {
            display: flex;
            overflow-x: auto;
            padding: 0 16px 16px;
            gap: 8px;
            -webkit-overflow-scrolling: touch;
          }
          .markets-list::-webkit-scrollbar {
            display: none;
          }
        }
        .market-item {
          padding: 12px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.15s;
        }
        @media (max-width: 1024px) {
          .market-item {
            flex-shrink: 0;
            padding: 10px 14px;
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            background: rgba(255,255,255,0.02);
          }
        }
        .trade-center {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        @media (max-width: 1024px) {
          .trade-center {
            overflow: visible;
          }
        }
        .trade-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 20px;
          background: var(--bg-surface);
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .trade-header {
            padding: 16px 20px;
            gap: 16px;
          }
        }
        .trade-header-stats {
          margin-left: auto;
          display: flex;
          gap: 24px;
        }
        @media (max-width: 768px) {
          .trade-header-stats {
            margin-left: 0;
            width: 100%;
            gap: 16px;
            justify-content: space-between;
          }
        }
        .chart-area {
          flex: 1;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow: auto;
        }
        @media (max-width: 768px) {
          .chart-area {
            padding: 16px;
            gap: 16px;
          }
        }
        .chart-container {
          flex: 1;
          min-height: 240px;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 768px) {
          .chart-container {
            min-height: 200px;
            padding: 16px;
          }
        }
        .order-book-container {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 20px;
        }
        @media (max-width: 768px) {
          .order-book-container {
            padding: 16px;
          }
        }
        .order-book-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 600px) {
          .order-book-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
        .order-panel {
          width: 300px;
          flex-shrink: 0;
          background: var(--bg-surface);
          border-left: 1px solid var(--border);
          padding: 20px;
          overflow: auto;
        }
        @media (max-width: 1024px) {
          .order-panel {
            width: 100%;
            border-left: none;
            border-top: 1px solid var(--border);
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            max-height: 70vh;
            transform: translateY(calc(100% - 60px));
            transition: transform 0.3s ease;
            z-index: 100;
          }
          .order-panel.open {
            transform: translateY(0);
          }
        }
        .order-panel-toggle {
          display: none;
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-green));
          color: var(--bg-base);
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
          text-align: center;
          margin-bottom: 16px;
        }
        @media (max-width: 1024px) {
          .order-panel-toggle {
            display: block;
          }
        }
        .order-panel-content {
          display: block;
        }
        @media (max-width: 1024px) {
          .order-panel-content {
            max-height: calc(70vh - 60px);
            overflow-y: auto;
            padding-bottom: 20px;
          }
        }
        .quick-amounts {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="trade-layout">
        {/* Left: coin list */}
        <aside className={`markets-sidebar ${marketsOpen ? '' : 'closed'}`}>
          <button 
            className="markets-toggle" 
            onClick={() => setMarketsOpen(!marketsOpen)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: coin?.color }}>{coin?.icon}</span>
              {selectedCoin}/USD
            </span>
            <span>{marketsOpen ? '▲' : '▼'}</span>
          </button>
          <div style={{ padding: '16px 16px 8px', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }} className="markets-list-header">Markets</div>
          <div className="markets-list">
            {coins.map(c => (
              <div key={c.sym}
                onClick={() => { setSelectedCoin(c.sym); setMarketsOpen(false); }}
                className="market-item"
                style={{
                  background: selectedCoin === c.sym ? 'rgba(0,212,255,0.06)' : 'transparent',
                  borderLeft: selectedCoin === c.sym ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                }}
                onMouseEnter={e => { if (selectedCoin !== c.sym) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { if (selectedCoin !== c.sym) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ color: c.color, fontSize: 16 }}>{c.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.sym}</div>
                  <div style={{ fontSize: 11, color: c.up ? 'var(--accent-green)' : 'var(--accent-red)' }}>{c.changeStr}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                  {c.priceStr}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center: chart + order book */}
        <div className="trade-center">
          {/* Header */}
          <div className="trade-header">
            {coin && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: coin.color, fontSize: 22 }}>{coin.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>{coin.sym}/USD</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{coin.name}</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(18px, 3vw, 22px)', fontWeight: 700 }}>{coin.priceStr}</div>
                  <div style={{ fontSize: 12, color: coin.up ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600 }}>
                    {coin.up ? '▲' : '▼'} {coin.changeStr} (24h)
                  </div>
                </div>
                <div className="trade-header-stats">
                  {[['24h High', '$' + (coin.price * 1.035).toLocaleString('en-US', { maximumFractionDigits: 0 })],
                    ['24h Low',  '$' + (coin.price * 0.964).toLocaleString('en-US', { maximumFractionDigits: 0 })],
                    ['Volume',   coin.volume ?? '–'],
                  ].map(([lbl, val]) => (
                    <div key={lbl}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>{lbl}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, marginTop: 2 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Chart area */}
          <div className="chart-area">
            <div className="chart-container">
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 12 }}>Price Chart — 24h</div>
              <div style={{ flex: 1 }}>
                {coin && <MiniChart up={coin.up} width={800} height={200} strokeWidth={2} />}
              </div>
            </div>

            {/* Order book */}
            <div className="order-book-container">
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 12 }}>Order Book</div>
              <div className="order-book-grid">
                {/* Asks */}
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>
                    <span>Price (USD)</span><span>Size (BTC)</span><span>Total</span>
                  </div>
                  {ORDER_BOOK_ASKS.map((r, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '4px 0', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      <span style={{ color: 'var(--accent-red)' }}>{r.price.toLocaleString()}</span>
                      <span>{r.size.toFixed(3)}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>${r.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                {/* Bids */}
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>
                    <span>Price (USD)</span><span>Size (BTC)</span><span>Total</span>
                  </div>
                  {ORDER_BOOK_BIDS.map((r, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '4px 0', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      <span style={{ color: 'var(--accent-green)' }}>{r.price.toLocaleString()}</span>
                      <span>{r.size.toFixed(3)}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>${r.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: order panel */}
        <aside className={`order-panel ${orderPanelOpen ? 'open' : ''}`}>
          <button 
            className="order-panel-toggle"
            onClick={() => setOrderPanelOpen(!orderPanelOpen)}
          >
            {orderPanelOpen ? 'Close Order Panel ▼' : `Place Order ▲`}
          </button>
          
          <div className="order-panel-content">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Place Order</div>

            {/* Buy/Sell */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)', padding: 4 }}>
              {['buy', 'sell'].map(s => (
                <button key={s} onClick={() => setSide(s)} style={{
                  padding: '9px', borderRadius: 6, border: 'none',
                  background: side === s
                    ? s === 'buy' ? 'rgba(0,229,160,0.2)' : 'rgba(255,77,106,0.2)'
                    : 'transparent',
                  color: side === s
                    ? s === 'buy' ? 'var(--accent-green)' : 'var(--accent-red)'
                    : 'var(--text-secondary)',
                  fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', textTransform: 'capitalize', transition: 'all .15s',
                }}>{s}</button>
              ))}
            </div>

            {/* Order type */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {['market', 'limit', 'stop'].map(t => (
                <button key={t} onClick={() => setOrderType(t)} style={{
                  flex: 1, padding: '6px', borderRadius: 6,
                  border: orderType === t ? '1px solid var(--border-accent)' : '1px solid var(--border)',
                  background: orderType === t ? 'rgba(0,212,255,0.08)' : 'transparent',
                  color: orderType === t ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', textTransform: 'capitalize', transition: 'all .15s',
                }}>{t}</button>
              ))}
            </div>

            {/* Amount */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Amount ({selectedCoin})
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)', fontSize: 15,
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-cyan)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              {amount && (
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                  ≈ ${usdVal.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD
                </div>
              )}
            </div>

            {/* Limit price */}
            {orderType === 'limit' && (
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  Limit Price (USD)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder={coin?.price?.toFixed(0) ?? '0'}
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)', fontSize: 15,
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-cyan)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            )}

            {/* Quick amounts */}
            <div className="quick-amounts">
              {['25%', '50%', '75%', '100%'].map(pct => (
                <button key={pct} style={{
                  padding: '6px', borderRadius: 6,
                  border: '1px solid var(--border)', background: 'transparent',
                  color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', transition: 'all .15s',
                  fontFamily: 'var(--font-display)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--accent-cyan)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                >{pct}</button>
              ))}
            </div>

            {/* Summary */}
            {amount && (
              <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: 14, fontSize: 12 }}>
                {[
                  ['Price',     orderType === 'market' ? 'Market' : `$${price || coin?.price?.toFixed(0)}`],
                  ['Fee (0.1%)', '$' + (usdVal * 0.001).toFixed(2)],
                  ['Total',     '$' + (usdVal * 1.001).toFixed(2)],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%', padding: '14px', border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: side === 'buy'
                  ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-green))'
                  : 'linear-gradient(135deg, #ff4d6a, #ff8c42)',
                color: 'var(--bg-base)',
                fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800,
                cursor: 'pointer', transition: 'opacity .2s',
              }}>
                {side === 'buy' ? `Buy ${selectedCoin}` : `Sell ${selectedCoin}`}
              </button>
            </Link>

            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>
              <Link to="/signup" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>Create account</Link> to place live orders
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}

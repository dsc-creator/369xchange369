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

  const coin    = coins.find(c => c.sym === selectedCoin) ?? coins[0]
  const usdVal  = parseFloat(amount || 0) * (coin?.price ?? 0)

  return (
    <div style={{ marginTop: 68, display: 'flex', height: 'calc(100vh - 68px)' }}>

      {/* Left: coin list */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        overflow: 'auto',
      }}>
        <div style={{ padding: '16px 16px 8px', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Markets</div>
        {coins.map(c => (
          <div key={c.sym}
            onClick={() => setSelectedCoin(c.sym)}
            style={{
              padding: '12px 16px', cursor: 'pointer',
              background: selectedCoin === c.sym ? 'rgba(0,212,255,0.06)' : 'transparent',
              borderLeft: selectedCoin === c.sym ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              transition: 'all .15s',
              display: 'flex', alignItems: 'center', gap: 10,
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
      </aside>

      {/* Center: chart + order book */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 20,
          background: 'var(--bg-surface)',
        }}>
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
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700 }}>{coin.priceStr}</div>
                <div style={{ fontSize: 12, color: coin.up ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600 }}>
                  {coin.up ? '▲' : '▼'} {coin.changeStr} (24h)
                </div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 24 }}>
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
        <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto' }}>
          <div style={{
            flex: 1, minHeight: 240,
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: 20,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 12 }}>Price Chart — 24h</div>
            <div style={{ flex: 1 }}>
              {coin && <MiniChart up={coin.up} width={800} height={200} strokeWidth={2} />}
            </div>
          </div>

          {/* Order book */}
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: 20,
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 12 }}>Order Book</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
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
      <aside style={{
        width: 300, flexShrink: 0,
        background: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border)',
        padding: 20, overflow: 'auto',
      }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 20 }}>
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
      </aside>
    </div>
  )
}

# 369xchange

A modern crypto exchange platform built with **React 19 + Vite 6**.

## Requirements

- **Node.js v20 or higher** (v20 LTS recommended — download at https://nodejs.org)
- npm v10+

> ⚠️ If you're on Node.js v25 and get an `EFTYPE` esbuild error, make sure
> you deleted `node_modules` and ran `npm install` fresh after upgrading.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (opens at http://localhost:5173)
npm run dev
```

## Demo Login

Use these credentials on the `/login` page to explore the dashboard:

- **Email:** `demo@369xchange.com`
- **Password:** `demo1234`

Or click the blue hint banner on the login page to autofill.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with live crypto prices |
| `/login` | Login page |
| `/signup` | Registration |
| `/dashboard` | User dashboard with portfolio |
| `/trade` | Trading terminal |

## Tech Stack

- React 19
- Vite 6
- React Router 7
- CoinGecko API (live prices, no key needed)

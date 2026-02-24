# StockPulse 📈

> AI-powered stock market dashboard — AdaL Vibecoding Bootcamp Capstone

Live: [stockpulse.vercel.app](https://stockpulse.vercel.app) &nbsp;|&nbsp; Repo: [github.com/abhivicks22/stockpulse](https://github.com/abhivicks22/stockpulse)

---

## Features

- 🔐 **GitHub OAuth** via Supabase Auth
- 📊 **Interactive Charts** — Candlestick / Line / Area (TradingView Lightweight Charts v5)
- 🤖 **AI Sentiment Analysis** — Bullish / Bearish / Neutral scoring per stock
- ⭐ **Smart Watchlist** — Add up to 20 stocks with live prices and sentiment badges
- 🔍 **Fuzzy Stock Search** — 300ms debounced search across 13+ symbols
- 🌙 **Dark Theme** — Native dark UI with glassmorphic components
- 📱 **Responsive** — Mobile-first with Sheet sidebar navigation

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Charts | TradingView Lightweight Charts v5 |
| Auth | Supabase Auth (GitHub OAuth) |
| Database | Supabase PostgreSQL + Prisma v5 ORM |
| Animations | Framer Motion |
| Icons | Lucide React |
| Data | Alpha Vantage + Finnhub (with mock fallback) |

## Getting Started

```bash
git clone https://github.com/abhivicks22/stockpulse.git
cd stockpulse
npm install
cp .env.local.example .env.local  # fill in your keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anon key
DATABASE_URL=                     # Postgres connection string
DIRECT_URL=                       # Direct Postgres URL (for migrations)
ALPHA_VANTAGE_API_KEY=            # alphavantage.co (free tier)
FINNHUB_API_KEY=                  # finnhub.io (free tier)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> The app works fully with **mock data** if no API keys are provided.

## Project Structure

```
src/
├── app/
│   ├── api/stocks/          # Quote, OHLCV, sentiment, search
│   ├── api/watchlist/       # Watchlist CRUD
│   ├── dashboard/           # Protected pages
│   │   ├── chart/[symbol]/  # Full chart view
│   │   ├── watchlist/       # Watchlist manager
│   │   ├── alerts/          # Price alerts (coming soon)
│   │   └── settings/        # User settings
│   ├── sign-in/ sign-up/    # Auth pages
│   └── page.tsx             # Landing page
├── components/
│   ├── charts/              # PriceChart + ChartContainer
│   ├── dashboard/           # Sidebar, Header, WatchlistTable, SentimentBadge
│   └── landing/             # Navbar, Hero, Features, etc.
├── lib/
│   ├── mock-data.ts         # Seeded OHLCV + quote generators
│   ├── prisma.ts            # Prisma singleton
│   └── supabase/            # Client + server Supabase helpers
└── types/index.ts           # Shared TypeScript interfaces
```

## Deployment

Deploy with one click on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/abhivicks22/stockpulse)

Set all environment variables in your Vercel project dashboard.

---

Built for the **AdaL Vibecoding Bootcamp** Capstone &nbsp;•&nbsp; Powered by [TradingView Lightweight Charts™](https://tradingview.com)

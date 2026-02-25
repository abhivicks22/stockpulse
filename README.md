# StockPulse 📈

> AI-powered stock market dashboard — AdaL Vibecoding Bootcamp Capstone

Live: [stockpulse.vercel.app](https://stockpulse.vercel.app) &nbsp;|&nbsp; Repo: [github.com/abhivicks22/stockpulse](https://github.com/abhivicks22/stockpulse)

---

## 📖 Capstone Documentation

### The Problem
Traditional retail trading platforms suffer from two major flaws:
1. **Information Overload:** Legacy dashboards bombard users with thousands of metrics, ads, and cluttered UI, making it difficult to find actionable insights.
2. **Emotional Trading:** Retail investors often trade based on hype rather than data because they lack a quick, objective way to gauge market sentiment.

### Our Solution (Value Proposition)
StockPulse is a premium, distraction-free market dashboard that combines institutional-grade charting with AI-driven sentiment analysis. 
- **Professional-Grade Visuals:** We stripped away the noise, providing clean, highly-performant TradingView charts in a modern glassmorphic interface.
- **Live AI Sentiment Analysis:** Instead of reading 15 news articles, our AI instantly digests market news and tags stocks as **Bullish**, **Bearish**, or **Neutral**—providing an instant pulse check to prevent emotional trading.
- **Fuzzy Search & Sync:** Lightning-fast stock discovery and persistent Postgres-backed watchlists ensure a seamless experience across all devices.

### Challenges & Issues Addressed
During development, we tackled several complex technical hurdles:
- **WebGL Performance in Next.js:** Integrating React Three Fiber (for the 3D hero background) with Next.js Server Components caused hydration mismatches. We solved this by creating a dynamically imported, pure-client `UniverseExperience` wrapper.
- **Data API Rate Limiting:** Free financial APIs (like AlphaVantage) heavily restrict API calls. We designed a robust fallback mechanism using intelligent caching and seeded mock data, ensuring the dashboard always loads instantly during demos.
- **OAuth Callbacks:** Deploying to Vercel initially broke our Supabase GitHub OAuth callback due to hardcoded localhost URLs. We successfully isolated and reconfigured the auth environment variables for production.

### Future Enhancements
Looking forward, we plan to extend StockPulse with:
1. **Real-time Price Alerts:** Allow users to set SMS/Email alerts when a stock crosses a specific price threshold or when AI sentiment dramatically shifts.
2. **Portfolio Tracking:** Beyond a simple watchlist, let users input their holdings to calculate live P&L (Profit & Loss) alongside the sentiment analysis.
3. **Alternative Auth Providers:** Implementing Google, Discord, and Apple OAuth options to reduce friction during onboarding.

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

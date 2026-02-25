# StockPulse 📈

> **Zero Compromise. Zero Latency. Zero Dollars.**
> Your AI-powered stock market dashboard, built for the AdaL Vibecoding Bootcamp Capstone.

Live: [stockpulse.vercel.app](https://stockpulse-three.vercel.app/) &nbsp;|&nbsp; Repo: [github.com/abhivicks22/stockpulse](https://github.com/abhivicks22/stockpulse)

---

## 💡 The Problem

Traditional retail trading platforms suffer from massive flaws that put retail investors at a severe disadvantage to institutional traders:
1. **Information Overload & Paywalls:** Legacy brokerages charge $30+/month for basic Level II market data and clutter your screen with thousands of useless metrics, confusing menus, and intrusive ads.
2. **Emotional Trading:** Without access to instant, quantitative analysis of market news, retail investors often trade based on hype or fear rather than objective data.
3. **Sluggish Performance:** Finding a ticker should take milliseconds, but outdated platforms are notoriously slow and clunky.

## ✨ The Solution: The StockPulse Edge

StockPulse is a premium, distraction-free market intelligence platform designed exclusively to level the playing field. We combined **institutional-grade charting** with a **real-time AI sentiment engine**—all wrapped in a beautiful, lightning-fast glassmorphic UI.

- **Zero-Latency Professional Charting:** Built on top of the exact same lightweight rendering engine used by TradingView. Experience 60FPS fluid zooms, pans, and indicator layers straight in your browser.
- **AI-Native Sentiment Engine:** We didn't bolt an AI chatbot on as an afterthought. StockPulse instantly digests thousands of news sources and analysts, tagging every ticker as **Bullish**, **Bearish**, or **Neutral** before you even place a trade.
- **Fuzzy Search & Infinite Tracking:** Instantly find any global equity with our 300ms debounced search engine (even if you spell it wrong), and organize your strategies with unlimited, syncable Watchlists.
- **100% Free Forever:** Get the institutional edge without paying subscription fees. No ads, no tracking, no nonsense.

---

## 🚀 Key Features

- **Seamless Authentication:** Secure login using GitHub or Google via Supabase OAuth.
- **Interactive Technical Analysis:** Candlestick, Line, and Area charts powered by TradingView Lightweight Charts v5.
- **AI Market Sentiment Data:** Instant "at-a-glance" pulse checks for every stock.
- **Real-Time Market Array:** Track broader market health (S&P 500, NASDAQ, Crypto) via the live dashboard header.
- **Smart Watchlists:** Postgres-backed, instant-sync watchlists available across all your desktop and mobile devices.
- **Cinematic 3D Landing Page:** Immersive WebGL React Three Fiber space flight experience to introduce the platform's vision.
- **Dark-Mode Native:** Highly polished, mobile-responsive glassmorphism design.

## 🛠️ Tech Stack

Engineered for zero latency using modern web standards:

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Components) |
| **Styling**   | Tailwind CSS v4 + Framer Motion |
| **3D Rendering** | React Three Fiber + Drei + WebGL |
| **Charting**  | TradingView Lightweight Charts v5 |
| **Database**  | Neon Serverless Postgres + Prisma v5 ORM |
| **Auth**      | Supabase Auth (GitHub & Google OAuth) |
| **APIs**      | Alpha Vantage + Finnhub (w/ Intelligent Caching & Fallbacks) |

## 💻 Getting Started

You can run StockPulse locally in minutes. The app is engineered to work flawlessly using **mock seeded data** even if you don't provide active financial API keys!

```bash
# 1. Clone the repository
git clone https://github.com/abhivicks22/stockpulse.git
cd stockpulse

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local  

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application running.

### Environment Setup

Add these to your `.env.local`:

```env
# Required for Authentication and Database via Supabase
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
DATABASE_URL=YOUR_POSTGRES_CONNECTION_STRING
DIRECT_URL=YOUR_DIRECT_POSTGRES_URL_FOR_MIGRATIONS

# Optional: Real Market Data (Falls back to local mock data if empty)
ALPHA_VANTAGE_API_KEY=YOUR_ALPHA_VANTAGE_KEY
FINNHUB_API_KEY=YOUR_FINNHUB_KEY

# Set to match your environment
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🌐 Deployment

Deploying your own instance to Vercel takes 60 seconds:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/abhivicks22/stockpulse)

*(Make sure to copy your environment variables into the Vercel project settings during setup!)*

---

*Built with ❤️ for the **AdaL Vibecoding Bootcamp** Capstone.*

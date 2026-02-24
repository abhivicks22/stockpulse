export interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  volume: number
  marketCap?: number
}

export interface StockHistoryPoint {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface WatchlistItemType {
  id: string
  symbol: string
  name: string
  type: string
  userId: string
  addedAt: string
}

export type SentimentLabel = 'Bullish' | 'Bearish' | 'Neutral'

export interface SentimentData {
  symbol: string
  score: number
  label: SentimentLabel
  summary: string
  headlines: string[]
}

export interface SearchResult {
  symbol: string
  name: string
  type: string
  region: string
}

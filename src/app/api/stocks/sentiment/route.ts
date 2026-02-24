import { NextRequest, NextResponse } from 'next/server'
import { SentimentData } from '@/types'

export const revalidate = 1800

const POSITIVE_WORDS = ['surge', 'rally', 'beat', 'growth', 'upgrade', 'bullish', 'record', 'gains', 'profit', 'outperform', 'buy', 'strong', 'soar', 'boom', 'rise', 'high', 'up', 'positive', 'win', 'success']
const NEGATIVE_WORDS = ['crash', 'decline', 'miss', 'downgrade', 'bearish', 'loss', 'sell', 'weak', 'warning', 'risk', 'drop', 'fall', 'plunge', 'fear', 'low', 'down', 'negative', 'fail', 'concern', 'worry']

function scoreHeadline(text: string): number {
    const words = text.toLowerCase().split(/\W+/)
    let pos = 0, neg = 0
    words.forEach(w => {
        if (POSITIVE_WORDS.includes(w)) pos++
        if (NEGATIVE_WORDS.includes(w)) neg++
    })
    const total = pos + neg
    if (total === 0) return 50
    return Math.round((pos / total) * 100)
}

export async function GET(request: NextRequest) {
    const symbol = request.nextUrl.searchParams.get('symbol')?.toUpperCase() ?? 'AAPL'

    try {
        const apiKey = process.env.FINNHUB_API_KEY
        if (apiKey && apiKey !== 'your_finnhub_key_here') {
            const today = new Date().toISOString().split('T')[0]
            const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]

            const res = await fetch(
                `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${weekAgo}&to=${today}&token=${apiKey}`
            )
            const articles = await res.json()

            if (Array.isArray(articles) && articles.length > 0) {
                const headlines: string[] = articles.slice(0, 20).map((a: { headline: string }) => a.headline)
                const scores = headlines.map(scoreHeadline)
                const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                const label = avgScore > 60 ? 'Bullish' : avgScore < 40 ? 'Bearish' : 'Neutral'

                const result: SentimentData = {
                    symbol,
                    score: avgScore,
                    label,
                    summary: headlines[0] ?? '',
                    headlines: headlines.slice(0, 5),
                }
                return NextResponse.json(result)
            }
        }
    } catch {
        // Fall through to mock
    }

    // Mock fallback based on symbol hash
    const hash = symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const score = 30 + (hash % 50)
    const result: SentimentData = {
        symbol,
        score,
        label: score > 60 ? 'Bullish' : score < 40 ? 'Bearish' : 'Neutral',
        summary: `${symbol} shows ${score > 55 ? 'positive' : 'mixed'} market signals based on recent activity.`,
        headlines: [
            `${symbol} reports ${score > 55 ? 'strong' : 'mixed'} quarterly performance`,
            `Analysts ${score > 55 ? 'upgrade' : 'watch'} ${symbol} amid market shifts`,
            `${symbol} trading volume ${score > 50 ? 'rises' : 'stabilizes'} on sector news`,
        ],
    }
    return NextResponse.json(result)
}

import { NextRequest, NextResponse } from 'next/server'
import { generateMockOHLCV } from '@/lib/mock-data'

export const revalidate = 300

const RANGE_DAYS: Record<string, number> = {
    '1d': 1, '1w': 7, '1m': 30, '3m': 90, '1y': 365, 'all': 730,
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ symbol: string }> }
) {
    const { symbol } = await params
    const range = request.nextUrl.searchParams.get('range') ?? '3m'
    const days = RANGE_DAYS[range.toLowerCase()] ?? 90

    try {
        const apiKey = process.env.ALPHA_VANTAGE_API_KEY
        if (apiKey && apiKey !== 'your_alpha_vantage_key_here') {
            const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`
            const res = await fetch(url, { next: { revalidate: 300 } })
            const json = await res.json()

            const series = json['Time Series (Daily)']
            if (series) {
                const allDates = Object.keys(series).sort()
                const cutDate = new Date()
                cutDate.setDate(cutDate.getDate() - days)
                const filtered = allDates.filter(d => new Date(d) >= cutDate)

                const data = filtered.map(date => ({
                    time: date,
                    open: parseFloat(series[date]['1. open']),
                    high: parseFloat(series[date]['2. high']),
                    low: parseFloat(series[date]['3. low']),
                    close: parseFloat(series[date]['4. close']),
                    volume: parseInt(series[date]['5. volume']),
                }))

                return NextResponse.json(data)
            }
        }
    } catch {
        // Fall through to mock
    }

    // Mock fallback
    return NextResponse.json(generateMockOHLCV(symbol, days))
}

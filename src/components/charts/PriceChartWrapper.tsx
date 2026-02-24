'use client'

import dynamic from 'next/dynamic'
import { StockHistoryPoint } from '@/types'

// The underlying chart uses browser-only APIs (Canvas, ResizeObserver, etc)
const PriceChart = dynamic(() => import('./PriceChart'), { ssr: false })

export default function PriceChartWrapper({ data }: { data: StockHistoryPoint[] }) {
    return <PriceChart data={data} />
}

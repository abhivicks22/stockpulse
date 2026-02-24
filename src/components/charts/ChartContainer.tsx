'use client'

import dynamic from 'next/dynamic'
import { StockHistoryPoint } from '@/types'

const PriceChart = dynamic(() => import('@/components/charts/PriceChart'), { ssr: false })

export default function ChartContainer({ data }: { data: StockHistoryPoint[] }) {
    return (
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
            <PriceChart data={data} height={480} />
        </div>
    )
}

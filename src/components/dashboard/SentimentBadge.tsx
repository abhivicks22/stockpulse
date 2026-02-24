'use client'

import { useEffect, useState } from 'react'
import { SentimentData } from '@/types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'

export default function SentimentBadge({ symbol }: { symbol: string }) {
    const [data, setData] = useState<SentimentData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/stocks/sentiment?symbol=${symbol}`)
            .then(r => r.json())
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false))
    }, [symbol])

    if (loading) return <Skeleton className="h-6 w-20 bg-white/[0.05] rounded-full" />
    if (!data) return null

    const config = {
        Bullish: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: TrendingUp },
        Bearish: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: TrendingDown },
        Neutral: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', icon: Minus },
    }[data.label]

    const Icon = config.icon

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} cursor-default`}>
                        <Icon className="w-3 h-3" />
                        {data.label} {data.score}%
                    </span>
                </TooltipTrigger>
                <TooltipContent className="bg-[#131722] border-white/10 text-zinc-300 max-w-64">
                    <p className="text-xs">{data.summary || 'No recent news'}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

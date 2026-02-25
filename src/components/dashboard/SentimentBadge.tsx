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
                <TooltipContent className="bg-[#131722] border-indigo-500/30 text-zinc-300 max-w-72 p-4 shadow-xl shadow-indigo-500/10">
                    <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Live AI Analysis</span>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-300">{data.summary || 'No recent news available to analyze.'}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

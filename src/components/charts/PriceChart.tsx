'use client'

import { useEffect, useRef, useState } from 'react'
import { StockHistoryPoint } from '@/types'
import { BarChart2, LineChart, AreaChart } from 'lucide-react'

type ChartType = 'candlestick' | 'line' | 'area'
type TimeRange = '1W' | '1M' | '3M' | '1Y' | 'ALL'

const RANGES: TimeRange[] = ['1W', '1M', '3M', '1Y', 'ALL']

function filterByRange(data: StockHistoryPoint[], range: TimeRange): StockHistoryPoint[] {
    const now = new Date()
    const cutoff = new Date()
    if (range === '1W') cutoff.setDate(now.getDate() - 7)
    else if (range === '1M') cutoff.setMonth(now.getMonth() - 1)
    else if (range === '3M') cutoff.setMonth(now.getMonth() - 3)
    else if (range === '1Y') cutoff.setFullYear(now.getFullYear() - 1)
    else return data
    return data.filter(d => new Date(d.time) >= cutoff)
}

interface PriceChartProps {
    data: StockHistoryPoint[]
    height?: number
}

export default function PriceChart({ data, height = 500 }: PriceChartProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [chartType, setChartType] = useState<ChartType>('candlestick')
    const [range, setRange] = useState<TimeRange>('3M')

    useEffect(() => {
        if (!containerRef.current) return

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let chart: any = null

        const init = async () => {
            const lc = await import('lightweight-charts')
            const { createChart, CandlestickSeries, LineSeries, AreaSeries } = lc as typeof lc & {
                CandlestickSeries: unknown
                LineSeries: unknown
                AreaSeries: unknown
            }

            chart = createChart(containerRef.current!, {
                layout: {
                    background: { color: '#0a0a0a' },
                    textColor: '#a1a1aa',
                },
                grid: {
                    vertLines: { color: 'rgba(255,255,255,0.03)' },
                    horzLines: { color: 'rgba(255,255,255,0.03)' },
                },
                width: containerRef.current!.clientWidth,
                height,
                crosshair: { mode: 1 },
                rightPriceScale: { borderColor: 'rgba(255,255,255,0.05)' },
                timeScale: { borderColor: 'rgba(255,255,255,0.05)', timeVisible: true },
            })

            const filtered = filterByRange(data, range)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let series: any
            if (chartType === 'candlestick') {
                series = chart.addSeries(CandlestickSeries, {
                    upColor: '#22c55e',
                    downColor: '#ef4444',
                    borderUpColor: '#22c55e',
                    borderDownColor: '#ef4444',
                    wickUpColor: '#22c55e',
                    wickDownColor: '#ef4444',
                })
                series.setData(filtered)
            } else if (chartType === 'line') {
                series = chart.addSeries(LineSeries, { color: '#6366f1', lineWidth: 2 })
                series.setData(filtered.map((d: StockHistoryPoint) => ({ time: d.time, value: d.close })))
            } else {
                series = chart.addSeries(AreaSeries, {
                    lineColor: '#6366f1',
                    topColor: 'rgba(99,102,241,0.3)',
                    bottomColor: 'rgba(99,102,241,0)',
                    lineWidth: 2,
                })
                series.setData(filtered.map((d: StockHistoryPoint) => ({ time: d.time, value: d.close })))
            }

            chart.timeScale().fitContent()

            // Responsive resize
            const ro = new ResizeObserver(() => {
                if (containerRef.current && chart) {
                    chart.applyOptions({ width: containerRef.current.clientWidth })
                }
            })
            ro.observe(containerRef.current!)
            return () => ro.disconnect()
        }

        const cleanupPromise = init()
        return () => {
            cleanupPromise.then(fn => fn?.())
            chart?.remove()
        }
    }, [data, chartType, range, height])

    return (
        <div>
            {/* Controls */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                {/* Chart type selector */}
                <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-1">
                    {([['candlestick', BarChart2], ['line', LineChart], ['area', AreaChart]] as const).map(([type, Icon]) => (
                        <button
                            key={type}
                            onClick={() => setChartType(type)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${chartType === type
                                    ? 'bg-indigo-500/20 text-indigo-300'
                                    : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            aria-label={`Switch to ${type} chart`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {type}
                        </button>
                    ))}
                </div>

                {/* Time range */}
                <div className="flex items-center gap-1">
                    {RANGES.map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${range === r
                                    ? 'bg-indigo-500/20 text-indigo-300'
                                    : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart mount point */}
            <div ref={containerRef} className="w-full" style={{ height }} />
        </div>
    )
}

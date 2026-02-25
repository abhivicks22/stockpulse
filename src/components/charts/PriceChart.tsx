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
}

export default function PriceChart({ data }: PriceChartProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [chartType, setChartType] = useState<ChartType>('candlestick')
    const [range, setRange] = useState<TimeRange>('3M')

    useEffect(() => {
        if (!containerRef.current) return

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
                    background: { color: '#131722' }, // Exact TV Dark Mode BG
                    textColor: '#A3A6AF', // Exact TV Text Color
                },
                grid: {
                    vertLines: { color: '#1E222D' }, // TV Grid line color
                    horzLines: { color: '#1E222D' },
                },
                width: containerRef.current!.clientWidth,
                height: containerRef.current!.clientHeight,
                crosshair: {
                    mode: 1,
                    vertLine: { color: '#A3A6AF', width: 1, style: 1 },
                    horzLine: { color: '#A3A6AF', width: 1, style: 1 },
                },
                rightPriceScale: { borderColor: '#2A2E39' },
                timeScale: { borderColor: '#2A2E39', timeVisible: true },
            })

            const filtered = filterByRange(data, range)

            let series: any
            if (chartType === 'candlestick') {
                series = chart.addSeries(CandlestickSeries, {
                    upColor: '#089981', // TV exact green
                    downColor: '#F23645', // TV exact red
                    borderUpColor: '#089981',
                    borderDownColor: '#F23645',
                    wickUpColor: '#089981',
                    wickDownColor: '#F23645',
                })
                series.setData(filtered)
            } else if (chartType === 'line') {
                series = chart.addSeries(LineSeries, { color: '#2962FF', lineWidth: 2 }) // TV blue
                series.setData(filtered.map((d: StockHistoryPoint) => ({ time: d.time, value: d.close })))
            } else {
                series = chart.addSeries(AreaSeries, {
                    lineColor: '#2962FF',
                    topColor: 'rgba(41, 98, 255, 0.3)',
                    bottomColor: 'rgba(41, 98, 255, 0)',
                    lineWidth: 2,
                })
                series.setData(filtered.map((d: StockHistoryPoint) => ({ time: d.time, value: d.close })))
            }

            chart.timeScale().fitContent()

            const ro = new ResizeObserver(() => {
                if (containerRef.current && chart) {
                    chart.applyOptions({
                        width: containerRef.current.clientWidth,
                        height: containerRef.current.clientHeight
                    })
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
    }, [data, chartType, range])

    return (
        <div className="absolute inset-0 flex flex-col pt-2 px-2 pb-0">
            {/* Minimal overlays/controls embedded over the canvas area */}
            <div className="flex items-center gap-4 mb-2 z-10">
                {/* Time range */}
                <div className="flex items-center overflow-x-auto scrollbar-hide">
                    {RANGES.map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${range === r
                                ? 'text-indigo-400 bg-indigo-500/10'
                                : 'text-[#A3A6AF] hover:text-[#D1D4DC]'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                <div className="border-l border-[#2A2E39] h-4" />

                {/* Chart type selector */}
                <div className="flex items-center gap-1">
                    {([['candlestick', BarChart2], ['line', LineChart], ['area', AreaChart]] as const).map(([type, Icon]) => (
                        <button
                            key={type}
                            onClick={() => setChartType(type)}
                            className={`p-1 rounded transition-colors ${chartType === type
                                ? 'text-indigo-400 bg-indigo-500/10'
                                : 'text-[#A3A6AF] hover:text-[#D1D4DC]'
                                }`}
                            title={type}
                        >
                            <Icon className="w-3.5 h-3.5" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart mount point (flex-1 so it takes all remaining vertical real estate) */}
            <div ref={containerRef} className="flex-1 w-full min-h-0" />
        </div>
    )
}

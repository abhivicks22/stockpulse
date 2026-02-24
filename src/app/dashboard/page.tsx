import ChartContainer from '@/components/charts/ChartContainer'
import WatchlistSidebar from '@/components/dashboard/WatchlistSidebar'
import { Suspense } from 'react'

export default function DashboardPage() {
    // Default symbol for the main dashboard view
    const defaultSymbol = 'AAPL'

    return (
        <div className="flex flex-1 w-full h-full overflow-hidden">
            {/* Main Chart Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117] relative">
                <main className="flex-1 w-full h-full">
                    <Suspense fallback={
                        <div className="w-full h-full flex items-center justify-center text-[#A3A6AF]">
                            Loading chart engine...
                        </div>
                    }>
                        <ChartContainer symbol={defaultSymbol} />
                    </Suspense>
                </main>
            </div>

            {/* Right Sidebar (Watchlist) */}
            <WatchlistSidebar />
        </div>
    )
}

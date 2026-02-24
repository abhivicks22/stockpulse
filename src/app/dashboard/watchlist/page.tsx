import WatchlistTable from '@/components/dashboard/WatchlistTable'

export default function WatchlistPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Your Watchlist</h1>
                <p className="text-zinc-500 text-sm mt-1">Track your favorite stocks and crypto with live prices and AI sentiment.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
                <WatchlistTable />
            </div>
        </div>
    )
}

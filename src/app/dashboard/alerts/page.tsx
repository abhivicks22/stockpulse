import { Bell } from 'lucide-react'

export default function AlertsPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-2">Price Alerts</h1>
            <p className="text-zinc-500 text-sm mb-6">Get notified when stocks hit your target price.</p>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-12 text-center">
                <Bell className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 font-medium">Price alerts coming soon</p>
                <p className="text-zinc-600 text-sm mt-2">We&apos;re working on real-time push notifications for your watchlist.</p>
            </div>
        </div>
    )
}

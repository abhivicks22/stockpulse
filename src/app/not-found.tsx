import Link from 'next/link'
import { Activity } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center text-center px-4">
            <div className="flex items-center gap-2 mb-8">
                <Activity className="w-6 h-6 text-indigo-500" />
                <span className="font-bold text-xl text-white">StockPulse</span>
            </div>
            <h1 className="text-8xl font-bold text-white/10 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-white mb-3">Page not found</h2>
            <p className="text-zinc-500 mb-8 max-w-sm">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
                href="/"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            >
                Back to Home
            </Link>
        </div>
    )
}

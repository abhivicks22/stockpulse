import Link from 'next/link'
import { Activity } from 'lucide-react'

const footerLinks = {
    Product: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Charts', href: '/dashboard/chart/AAPL' },
        { label: 'Watchlist', href: '/dashboard/watchlist' },
        { label: 'Settings', href: '/dashboard/settings' },
    ],
    Resources: [
        { label: 'Documentation', href: '#' },
        { label: 'API Reference', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Status', href: '#' },
    ],
    Legal: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
    ],
}

export default function Footer() {
    return (
        <footer className="bg-[#0a0a0a] border-t border-white/5 pt-16 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-indigo-500" />
                            <span className="font-bold text-lg text-white">StockPulse</span>
                        </Link>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            AI-powered market intelligence for everyday traders. Real-time charts, smart watchlists, and sentiment analysis — all free.
                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([section, links]) => (
                        <div key={section}>
                            <h4 className="text-sm font-semibold text-zinc-300 mb-4">{section}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-zinc-600">
                        © 2026 StockPulse. Built by Abhijeet.
                    </p>
                    <p className="text-xs text-zinc-700">
                        Charts powered by{' '}
                        <a
                            href="https://www.tradingview.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2"
                        >
                            TradingView Lightweight Charts™
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}

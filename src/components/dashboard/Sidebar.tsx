'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Activity, LayoutDashboard, LineChart, Star, Bell, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Charts', icon: LineChart, href: '/dashboard/chart/AAPL' },
    { label: 'Watchlist', icon: Star, href: '/dashboard/watchlist' },
    { label: 'Alerts', icon: Bell, href: '/dashboard/alerts' },
    { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export default function Sidebar({ user }: { user: User }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    const initials = user.user_metadata?.full_name
        ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
        : user.email?.[0]?.toUpperCase() ?? 'U'

    return (
        <aside className="hidden md:flex flex-col bg-[#0a0a0a] border-r border-white/5 w-[260px] h-screen fixed left-0 top-0 z-40">
            {/* Logo */}
            <div className="flex items-center gap-2 px-6 py-5 border-b border-white/5">
                <Activity className="w-5 h-5 text-indigo-500" />
                <span className="font-bold text-lg text-white">StockPulse</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 pl-[10px]'
                                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* User section */}
            <div className="px-3 py-4 border-t border-white/5">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {user.user_metadata?.full_name ?? 'Trader'}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, Minus, Search, Settings, MousePointer2, TrendingUp, TrendingDown, Crosshair, Type, Ruler } from 'lucide-react'

const tools = [
    { icon: Crosshair, label: 'Crosshair', active: true },
    { icon: Minus, label: 'Trend Line' },
    { icon: TrendingUp, label: 'Pitchfork' },
    { icon: Type, label: 'Text' },
    { icon: Ruler, label: 'Measure' },
    { icon: Search, label: 'Zoom In' },
]

export default function LeftToolbar() {
    return (
        <aside className="hidden sm:flex w-[50px] bg-[#131722] border-r border-[#2A2E39] flex-col items-center py-2 gap-2 z-10 shrink-0">
            {tools.map((toolbarItem, idx) => (
                <button
                    key={idx}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${toolbarItem.active
                        ? 'text-indigo-500 bg-indigo-500/10'
                        : 'text-[#A3A6AF] hover:bg-[#2A2E39] hover:text-[#D1D4DC]'
                        }`}
                    title={toolbarItem.label}
                >
                    <toolbarItem.icon className="w-5 h-5" strokeWidth={1.5} />
                </button>
            ))}

            <div className="flex-1" /> {/* Spacer */}

            <Link
                href="/dashboard/settings"
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[#A3A6AF] hover:bg-[#2A2E39] hover:text-[#D1D4DC] transition-colors mb-2"
                title="Settings"
            >
                <Settings className="w-5 h-5" strokeWidth={1.5} />
            </Link>
        </aside>
    )
}

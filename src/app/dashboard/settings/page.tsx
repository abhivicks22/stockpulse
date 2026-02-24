import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/sign-in')

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white">Settings</h1>

            {/* Profile */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white">Profile</h2>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Name', value: user.user_metadata?.full_name ?? 'Not set' },
                        { label: 'Email', value: user.email ?? '' },
                        { label: 'Provider', value: user.app_metadata?.provider ?? 'github' },
                        { label: 'Member since', value: new Date(user.created_at).toLocaleDateString() },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <p className="text-xs text-zinc-500 mb-1">{label}</p>
                            <p className="text-sm text-white font-medium capitalize">{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Preferences */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Chart Preferences</h2>
                <p className="text-xs text-zinc-600 mb-3">Default chart type (saved to your browser)</p>
                <div className="flex gap-2">
                    {['Candlestick', 'Line', 'Area'].map(type => (
                        <button
                            key={type}
                            className="px-4 py-2 rounded-lg text-sm border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white transition-all first:bg-indigo-500/20 first:text-indigo-300 first:border-indigo-500/20"
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Danger zone */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h2>
                <p className="text-sm text-zinc-500 mb-4">Once you sign out, you&apos;ll need to sign in again to access your dashboard.</p>
                <form action="/api/auth/signout" method="post">
                    <a
                        href="/"
                        className="inline-flex items-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-all"
                        onClick={async () => {
                            'use server'
                            const s = await createClient()
                            await s.auth.signOut()
                        }}
                    >
                        Sign Out
                    </a>
                </form>
            </div>
        </div>
    )
}

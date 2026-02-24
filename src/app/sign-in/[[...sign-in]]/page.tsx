'use client'

import { createClient } from '@/lib/supabase/client'
import { Activity, Github } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SignInPage() {
    const supabase = createClient()

    const signInWithGitHub = () => {
        supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`,
            },
        })
    }

    return (
        <div className="min-h-screen bg-[#131722] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.05] rounded-2xl p-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        <span className="font-bold text-lg text-white">StockPulse</span>
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
                    <p className="text-zinc-400 text-sm mb-8">Sign in to access your dashboard</p>

                    <Button
                        onClick={signInWithGitHub}
                        className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/10 h-11 gap-3 text-sm font-medium transition-all hover:scale-[1.01]"
                        variant="outline"
                        id="github-signin-btn"
                    >
                        <Github className="w-4 h-4" />
                        Continue with GitHub
                    </Button>

                    <p className="text-center text-sm text-zinc-500 mt-6">
                        Don&apos;t have an account?{' '}
                        <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                            It&apos;s free →
                        </Link>
                    </p>
                </div>

                <Link href="/" className="block text-center text-sm text-zinc-600 hover:text-zinc-400 mt-6 transition-colors">
                    ← Back to home
                </Link>
            </div>
        </div>
    )
}

'use client'

import { createClient } from '@/lib/supabase/client'
import { Activity, Github } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SignUpPage() {
    const supabase = createClient()

    const signUpWithProvider = (provider: 'github' | 'google') => {
        supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`,
                queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined,
            },
        })
    }

    return (
        <div className="min-h-screen bg-[#131722] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.05] rounded-2xl p-8">
                    <div className="flex items-center gap-2 mb-8">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        <span className="font-bold text-lg text-white">StockPulse</span>
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
                    <p className="text-zinc-400 text-sm mb-8">Free forever. No credit card required.</p>

                    <div className="space-y-3">
                        <Button
                            onClick={() => signUpWithProvider('google')}
                            className="w-full bg-white text-black hover:bg-zinc-200 border border-transparent h-11 gap-3 text-sm font-medium transition-all hover:scale-[1.01] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                            id="google-signup-btn"
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.11c-.22-.69-.35-1.43-.35-2.11s.13-1.42.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </Button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#181C27] px-2 text-zinc-500 rounded-lg">Or</span>
                            </div>
                        </div>

                        <Button
                            onClick={() => signUpWithProvider('github')}
                            className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/10 h-11 gap-3 text-sm font-medium transition-all hover:scale-[1.01]"
                            variant="outline"
                            id="github-signup-btn"
                        >
                            <Github className="w-4 h-4" />
                            Continue with GitHub
                        </Button>
                    </div>

                    <p className="text-center text-sm text-zinc-500 mt-6">
                        Already have an account?{' '}
                        <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                            Sign in
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

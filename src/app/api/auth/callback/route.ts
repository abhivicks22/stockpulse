import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
        const supabase = await createClient()
        const { error, data } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user) {
            // Upsert user in Prisma
            await prisma.user.upsert({
                where: { email: data.user.email! },
                update: {
                    name: data.user.user_metadata?.full_name ?? undefined,
                    avatarUrl: data.user.user_metadata?.avatar_url ?? undefined,
                },
                create: {
                    email: data.user.email!,
                    name: data.user.user_metadata?.full_name ?? null,
                    avatarUrl: data.user.user_metadata?.avatar_url ?? null,
                },
            })

            return NextResponse.redirect(`${origin}/dashboard`)
        }
    }

    return NextResponse.redirect(`${origin}/sign-in?error=oauth_callback_error`)
}

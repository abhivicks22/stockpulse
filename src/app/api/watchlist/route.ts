import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

async function getUser(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) return null

    try {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
        return dbUser
    } catch {
        return null
    }
}

export async function GET(request: NextRequest) {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const items = await prisma.watchlistItem.findMany({
            where: { userId: user.id },
            orderBy: { addedAt: 'desc' },
        })
        return NextResponse.json(items)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { symbol, name, type = 'stock' } = await request.json()
    if (!symbol || !name) return NextResponse.json({ error: 'Symbol and name required' }, { status: 400 })

    try {
        // Check limit
        const count = await prisma.watchlistItem.count({ where: { userId: user.id } })
        if (count >= 20) return NextResponse.json({ error: 'Max 20 items allowed' }, { status: 400 })

        const item = await prisma.watchlistItem.create({
            data: { symbol: symbol.toUpperCase(), name, type, userId: user.id },
        })
        return NextResponse.json(item)
    } catch (err: unknown) {
        if ((err as { code?: string }).code === 'P2002') {
            return NextResponse.json({ error: 'Already in watchlist' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { itemId, symbol } = await request.json()

    try {
        if (itemId) {
            await prisma.watchlistItem.deleteMany({
                where: { id: itemId, userId: user.id },
            })
        } else if (symbol) {
            await prisma.watchlistItem.deleteMany({
                where: { symbol: symbol.toUpperCase(), userId: user.id },
            })
        }
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
    }
}

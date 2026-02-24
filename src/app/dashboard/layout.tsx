import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LeftToolbar from '@/components/dashboard/LeftToolbar'
import TopNav from '@/components/dashboard/TopNav'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/sign-in')
    }

    return (
        <div className="flex flex-col h-screen w-screen bg-[#131722] overflow-hidden">
            {/* Top Navigation Bar */}
            <TopNav user={user} />

            {/* Main Application Area */}
            <div className="flex flex-1 min-h-0 relative">
                {/* Left Drawing Tools Sidebar */}
                <LeftToolbar />

                {/* Central Workspace + Right Sidebar */}
                <div className="flex-1 flex min-w-0">
                    {children}
                </div>
            </div>
        </div>
    )
}

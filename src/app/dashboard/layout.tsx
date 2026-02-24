import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

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
        <div className="flex h-screen bg-[#0d1117] overflow-hidden">
            {/* Sidebar */}
            <Sidebar user={user} />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-[260px]">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

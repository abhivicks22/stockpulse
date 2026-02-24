import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48 bg-white/[0.03]" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-24 bg-white/[0.03] rounded-xl" />
                ))}
            </div>
            <Skeleton className="h-80 bg-white/[0.03] rounded-xl" />
            <Skeleton className="h-48 bg-white/[0.03] rounded-xl" />
        </div>
    )
}

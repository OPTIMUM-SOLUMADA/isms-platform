import { Skeleton } from "@/components/ui/skeleton"

export function PageSkeleton() {
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <Skeleton className="h-8 w-1/3" /> {/* title */}
                <Skeleton className="h-4 w-1/2" /> {/* subtitle */}
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg space-y-2">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-8 w-1/4" />
                    </div>
                ))}
            </div>

            {/* Search + filters */}
            <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-10 w-64 rounded-md" /> {/* search */}
                <Skeleton className="h-10 w-40 rounded-md" /> {/* filter 1 */}
                <Skeleton className="h-10 w-40 rounded-md" /> {/* filter 2 */}
                <Skeleton className="h-10 w-40 rounded-md" /> {/* filter 3 */}
            </div>

            {/* Table skeleton */}
            <div className="border rounded-lg overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-7 gap-4 p-3 bg-muted/30">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
                {/* Table rows */}
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-7 gap-4 p-3 border-t items-center"
                    >
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-24 rounded-md" /> {/* action button */}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center pt-4">
                <Skeleton className="h-4 w-40" /> {/* selection count */}
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-24 rounded-md" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                </div>
            </div>
        </div>
    )
}

import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DocumentDetailSkeleton = () => {
    const tabs = Array.from({ length: 3 }, (_, i) => ({ id: `tab-${i}` }));
    return (
        <div className="flex flex-col space-y-6 flex-grow">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                        <Skeleton className="h-8 w-80" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <Skeleton className="h-8 w-32" />
            </div>

            {/* Document Info */}
            <Skeleton className="h-60 w-full" />

            <Tabs
                orientation="vertical"
                defaultValue={tabs[0].id}
                className="w-full flex flex-row items-start gap-6 justify-center flex-grow"
            >
                {/* Sidebar Tabs Skeleton */}
                <TabsList className="shrink-0 grid grid-cols-1 min-w-28 p-0 bg-background gap-2">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="flex items-center justify-start gap-2 py-2 text-sm"
                        >
                            <Skeleton className="w-4 h-4" />
                            <Skeleton className="w-16 h-4" />
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Content Skeleton */}
                <Skeleton className="flex items-center justify-center w-full h-full p-2 flex-grow flex-col" />
            </Tabs>

        </div>
    )
}

export default DocumentDetailSkeleton
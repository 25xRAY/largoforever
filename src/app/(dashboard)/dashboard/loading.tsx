import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton variant="text" className="h-8 w-64" />
          <Skeleton variant="text" className="h-5 w-48" />
        </div>
        <div className="flex justify-center">
          <Skeleton variant="circle" className="h-[200px] w-[200px]" />
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" className="h-6 w-24" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rect" className="h-20 w-full" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rect" className="h-24" />
          ))}
        </div>
      </div>
      <aside className="space-y-6">
        <Skeleton variant="rect" className="h-24" />
        <Skeleton variant="rect" className="h-40" />
        <Skeleton variant="rect" className="h-32" />
      </aside>
    </div>
  );
}

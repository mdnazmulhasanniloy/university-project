import { Skeleton } from "@/components/ui/skeleton";

export default function ExpertCardSkeleton() {
  return (
    <div className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          className="mx-4 h-[320px] w-full space-y-4 rounded-3xl border p-5 shadow"
          key={idx}
        >
          <Skeleton className="h-[220px] rounded-xl" />

          <div className="flex-center-between w-full">
            <div className="w-full">
              <Skeleton className="h-4 w-1/2 rounded-xl" />
              <Skeleton className="mt-2 h-4 w-1/4 rounded-xl" />
            </div>

            <Skeleton className="h-10 w-1/2 rounded-3xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

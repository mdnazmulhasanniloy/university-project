import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function NotificationsSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 6 }).map((_, idx) => (
        <Skeleton className="h-20 w-full rounded-lg" key={idx}></Skeleton>
      ))}
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import gridPatternBg from "/public/images/grid-pattern.svg";
import { cn } from "@/lib/utils";

export default function GridBg() {
  const currentPath = usePathname();

  // Specify routes with grid pattern background
  const withoutGridPatternRoutes = [];

  return (
    <div
      className={cn(
        "absolute inset-0 -z-[9999]",
        withoutGridPatternRoutes.includes(currentPath) && "hidden",
        currentPath?.includes("/seller") || currentPath?.includes("/customer")
          ? "min-h-[150vh]"
          : "",
      )}
      style={{
        backgroundImage: `url(${gridPatternBg?.src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    />
  );
}

"use client";

import { cn } from "@/lib/utils";

export default function ResponsiveContainer({ children, className, id }) {
  return (
    <section
      className={cn(
        `3xl:w-[80%] mx-auto w-full px-5 md:px-10 lg:w-[90%] lg:px-0 2xl:w-[85%]`,
        className,
      )}
      id={id}
    >
      {children}
    </section>
  );
}

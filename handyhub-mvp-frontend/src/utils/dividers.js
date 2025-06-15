import { cn } from "@/lib/utils";

export const DotDivider = ({ className }) => {
  return <div className={cn(`h-1 w-1 rounded-full bg-black`, className)} />;
};

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

export default function CustomTooltip({ children, title, className }) {
  return (
    <TooltipProvider delayDuration={0.2}>
      <Tooltip>
        <TooltipTrigger as="button">{children}</TooltipTrigger>
        <TooltipContent className={cn("font-dm-sans", className)}>
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

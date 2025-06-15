import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import React from "react";

export default function Preview({ children, onClick, className }) {
  return (
    <div className={cn("group relative", className)}>
      {/* Preview overlay */}
      <div
        className="flex-center invisible absolute inset-0 z-[9999] h-full cursor-pointer gap-x-1 rounded-md bg-black bg-opacity-50 font-dm-sans text-lg font-medium text-white opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100"
        onClick={onClick}
      >
        <Eye size={20} />
        <p>Preview</p>
      </div>

      {children}
    </div>
  );
}

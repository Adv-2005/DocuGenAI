import { PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-bold gradient-text transition-all duration-300 hover:scale-105",
        className
      )}
    >
      <div className="relative">
        <PenSquare className="h-6 w-6 text-indigo-600 animate-pulse-glow" />
        <div className="absolute inset-0 bg-indigo-400/30 rounded-full blur-md"></div>
      </div>
      <span>DocuGenAI</span>
    </div>
  );
}

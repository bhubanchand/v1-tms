import * as React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export function BrandLogo({
  size = "md",
  showTagline = false,
  className,
  ...props
}: BrandLogoProps) {
  const iconSizes = {
    sm: "h-6 w-6 rounded-md",
    md: "h-7 w-7 rounded-lg",
    lg: "h-9 w-9 rounded-xl",
  }[size];

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }[size];

  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)} {...props}>
      {/* Minimalist Geometric Logo Mark */}
      <div
        className={cn(
          "flex items-center justify-center bg-primary text-primary-foreground shadow-sm shrink-0 relative overflow-hidden transition-transform hover:scale-105",
          iconSizes
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          {/* Calm, interlocking flow mark */}
          <path d="M7 8h10M7 12h7M7 16h4" />
          <circle cx="17" cy="16" r="1.5" fill="currentColor" />
        </svg>
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn("font-bold tracking-tight text-foreground leading-none", textSizes)}>
            Relay
          </span>
          <span className="text-[10px] font-mono uppercase px-1 py-0.2 rounded bg-muted text-muted-foreground font-semibold">
            TMS
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-muted-foreground font-normal tracking-normal mt-0.5">
            Work, without the chaos.
          </span>
        )}
      </div>
    </div>
  );
}

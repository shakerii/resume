"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/utils/cn";

export function SkillBadge({
  name,
  rating,
  className,
  tooltipClassName,
}: {
  name: string;
  rating: number;
  className?: string;
  tooltipClassName?: string;
}) {
  const label = `${rating}/10`;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex cursor-default items-center font-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className,
          )}
        >
          {name}
          <span className="sr-only">, {label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={4} className={tooltipClassName}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

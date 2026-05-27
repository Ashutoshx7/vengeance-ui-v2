"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface ElasticStackItem {
  id: string | number;
  content?: React.ReactNode;
  color?: string; 
}

export interface ElasticStackProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ElasticStackItem[];
  itemSize?: number;
  overlap?: number;
  pushForce?: number;
}

export function ElasticStack({
  items,
  itemSize = 80,
  overlap = 40,
  pushForce = 15,
  className,
  ...props
}: ElasticStackProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = items.length;
  // Custom spring-like easing from the original CSS
  const springEasing = "linear(0, 0.79 14.4%, 1.026 22.4%, 1.164 31.2%, 1.207 38.2%, 1.208 46.2%, 1.033 80%, 1)";

  return (
    <div
      className={cn("flex items-center justify-center cursor-pointer py-8", className)}
      onMouseLeave={() => setHoveredIndex(null)}
      {...props}
    >
      {items.map((item, i) => {
        let translateX = 0;
        let scale = 1;
        let zIndex = i; // Base stacking order
        let isHovered = hoveredIndex === i;

        if (hoveredIndex !== null) {
          if (i > hoveredIndex) {
            translateX = Math.min(pushForce * (total - i - 1), overlap);
          } else if (i < hoveredIndex) {
            translateX = -Math.min(pushForce * i, overlap);
          } else {
            scale = 1.25;
            zIndex = 100;
          }
        }

        const bgColor = item.color || `oklch(80% 0.15 ${(i + 1) * 30})`;

        return (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredIndex(i)}
            className="relative flex items-center justify-center rounded-full isolate transition-all duration-700"
            style={{
              width: itemSize,
              height: itemSize,
              marginLeft: i === 0 ? 0 : -overlap,
              transform: `translateX(${translateX}px) scale(${scale})`,
              transitionTimingFunction: springEasing,
              zIndex,
              backgroundColor: bgColor,
              filter: isHovered ? "saturate(140%)" : "none",
              boxShadow: isHovered 
                ? "none" 
                : "-6px 0px 10px -3px rgba(0,0,0,0.3)"
            }}
          >
            {/* Inner Content Circle */}
            <div 
              className={cn(
                "absolute inset-[6px] rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center font-bold text-lg md:text-2xl transition-colors duration-300",
                !isHovered && "text-neutral-500 dark:text-zinc-400"
              )}
              style={isHovered ? { color: bgColor } : {}}
            >
              {item.content || (i + 1)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ElasticStack;

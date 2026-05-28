"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { AlignLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface TOCItemDef {
  id: string;
  title: string;
  depth: number;
}

const DEFAULT_ITEMS: TOCItemDef[] = [
  { id: "overview", title: "Overview", depth: 2 },
  { id: "preview", title: "Preview", depth: 3 },
  { id: "installation", title: "Installation", depth: 2 },
  { id: "usage", title: "Usage", depth: 2 },
  { id: "props", title: "Props", depth: 2 },
];

const a = 8;
const getLineOffset = (depth: number) => (depth <= 2 ? a : 8 + a);
const getItemOffset = (depth: number) => (depth <= 2 ? 12 + a : 24 + a);

function TOCItem({ item, index, active, items }: { item: TOCItemDef; index: number; active: boolean; items: TOCItemDef[] }) {
  const offset = getLineOffset(item.depth);
  const upperOffset = index > 0 ? getLineOffset(items[index - 1].depth) : offset;
  const lowerOffset = index + 1 < items.length ? getLineOffset(items[index + 1].depth) : offset;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(item.id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <li
      className={cn(
        "relative text-[14px] font-medium transition-colors h-10 flex items-center cursor-pointer",
        active ? "text-neutral-900 dark:text-zinc-200" : "text-neutral-400 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-300"
      )}
      style={{ paddingLeft: getItemOffset(item.depth) }}
      onClick={handleClick}
    >
      {/* Background SVG Curve */}
      {offset !== upperOffset && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`${Math.min(offset, upperOffset)} 0 ${Math.abs(upperOffset - offset)} 16`}
          className="absolute -top-2 -z-10"
          style={{
            width: Math.abs(upperOffset - offset) + 1,
            height: 16,
            left: Math.min(offset, upperOffset),
          }}
        >
          <path
            d={`M ${upperOffset} 0 C ${upperOffset} 10 ${offset} 6 ${offset} 16`}
            strokeWidth="1"
            fill="none"
            className="stroke-neutral-200 dark:stroke-zinc-800/60"
          />
        </svg>
      )}
      {/* Background Vertical Line */}
      <div
        className={cn(
          "absolute inset-y-0 w-px bg-neutral-200 dark:bg-zinc-800/60 -z-10",
          offset !== upperOffset && "top-2",
          offset !== lowerOffset && "bottom-2"
        )}
        style={{ left: offset }}
      />
      {item.title}
    </li>
  );
}

export function TableOfContents() {
  const items = DEFAULT_ITEMS;
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const rafRef = useRef<number>(0);
  const lastIndexRef = useRef(0);

  useEffect(() => { setMounted(true); }, []);

  // Guard against hydration mismatch: use neutral color until client mounts
  const activeColor = mounted ? (resolvedTheme === "dark" ? "#e4e4e7" : "#18181b") : "#18181b";

  // Use RAF-throttled scroll handler for smooth 60fps performance
  const handleScroll = useCallback(() => {
    // If we've scrolled to the absolute bottom of the page, highlight the last item
    if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 50) {
      if (lastIndexRef.current !== items.length - 1) {
        lastIndexRef.current = items.length - 1;
        setActiveIndex(items.length - 1);
      }
      return;
    }

    // Find the section that is currently visible
    let currentIndex = 0;
    for (let i = items.length - 1; i >= 0; i--) {
      const element = document.getElementById(items[i].id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 120) {
          currentIndex = i;
          break;
        }
      }
    }

    // Only update state if it actually changed
    if (lastIndexRef.current !== currentIndex) {
      lastIndexRef.current = currentIndex;
      setActiveIndex(currentIndex);
    }
  }, [items]);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafRef.current = requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  let d = "";
  const positions: [number, number][] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const x = getLineOffset(item.depth) + 0.5;
    const top = i * 40 + 8;
    const bottom = i * 40 + 32;

    if (i === 0) {
      d += `M${x} ${top} L${x} ${bottom}`;
    } else {
      const upperBottom = positions[i - 1][1];
      const upperX = getLineOffset(items[i - 1].depth) + 0.5;
      d += ` C ${upperX} ${top - 5} ${x} ${upperBottom + 5} ${x} ${top} L${x} ${bottom}`;
    }
    positions.push([top, bottom]);
  }

  const trackTop = positions[activeIndex]?.[0] || 0;
  const trackBottom = positions[activeIndex]?.[1] || 0;
  const dotX = getLineOffset(items[activeIndex].depth) + 0.5;
  const dotY = (trackTop + trackBottom) / 2;

  const transitionConfig = { type: "tween" as const, ease: "easeOut" as const, duration: 0.2 };

  return (
    <aside className="hidden xl:block sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-6 pl-4 font-sans">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-neutral-400 dark:text-zinc-500 mb-6 px-1">
          <AlignLeft className="h-4 w-4" />
          <span className="text-[12px] font-semibold uppercase tracking-wider">On this page</span>
        </div>

        <div className="relative ml-2">
          {/* Overlay SVG Canvas for Active Line & Dot */}
          <svg
            className="absolute left-0 top-0 w-[30px] pointer-events-none"
            style={{ zIndex: 10, height: items.length * 40 }}
          >
            {/* Animated Active Segment using clip-path */}
            <motion.path
              d={d}
              fill="none"
              stroke={activeColor}
              strokeWidth="1.25"
              animate={{
                clipPath: `polygon(0px ${trackTop}px, 100% ${trackTop}px, 100% ${trackBottom}px, 0px ${trackBottom}px)`
              }}
              transition={transitionConfig}
            />

            {/* Animated Glowing Dot */}
            <motion.circle
              r="2"
              fill={activeColor}
              initial={false}
              animate={{ cx: dotX, cy: dotY }}
              transition={transitionConfig}
            />
          </svg>

          {/* List Items */}
          <ul className="relative z-1 flex flex-col w-full">
            {items.map((item, idx) => (
              <TOCItem
                key={item.id}
                item={item}
                index={idx}
                active={activeIndex === idx}
                items={items}
              />
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

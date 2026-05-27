"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Beam {
  id: string;
  left: string;
  background: string;
  duration: string;
  delay: string;
}

export interface BeamTunnelProps extends React.HTMLAttributes<HTMLDivElement> {
  beamCount?: number;
  beamColors?: string[];
}

export function BeamTunnel({ 
  className, 
  beamCount = 3, 
  beamColors = [
    "linear-gradient(#0A74FF, transparent)",
    "linear-gradient(#FF512F, transparent)",
    "linear-gradient(#7F00FF, transparent)",
    "linear-gradient(#22c55e, transparent)",
  ],
  children,
  ...props 
}: BeamTunnelProps) {
  const [sides, setSides] = useState<{ top: Beam[]; bottom: Beam[]; left: Beam[]; right: Beam[] }>({
    top: [], bottom: [], left: [], right: []
  });

  useEffect(() => {
    const generateBeams = () => {
      const generateSideBeams = (prefix: string) => {
        return Array.from({ length: beamCount }).map((_, i) => {
          // Slow down the animation significantly for a more tasteful feel
          const duration = 8 + Math.random() * 12;
          return {
            id: `${prefix}-${i}`,
            // Randomize position across the plane
            left: `${i * 20 + Math.random() * 20}%`, 
            background: beamColors[Math.floor(Math.random() * beamColors.length)],
            duration: `${duration}s`,
            delay: `-${Math.random() * duration}s`,
          };
        });
      };

      setSides({
        top: generateSideBeams("top"),
        bottom: generateSideBeams("bottom"),
        left: generateSideBeams("left"),
        right: generateSideBeams("right"),
      });
    };

    generateBeams();
  }, [beamCount, beamColors]);

  return (
    <div 
      className={cn("relative w-full h-full overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100", className)} 
      {...props}
    >
      <style>{`
        @keyframes tunnel-beam-move {
          0% { top: 120%; opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.4; }
          100% { top: -20%; opacity: 0; }
        }
      `}</style>
      
      {/* 3D Scene with fade-to-darkness mask in the center */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          perspective: "120px", 
          transformStyle: "preserve-3d",
          maskImage: "radial-gradient(circle at center, transparent 15%, black 60%)",
          WebkitMaskImage: "radial-gradient(circle at center, transparent 15%, black 60%)"
        }}
      >
        {/* Top */}
        <div 
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[200vw] h-[150vh] origin-top"
          style={{ transform: "rotateX(-90deg)", transformStyle: "preserve-3d" }}
        >
          <Grid sideBeams={sides.top} />
        </div>
        
        {/* Bottom */}
        <div 
          className="absolute left-1/2 top-full -translate-x-1/2 w-[200vw] h-[150vh] origin-top"
          style={{ transform: "rotateX(-90deg)", transformStyle: "preserve-3d" }}
        >
          <Grid sideBeams={sides.bottom} />
        </div>

        {/* Left */}
        <div 
          className="absolute top-1/2 left-0 -translate-y-1/2 w-[200vh] h-[150vw] origin-top-left"
          style={{ transform: "rotate(90deg) rotateX(-90deg)", transformStyle: "preserve-3d" }}
        >
          <Grid sideBeams={sides.left} />
        </div>

        {/* Right */}
        <div 
          className="absolute top-1/2 right-0 -translate-y-1/2 w-[200vh] h-[150vw] origin-top-right"
          style={{ transform: "rotate(-90deg) rotateX(-90deg)", transformStyle: "preserve-3d" }}
        >
          <Grid sideBeams={sides.right} />
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function Grid({ sideBeams }: { sideBeams: Beam[] }) {
  return (
    <div className="absolute inset-0 overflow-visible">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }}
      />
      
      {/* Animated Beams */}
      {sideBeams.map((beam) => (
        <div
          key={beam.id}
          className="absolute w-[2px] h-[15%] rounded-full opacity-0 blur-[1px]"
          style={{
            left: beam.left,
            background: beam.background,
            animation: `tunnel-beam-move ${beam.duration} ease-in-out infinite`,
            animationDelay: beam.delay,
          }}
        />
      ))}
    </div>
  );
}

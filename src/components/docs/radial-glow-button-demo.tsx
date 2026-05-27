"use client";

import React from "react";
import { RadialGlowButton } from "@/components/ui/radial-glow-button";

export function RadialGlowButtonDemo() {
  return (
    <div className="flex w-full h-[400px] flex-col items-center justify-center bg-[#0d0914] rounded-xl overflow-hidden">
      <RadialGlowButton>
        Get Extension
      </RadialGlowButton>
    </div>
  );
}

export default RadialGlowButtonDemo;

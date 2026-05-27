"use client";

import React from "react";
import { ElasticStack } from "@/components/ui/elastic-stack";

export function ElasticStackDemo() {
  const items = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    content: i + 1,
  }));

  return (
    <div className="flex w-full h-[400px] flex-col items-center justify-center">
      <ElasticStack 
        items={items} 
        itemSize={70}
        overlap={35}
        pushForce={15}
      />
    </div>
  );
}

export default ElasticStackDemo;

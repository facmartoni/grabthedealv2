"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PrimaryButton({ text = "Scrape Marketplace" }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Button
      onClick={handleClick}
      className={`rounded-lg bg-[#1877F2] px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-[#1664D9] ${isAnimating ? "animate-wiggle" : ""}`}
    >
      {text}
    </Button>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export default function PrimaryButton({
  text = "Scrape Marketplace",
  onClick,
  disabled = false,
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { theme } = useTheme();

  const handleClick = (e) => {
    if (!disabled) {
      console.log("Button clicked"); // Debug log
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
      if (onClick) {
        onClick(e);
      }
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      className={`rounded-lg bg-[#1877F2] px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-[#1664D9] ${
        isAnimating ? "animate-wiggle" : ""
      } ${theme === "dark" ? "hover:bg-[#1664D9]" : "hover:bg-[#1664D9]"} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {text}
    </Button>
  );
}

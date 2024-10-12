"use client";

import { useTheme } from "@/components/theme-provider";
import { Loader2 } from "lucide-react";

export default function LoaderSpinner({ size = "medium", className = "" }) {
  const { theme } = useTheme();

  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2
        className={`animate-spin ${sizeClasses[size]} ${
          theme === "dark" ? "text-blue-400" : "text-blue-600"
        }`}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

"use client";

import { useTheme } from "@/components/theme-provider";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoaderSpinner({ size = "medium", className = "" }) {
  const { theme } = useTheme();
  const [systemTheme, setSystemTheme] = useState("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handler = (e) => setSystemTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2
        className={`animate-spin ${sizeClasses[size]} ${
          currentTheme === "dark" ? "text-blue-400" : "text-blue-600"
        }`}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

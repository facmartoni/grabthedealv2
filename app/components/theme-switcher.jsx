"use client";

import { useTheme } from "./theme-provider";
import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={`rounded-full p-2 ${
          theme === "light"
            ? "bg-gray-200 text-gray-900"
            : "bg-transparent text-gray-400"
        }`}
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Light mode</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={`rounded-full p-2 ${
          theme === "dark"
            ? "bg-gray-800 text-gray-200"
            : "bg-transparent text-gray-400"
        }`}
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Dark mode</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("system")}
        className={`rounded-full p-2 ${
          theme === "system"
            ? "bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-200"
            : "bg-transparent text-gray-400"
        }`}
      >
        <Laptop className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">System mode</span>
      </Button>
    </div>
  );
}

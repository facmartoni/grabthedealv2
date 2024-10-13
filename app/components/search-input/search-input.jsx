"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState, forwardRef } from "react";

const SearchInput = forwardRef(
  ({ label, placeholder, value, onChange, onKeyDown }, ref) => {
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

    return (
      <div className="mx-auto w-full max-w-[584px]">
        <Label
          htmlFor="search"
          className={`mb-2 block text-center text-base font-medium ${
            currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {label}
        </Label>
        <Input
          ref={ref}
          type="text"
          id="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className={`w-full min-w-[280px] rounded-full border-2 ${
            currentTheme === "dark"
              ? "border-gray-600 bg-gray-700 text-white"
              : "border-gray-300 bg-white text-black"
          } transition-[border-color] duration-200 ease-in-out focus:border-[#1877F2] focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:border-[#1877F2] focus-visible:ring-0 focus-visible:ring-offset-0`}
          placeholder={placeholder}
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export default SearchInput;

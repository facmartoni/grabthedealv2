"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState, forwardRef } from "react";

const CityDropdown = forwardRef(
  ({ data, isLoading = false, onSelect }, ref) => {
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

    const items = Array.isArray(data) ? data.slice(0, 5) : [];

    return (
      <div
        ref={ref}
        className={`absolute left-0 top-full z-10 w-full max-w-[584px] rounded-lg border ${
          currentTheme === "dark"
            ? "border-gray-600 bg-gray-800"
            : "border-gray-300 bg-white"
        } shadow-sm`}
      >
        <ScrollArea className="h-[200px]">
          {isLoading ? (
            <div
              className={
                currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
              }
            >
              Loading...
            </div>
          ) : items.length > 0 ? (
            items.map((item, index) => (
              <div
                key={index}
                className={`cursor-pointer border-b ${
                  currentTheme === "dark"
                    ? "border-gray-700 hover:bg-gray-700"
                    : "border-gray-200 hover:bg-gray-100"
                } p-2 last:border-b-0`}
                onClick={() => onSelect(item.firstValue, index)}
              >
                <p
                  className={`font-medium ${
                    currentTheme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {item.firstValue}
                </p>
                <p
                  className={`text-sm ${
                    currentTheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {item.secondValue}
                </p>
              </div>
            ))
          ) : (
            <div
              className={`p-2 text-center ${
                currentTheme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No items to display
            </div>
          )}
        </ScrollArea>
      </div>
    );
  },
);

CityDropdown.displayName = "CityDropdown";

export default CityDropdown;

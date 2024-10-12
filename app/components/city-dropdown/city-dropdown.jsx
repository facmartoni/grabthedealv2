"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/components/theme-provider";

export default function CityDropdown({ data, isLoading = false, onSelect }) {
  const { theme } = useTheme();
  console.log("CityDropdown render - data:", data, "isLoading:", isLoading);

  const items = Array.isArray(data) ? data.slice(0, 5) : [];

  return (
    <div
      className={`absolute left-0 top-full z-10 w-full max-w-[584px] rounded-lg border ${theme === "dark" ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"} shadow-sm`}
    >
      <ScrollArea className="h-[200px]">
        {isLoading ? (
          <div className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
            Loading...
          </div>
        ) : items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className={`cursor-pointer border-b ${theme === "dark" ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-100"} p-2 last:border-b-0`}
              onClick={() => onSelect(item.firstValue)}
            >
              <p
                className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
              >
                {item.firstValue}
              </p>
              <p
                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                {item.secondValue}
              </p>
            </div>
          ))
        ) : (
          <div
            className={`p-2 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            No items to display (Dropdown is visible)
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

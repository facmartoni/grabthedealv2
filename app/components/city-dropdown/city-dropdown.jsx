"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function CityDropdown({ data, isLoading = false, onSelect }) {
  console.log("CityDropdown render - data:", data, "isLoading:", isLoading);

  const items = Array.isArray(data) ? data.slice(0, 5) : [];

  return (
    <div className="absolute left-0 top-full z-10 w-full max-w-[584px] rounded-lg border border-gray-300 bg-white shadow-sm">
      <ScrollArea className="h-[200px]">
        {isLoading ? (
          <div>Loading...</div>
        ) : items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className="cursor-pointer border-b border-gray-200 p-2 last:border-b-0 hover:bg-gray-100"
              onClick={() => onSelect(item.firstValue)}
            >
              <p className="font-medium text-gray-800">{item.firstValue}</p>
              <p className="text-sm text-gray-500">{item.secondValue}</p>
            </div>
          ))
        ) : (
          <div className="p-2 text-center text-gray-500">
            No items to display (Dropdown is visible)
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

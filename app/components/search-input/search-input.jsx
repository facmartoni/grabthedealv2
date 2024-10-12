"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";

export default function SearchInput({
  label,
  placeholder,
  value,
  onChange,
  onKeyDown,
}) {
  const { theme } = useTheme();

  return (
    <div className="mx-auto w-full max-w-[584px]">
      <Label
        htmlFor="search"
        className={`mb-2 block text-center text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
      >
        {label}
      </Label>
      <Input
        type="text"
        id="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className={`w-full min-w-[280px] rounded-full border-2 ${theme === "dark" ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-black"} transition-[border-color] duration-200 ease-in-out focus:border-[#1877F2] focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:border-[#1877F2] focus-visible:ring-0 focus-visible:ring-offset-0`}
        placeholder={placeholder}
      />
    </div>
  );
}

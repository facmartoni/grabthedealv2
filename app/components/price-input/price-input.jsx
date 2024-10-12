import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function PriceInput({
  label = "Price",
  placeholder = "$0",
  value,
  onChange,
  disabled,
}) {
  return (
    <div className="w-full">
      <Label
        htmlFor="price"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </Label>
      <Input
        type="text"
        id="price"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border-2 border-gray-300 transition-[border-color] duration-200 ease-in-out focus:border-[#1877F2] focus:outline-none focus:ring-0"
        placeholder={placeholder}
        inputMode="decimal"
        aria-label={label}
        disabled={disabled}
      />
    </div>
  );
}

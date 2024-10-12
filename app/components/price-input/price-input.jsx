import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";

export default function PriceInput({
  label = "Price",
  placeholder = "$0",
  value,
  onChange,
  disabled,
}) {
  const { theme } = useTheme();

  return (
    <div className="w-full">
      <Label
        htmlFor="price"
        className={`mb-2 block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
      >
        {label}
      </Label>
      <Input
        type="text"
        id="price"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border-2 ring-offset-0 ${theme === "dark" ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-black"} transition-[border-color] duration-200 ease-in-out focus:border-[#1877F2] focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:border-[#1877F2] focus-visible:ring-0 focus-visible:ring-offset-0`}
        placeholder={placeholder}
        inputMode="decimal"
        aria-label={label}
        disabled={disabled}
      />
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SearchInput({
  label = "What item on Facebook Marketplace do you want alerts for?",
  placeholder = "Search for products, e.g., laptop, TV, phone",
}) {
  return (
    <div className="mx-auto w-full max-w-[584px]">
      <Label
        htmlFor="search"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </Label>
      <Input
        type="text"
        id="search"
        className="w-full min-w-[280px] rounded-full border-2 border-gray-300 transition-[border-color] duration-200 ease-in-out focus:border-[#1877F2] focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:border-[#1877F2] focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder={placeholder}
      />
    </div>
  );
}

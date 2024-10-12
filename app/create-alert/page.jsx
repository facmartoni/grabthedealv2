"use client";

import { useState, useEffect } from "react";
import SearchInput from "@/components/search-input/search-input";
import PriceInput from "@/components/price-input/price-input";
import PrimaryButton from "@/components/primary-button/primary-button";
import CityDropdown from "@/components/city-dropdown/city-dropdown";
import { searchCity } from "@/app/actions/search-city/search-city";
import { searchProducts } from "@/app/actions/search-products/search-products";

export default function AlertCreationPage() {
  const [product, setProduct] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [noPriceRange, setNoPriceRange] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleProductSearch = (value) => {
    setProduct(value);
  };

  const handleCitySearch = async (value) => {
    setCity(value);
    if (value) {
      setIsLoadingCities(true);
      const result = await searchCity(value, "false");
      setIsLoadingCities(false);
      console.log("Full search city result:", result);

      if (result.success && result.data && Array.isArray(result.data.data)) {
        console.log("Setting city options:", result.data.data);
        setCityOptions(result.data.data);
        setShowDropdown(true);
      } else {
        console.log("No valid city options received");
        setCityOptions([]);
        setShowDropdown(false);
      }
    } else {
      setCityOptions([]);
      setShowDropdown(false);
    }
  };

  const handleCitySelect = async (selectedCity) => {
    setIsLoadingCities(true);
    const result = await searchCity(selectedCity, "true");
    setIsLoadingCities(false);
    if (result.success) {
      setCity(result.data.city);
      setCityOptions([]);
      setShowDropdown(false);
    }
  };

  const handleCreateAlert = async () => {
    const result = await searchProducts(
      city,
      product,
      noPriceRange ? 0 : minPrice.replace("$", ""),
      noPriceRange ? 1000000 : maxPrice.replace("$", ""),
      10,
      30,
    );
    setSearchResult(result);
  };

  const handleCityInputKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Enter pressed, searching for:", city); // Debug log
      await handleCitySearch(city);
    }
  };

  // Add this inside the AlertCreationPage component
  console.log("City options:", cityOptions); // Debugging line

  useEffect(() => {
    console.log("cityOptions updated:", cityOptions);
  }, [cityOptions]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto flex max-w-[584px] flex-col items-center space-y-6 p-4">
        <div className="w-full">
          <SearchInput
            label="What item on Facebook Marketplace do you want alerts for?"
            placeholder="Search for products, e.g., laptop, TV, phone"
            onChange={handleProductSearch}
          />
        </div>

        <div className="relative w-full">
          <SearchInput
            label="Enter your city"
            placeholder="Type your city, e.g., Chicago, Berlin, Madrid"
            value={city}
            onChange={(value) => setCity(value)}
            onKeyDown={handleCityInputKeyDown}
          />
          {showDropdown && (cityOptions.length > 0 || isLoadingCities) && (
            <CityDropdown
              data={cityOptions}
              isLoading={isLoadingCities}
              onSelect={handleCitySelect}
            />
          )}
        </div>

        <div className="w-full">
          <div className="flex items-end justify-between space-x-2">
            <div className="flex-1">
              <PriceInput
                label="Min Price"
                placeholder="$0"
                value={minPrice}
                onChange={setMinPrice}
                disabled={noPriceRange}
              />
            </div>
            <div className="flex-1">
              <PriceInput
                label="Max Price"
                placeholder="$0"
                value={maxPrice}
                onChange={setMaxPrice}
                disabled={noPriceRange}
              />
            </div>
            <div className="flex flex-1 flex-col justify-end">
              <label
                htmlFor="noPriceRange"
                className="flex h-10 cursor-pointer items-center justify-center text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  id="noPriceRange"
                  checked={noPriceRange}
                  onChange={(e) => setNoPriceRange(e.target.checked)}
                  className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
                Do not set a price range
              </label>
            </div>
          </div>
        </div>

        <div>
          <PrimaryButton text="Create Alert" onClick={handleCreateAlert} />
        </div>

        {searchResult && (
          <div className="mt-4 w-full rounded-md bg-gray-100 p-4">
            <h2 className="mb-2 text-lg font-semibold">Search Result:</h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(searchResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

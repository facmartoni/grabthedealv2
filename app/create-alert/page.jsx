"use client";

import { useState } from "react";
import SearchInput from "@/components/search-input/search-input";
import PriceInput from "@/components/price-input/price-input";
import PrimaryButton from "@/components/primary-button/primary-button";
import CityDropdown from "@/components/city-dropdown/city-dropdown";
import { searchCity } from "@/app/actions/search-city/search-city";
import { searchProducts } from "@/app/actions/search-products/search-products";
import ThemeSwitch from "@/components/theme-switch";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import LoaderSpinner from "@/components/loader-spinner/loader-spinner";

function AlertCreationPageContent() {
  const { theme } = useTheme();
  const [product, setProduct] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [noPriceRange, setNoPriceRange] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [finalCity, setFinalCity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false); // Added state for loading spinner

  const handleProductSearch = (value) => {
    setProduct(value);
  };

  const handleCitySearch = async (value) => {
    setCity(value);
    if (value) {
      setIsLoadingCities(true);
      const result = await searchCity(value, "false");
      setIsLoadingCities(false);

      if (result.success && result.data) {
        setCityOptions(result.data.data);
        setShowDropdown(true);
      } else {
        setCityOptions([]);
        setShowDropdown(false);
      }
    } else {
      setCityOptions([]);
      setShowDropdown(false);
    }
  };

  const handleCitySelect = async (selectedCity) => {
    console.log("Selected city:", selectedCity);
    setCity(selectedCity);
    setShowDropdown(false);
    setCityOptions([]);

    setIsLoadingCities(true);
    console.log("Loading cities for:", selectedCity.slice(0, -1));
    const result = await searchCity(selectedCity, "true");
    setIsLoadingCities(false);

    if (result.success && result.data) {
      console.log("City search result:", result.data.data);
      setFinalCity(result.data.data);
    } else {
      console.log("City search failed:", result.error);
      setFinalCity("");
    }
  };

  const handleCreateAlert = async () => {
    if (!finalCity || !product) {
      setErrorMessage(
        "Please select a city from the dropdown and enter a product to search for.",
      );
      return;
    }

    setErrorMessage(""); // Clear error message if validation passes
    setIsSearching(true); // Set loading state to true

    try {
      const minPriceValue = noPriceRange
        ? 0
        : parseFloat(minPrice.replace("$", "")) || 0;
      const maxPriceValue = noPriceRange
        ? 1000000
        : parseFloat(maxPrice.replace("$", "")) || 1000000;

      console.log("Search parameters:", {
        city: finalCity, // Use finalCity here
        product,
        minPrice: minPriceValue,
        maxPrice: maxPriceValue,
        productLimit: 10,
        daysSinceListed: 30,
      });

      const result = await searchProducts(
        finalCity,
        product,
        minPriceValue,
        maxPriceValue,
        10,
        30,
      );

      console.log("Search result:", result); // Log the response

      if (result.success) {
        setSearchResult(result.data);
      } else {
        throw new Error(result.error || "Failed to search products");
      }
    } catch (error) {
      setErrorMessage(
        "An error occurred while searching for products. Please try again.",
      );
    } finally {
      setIsSearching(false); // Reset loading state
    }
  };

  const handleCityInputKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsLoadingCities(true); // Set loading state to true
      await handleCitySearch(city);
      setIsLoadingCities(false); // Reset loading state after search
    }
  };

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
    >
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
              <div className="mt-2">
                {isLoadingCities ? ( // Show loading spinner if cities are loading
                  <LoaderSpinner size="large" />
                ) : (
                  <CityDropdown
                    data={cityOptions}
                    onSelect={handleCitySelect}
                  />
                )}
              </div>
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
                  className={`flex h-10 cursor-pointer items-center justify-center text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
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

          {errorMessage && (
            <div className="mb-2 w-full text-sm text-red-500">
              {errorMessage}
            </div>
          )}

          <div>
            {isSearching ? ( // Conditional rendering for loading spinner
              <LoaderSpinner size="medium" />
            ) : (
              <PrimaryButton text="Create Alert" onClick={handleCreateAlert} />
            )}
          </div>

          {searchResult && (
            <div
              className={`mt-4 w-full rounded-md p-4 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
            >
              <h2 className="mb-2 text-lg font-semibold">Search Result:</h2>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(searchResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AlertCreationPage() {
  return (
    <ThemeProvider>
      <div className="relative">
        <div className="absolute right-4 top-4 z-10">
          <ThemeSwitch />
        </div>
        <AlertCreationPageContent />
      </div>
    </ThemeProvider>
  );
}

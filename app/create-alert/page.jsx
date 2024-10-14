"use client";

import { useState, useEffect, useRef } from "react";
import SearchInput from "@/components/search-input/search-input";
import PriceInput from "@/components/price-input/price-input";
import PrimaryButton from "@/components/primary-button/primary-button";
import CityDropdown from "@/components/city-dropdown/city-dropdown";
import { searchCity } from "@/app/actions/search-city/search-city";
import ThemeSwitcher from "@/components/theme-switcher"; // Change to ThemeSwitcher
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import LoaderSpinner from "@/components/loader-spinner/loader-spinner"; // Change to LoaderSpinner from "@/components/loader/loader-spinner";
import ProductResult from "@/components/products-result/product-result";
import { Button } from "@/components/ui/button";

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
  const [systemTheme, setSystemTheme] = useState("light"); // Ensure this is the only instance of systemTheme
  const [showCityInput, setShowCityInput] = useState(false); // New state variable for city input visibility
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false); // New state variable for additional inputs visibility
  const productInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const minPriceInputRef = useRef(null);
  const maxPriceInputRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const [searchParams, setSearchParams] = useState(null);
  const [noCitiesFound, setNoCitiesFound] = useState(false);

  useEffect(() => {
    // Added useEffect for theme detection
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handler = (e) => setSystemTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme; // Determine current theme

  const handleProductSearch = (value) => {
    setProduct(value);
  };

  const handleCitySearch = async (value) => {
    setCity(value);
    setNoCitiesFound(false);
    if (value) {
      try {
        setIsLoadingCities(true);
        const result = await searchCity(value, "false");
        if (
          result.success &&
          result.data.data &&
          result.data.data.status === 404
        ) {
          setCityOptions([]);
          setNoCitiesFound(true);
        } else {
          setCityOptions(
            result.success && result.data.data ? result.data.data : [],
          );
        }
      } catch (error) {
        console.error("Error searching city:", error);
        setCityOptions([]);
      } finally {
        setIsLoadingCities(false);
      }
    } else {
      setCityOptions([]);
      setShowDropdown(false);
    }
  };

  const handleCitySelect = async (selectedCity, nSelection) => {
    setShowDropdown(false);
    setCityOptions([]);

    setIsLoadingCities(true);
    try {
      let result;
      let startTime = Date.now();
      do {
        result = await searchCity(city, "true", nSelection);
        setCity(selectedCity);
        if (Date.now() - startTime > 3000) {
          startTime = Date.now();
        }
      } while (
        (result.success === false || result.data.data === "unknown") &&
        Date.now() - startTime <= 3000
      );

      if (result.success && result.data) {
        setFinalCity(result.data.data);
        setShowAdditionalInputs(true);
        requestAnimationFrame(() => {
          minPriceInputRef.current?.focus();
        });
      } else {
        setFinalCity("");
        cityInputRef.current?.focus();
      }
    } catch (error) {
      console.error("Error selecting city:", error);
    } finally {
      setIsLoadingCities(false);
    }
  };

  const handleCreateAlert = async () => {
    if (!finalCity || !product) {
      setErrorMessage(
        "Please select a city from the dropdown and enter a product to search for.",
      );
      return;
    }

    setErrorMessage("");
    const minPriceValue = noPriceRange
      ? 0
      : parseFloat(minPrice.replace("$", "")) || 0;
    const maxPriceValue = noPriceRange
      ? 1000000
      : parseFloat(maxPrice.replace("$", "")) || 1000000;

    setSearchParams({
      city: finalCity,
      product,
      minPrice: minPriceValue,
      maxPrice: maxPriceValue,
    });
  };

  const handleCityInputKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsLoadingCities(true);
      setShowDropdown(true);
      await handleCitySearch(e.target.value);
      if (showAdditionalInputs) {
        minPriceInputRef.current?.focus();
      }
    }
  };

  const handleProductKeyDown = (e) => {
    if (e.key === "Enter" && product.trim() !== "") {
      e.preventDefault();
      setShowCityInput(true);
      setTimeout(() => cityInputRef.current?.focus(), 0);
    }
  };

  const handleMinPriceKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      maxPriceInputRef.current?.focus();
    }
  };

  const handleMaxPriceKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateAlert();
    }
  };

  const handleBackToSearch = () => {
    setSearchParams(null);
  };

  const handleContinue = () => {
    // TODO: Implement continue functionality
    console.log("Continue button clicked");
  };

  return (
    <div
      className={`min-h-screen ${currentTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
    >
      {searchParams ? (
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 mt-12 text-center text-2xl font-bold">
            Is this what you are searching for?
          </h1>
          <div className="mb-6 flex justify-center space-x-4">
            <Button
              onClick={handleContinue}
              className="bg-green-500 hover:bg-green-600"
            >
              Yes, Continue
            </Button>
            <Button
              onClick={handleBackToSearch}
              className="bg-red-500 hover:bg-red-600"
            >
              No, Back to Search
            </Button>
          </div>
          <ProductResult searchParams={searchParams} />
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <div className="mx-auto flex w-full max-w-[584px] flex-col items-center space-y-6 p-4">
            <div className="w-full">
              <SearchInput
                label="What item on Facebook Marketplace do you want alerts for?"
                placeholder="Search for products, e.g., laptop, TV, phone"
                onChange={handleProductSearch}
                onKeyDown={handleProductKeyDown}
                value={product}
                ref={productInputRef}
              />
            </div>

            {showCityInput && (
              <div className="relative w-full transition-all duration-300 ease-in-out">
                <SearchInput
                  label="Enter your city"
                  placeholder="Type your city, e.g., Chicago, Berlin, Madrid"
                  value={city}
                  onChange={(value) => setCity(value)}
                  onKeyDown={handleCityInputKeyDown}
                  ref={cityInputRef}
                />
                {noCitiesFound && (
                  <div className="mt-2 text-sm text-red-500">
                    No cities found. Please try a different search.
                  </div>
                )}
                {(isLoadingCities || cityOptions.length > 0) && (
                  <div className="mt-2">
                    {isLoadingCities ? (
                      <LoaderSpinner size="large" />
                    ) : (
                      <CityDropdown
                        ref={cityDropdownRef}
                        data={cityOptions}
                        onSelect={(city, index) =>
                          handleCitySelect(city, index)
                        }
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {showAdditionalInputs && ( // Conditional rendering for additional inputs
              <div className="w-full space-y-4 transition-all duration-300 ease-in-out">
                <div className="flex items-end justify-between space-x-2">
                  <div className="flex-1">
                    <PriceInput
                      label="Min Price"
                      placeholder="$0"
                      value={minPrice}
                      onChange={setMinPrice}
                      disabled={noPriceRange}
                      onKeyDown={handleMinPriceKeyDown}
                      ref={minPriceInputRef}
                    />
                  </div>
                  <div className="flex-1">
                    <PriceInput
                      label="Max Price"
                      placeholder="$0"
                      value={maxPrice}
                      onChange={setMaxPrice}
                      disabled={noPriceRange}
                      ref={maxPriceInputRef}
                      onKeyDown={handleMaxPriceKeyDown}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-end">
                    <label
                      htmlFor="noPriceRange"
                      className={`flex h-10 cursor-pointer items-center justify-center text-sm ${
                        currentTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700"
                      }`}
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

                {errorMessage && (
                  <div className="mb-2 w-full text-sm text-red-500">
                    {errorMessage}
                  </div>
                )}

                <div className="flex justify-center pt-4">
                  <PrimaryButton
                    text="Create Alert"
                    onClick={handleCreateAlert}
                    disabled={isLoadingCities}
                  />
                </div>
              </div>
            )}

            {searchResult && (
              <div
                className={`mt-4 w-full rounded-md p-4 ${currentTheme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
              >
                <h2 className="mb-2 text-lg font-semibold">Search Result:</h2>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(searchResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AlertCreationPage() {
  return (
    <ThemeProvider>
      <div className="relative">
        <div className="absolute right-4 top-4 z-10">
          <ThemeSwitcher />
        </div>
        <AlertCreationPageContent />
      </div>
    </ThemeProvider>
  );
}

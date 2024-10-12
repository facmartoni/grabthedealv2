"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { searchProducts } from "@/app/actions/search-products/search-products";

export default function ProductResult({ searchParams }) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { city, product, minPrice, maxPrice } = searchParams;
        const result = await searchProducts(
          city,
          product,
          minPrice,
          maxPrice,
          10,
          30,
        );
        if (result.success) {
          console.log("Server response:", result);
          setProductData(result.data.data);
        } else {
          throw new Error(result.error || "Failed to search products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(
          "An error occurred while searching for products. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {isLoading ? (
          Array(6)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full bg-gray-200 dark:bg-gray-700" />
                <CardContent className="space-y-2 p-4">
                  <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700" />
                </CardContent>
              </Card>
            ))
        ) : productData.length > 0 ? (
          productData.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <img
                src={product.imgUrl}
                alt={product.title || "Product"}
                className="h-48 w-full object-cover"
              />
              <CardContent className="p-4">
                <h3 className="truncate font-semibold">
                  {product.title || "Untitled Product"}
                </h3>
                <p
                  className={`text-lg font-bold ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {product.price}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {product.city}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-8 text-center">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              No products found.
            </p>
          </div>
        )}
      </div>
      {error && <div className="mt-4 text-center text-red-500">{error}</div>}
    </div>
  );
}

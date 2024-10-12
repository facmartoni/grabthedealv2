"use server";

import { z } from "zod";

const searchProductsSchema = z.object({
  city: z.string().min(1),
  searchTerm: z.string().min(1),
  minPrice: z.number().nonnegative().default(0),
  maxPrice: z.number().positive().default(1000000),
  productLimit: z.number().int().min(0).max(30),
  daysSinceListed: z
    .number()
    .int()
    .refine((val) => [1, 7, 30].includes(val), {
      message: "daysSinceListed must be 1, 7, or 30",
    }),
});

export async function searchProducts(
  city,
  searchTerm,
  minPrice,
  maxPrice,
  productLimit,
  daysSinceListed,
) {
  try {
    // Validate input
    const validatedInput = searchProductsSchema.parse({
      city,
      searchTerm,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      productLimit: Number(productLimit),
      daysSinceListed: Number(daysSinceListed),
    });

    // Make sure BOM_SERVER_URL is defined
    if (!process.env.BOM_SERVER_URL) {
      throw new Error("BOM_SERVER_URL is not defined in environment variables");
    }

    const response = await fetch(
      `${process.env.BOM_SERVER_URL}/search-products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: validatedInput.city,
          searchTerm: validatedInput.searchTerm,
          minPrice: validatedInput.minPrice,
          maxPrice: validatedInput.maxPrice,
          productLimit: validatedInput.productLimit,
          daysSinceListed: validatedInput.daysSinceListed,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error in searchProducts action:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid input data",
        details: error.errors,
      };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

"use server";

import { z } from "zod";

const searchCitySchema = z.object({
  city: z.string().min(1),
  sure: z.enum(["true", "false"]),
  nSelection: z.number().int().min(0).max(4).optional(),
});

export async function searchCity(city, sure, nSelection) {
  try {
    // Validate input
    const validatedInput = searchCitySchema.parse({ city, sure, nSelection });

    // Make sure BOM_SERVER_URL is defined
    if (!process.env.BOM_SERVER_URL) {
      throw new Error("BOM_SERVER_URL is not defined");
    }

    const requestBody = JSON.stringify({
      city: validatedInput.city,
      sure: validatedInput.sure,
      nSelection: validatedInput.nSelection,
    });

    console.log("Request to server:", requestBody);

    const response = await fetch(`${process.env.BOM_SERVER_URL}/search-city`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Server response:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error in searchCity action:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input data" };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

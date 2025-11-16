import { PropertySearchFilters, PropertySearchResponse } from "@/types/property";

export default async function getProperties(
  filters: PropertySearchFilters
): Promise<PropertySearchResponse> {
  const baseUrl = process.env.APP_ADDRESS || "https://roomie-finder-api-316466908775.asia-southeast1.run.app";
  
  // Build query string
  const params = new URLSearchParams();
  
  if (filters.name) params.append("name", filters.name);
  if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
  if (filters.propertyType) params.append("propertyType", filters.propertyType);
  if (filters.maxCapacity) params.append("maxCapacity", filters.maxCapacity.toString());
  if (filters.minCapacity) params.append("minCapacity", filters.minCapacity.toString());
  if (filters.minRoomSize) params.append("minRoomSize", filters.minRoomSize.toString());
  if (filters.maxRoomSize) params.append("maxRoomSize", filters.maxRoomSize.toString());
  if (filters.province) params.append("province", filters.province);
  if (filters.district) params.append("district", filters.district);
  if (filters.subDistrict) params.append("subDistrict", filters.subDistrict);
  
  params.append("page", filters.page.toString());
  params.append("limit", filters.limit.toString());

  const response = await fetch(`${baseUrl}/properties/search?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }

  return response.json();
}
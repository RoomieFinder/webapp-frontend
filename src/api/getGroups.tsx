import { SearchFilters, SearchGroupResponse } from "@/types/group";

// API Function
export default async function getGroups(filters: SearchFilters): Promise<SearchGroupResponse> {
  const baseUrl = process.env.APP_ADDRESS || "http://localhost:8080";
  const queryParams = new URLSearchParams();
  
  if (filters.name) {
    queryParams.append("name", filters.name);
  }
  if (filters.genderRestriction) {
      queryParams.append("genderRestriction", filters.genderRestriction);
  }
  if (filters.hobbies && filters.hobbies.length > 0) {
    filters.hobbies.forEach(hobby => queryParams.append("hobbies", hobby));
  }
  if (filters.rentInProperties && filters.rentInProperties.length > 0) {
    filters.rentInProperties.forEach(prop => queryParams.append("rentInProperties", prop));
  }
  queryParams.append("page", "1");
  queryParams.append("limit", "10");
  
  const url = `${baseUrl}/group/search?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}
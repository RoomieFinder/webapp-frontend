// src/config/api.ts
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

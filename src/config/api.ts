// src/config/api.ts
export const BASE_URL =
  process.env.APP_ADDRESS || "http://localhost:8080";

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

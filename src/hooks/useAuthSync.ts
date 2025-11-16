"use client";

import { useEffect } from "react";

/**
 * Syncs auth token from localStorage to cookie on client-side
 * This is needed when using cross-origin API where the backend can't set cookies
 * that are accessible to the frontend domain
 */
export function useAuthSync() {
  useEffect(() => {
    // On mount, check if we have a token in localStorage but not in cookie
    const token = localStorage.getItem("auth_token");
    
    if (token) {
      // Check if cookie already exists
      const hasCookie = document.cookie.split('; ').some(row => row.startsWith('auth_token='));
      
      if (!hasCookie) {
        // Set cookie from localStorage
        document.cookie = `auth_token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`;
        console.log("Auth token synced from localStorage to cookie");
      }
    }
  }, []);
}

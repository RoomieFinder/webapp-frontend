export async function getUser(id: string) {
  const baseUrl = process.env.APP_ADDRESS || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/user/userProfile/${id}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return await res.json();
}

export async function getUserCookie() {
  const baseUrl = process.env.APP_ADDRESS || "https://roomie-finder-api-316466908775.asia-southeast1.run.app" || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return await res.json();
}
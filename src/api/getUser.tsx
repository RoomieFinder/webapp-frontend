export async function getUser(id: string, token: string) {
  const baseUrl = process.env.APP_ADDRESS || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/user/userProfile/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return await res.json();
}
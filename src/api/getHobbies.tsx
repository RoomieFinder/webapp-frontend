export default async function fetchAllHobbies() {
  const baseUrl = process.env.APP_ADDRESS || "http://localhost:8080";
  try {
    const res = await fetch(`${baseUrl}/hobby`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to fetch hobbies");
    const json = await res.json();
    return json;
  } catch (err) {
    console.error("Error fetching hobbies:", err);
    return null;
  }
}
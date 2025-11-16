export default async function fetchAllHobbies() {
  try {
    const baseUrl = process.env.APP_ADDRESS || "https://roomie-finder-api-316466908775.asia-southeast1.run.app";
    const res = await fetch(`${baseUrl}/hobby`);
    const data = await res.json();

    if (data.success) {
      return data.data; // array of hobbies from backend
    }
    return [];
  } catch (err) {
    console.error("Error fetching hobbies:", err);
    return [];
  }
}

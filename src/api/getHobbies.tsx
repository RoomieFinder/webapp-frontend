export default async function fetchAllHobbies() {
<<<<<<< Updated upstream
  try {
    const baseUrl = process.env.APP_ADDRESS || "http://localhost:8080";
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
=======
      try {
        const res = await fetch("https://roomie-finder-api-316466908775.asia-southeast1.run.app/hobby" || "http://localhost:8080/hobby");
        const data = await res.json();
        if (data.success) {
          setAllHobbies(data.data); // array of hobbies from backend
        }
      } catch (err) {
        console.error("Error fetching hobbies:", err);
      }
    };
>>>>>>> Stashed changes

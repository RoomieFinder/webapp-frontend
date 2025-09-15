export default async function fetchAllHobbies() {
      try {
        const res = await fetch("http://localhost:8080/hobby");
        const data = await res.json();
        if (data.success) {
          setAllHobbies(data.data); // array of hobbies from backend
        }
      } catch (err) {
        console.error("Error fetching hobbies:", err);
      }
    };
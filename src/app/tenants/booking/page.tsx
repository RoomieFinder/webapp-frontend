"use client";

import SearchBar from "@/components/ui/SearchBar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Property {
  id: number;
  placeName: string;
  caption: string;
  type: string;
  rentalFee: number;
  capacity: number;
  roomSize: number;
  description: string;
  pictures: string[]; // เพราะ API ส่ง array ของ string
  subDistrictName: string;
  districtName: string;
  provinceName: string;
  isPreferred?: boolean;
}

export default function BookingPage() {
  const [duration, setDuration] = useState("");
  const [bookingType, setBookingType] = useState<"myself" | "group">("myself");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [property, setProperty] = useState<Property | null>(null);
  const [isPreferred, setIsPreferred] = useState<boolean>(false);
  const [isBooked, setIsBooked] = useState(false);
  const [prefLoading, setPrefLoading] = useState(false);

  // pid taken from query param ?pid=123
  const searchParams = useSearchParams();
  const pidParam = searchParams?.get("pid");
  const pid = pidParam ? parseInt(pidParam, 10) : null;

  // Callback สำหรับ search box
  const handleSearch = (query: string) => {
    console.log("Search:", query);
    setSearchQuery(query);
  };

  // Callback สำหรับ filter dropdown
  const handleFilter = (filter: string) => {
    console.log("Filter:", filter);
    setFilterValue(filter);
  };

  // Fetch property data
  useEffect(() => {
    // no gid required for groups/preferred-property API

    const fetchProperty = async () => {
      if (!pid) return;
      try {
        const res = await fetch(`http://localhost:8080/property/${pid}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        // console.log("datap", data);
        const p: Property = data.property;
        setIsPreferred(Boolean(p.isPreferred));
        // // ถ้าอยาก Override
        // const p: Property = data.property;
        // setProperty({
        //   ...p,
        //   Caption: p.Caption || "",
        //   Type: p.Type || "",
        //   Pictures: p.Pictures || [],
        // });

        setProperty(p);
      } catch (error) {
        console.error("Failed to fetch property:", error);
      }
    };

    fetchProperty();
  }, [pid]);

  // ฟังก์ชัน submit booking
  const handleBooking = async () => {
    if (isBooked) return; // ป้องกันกดซ้ำ
    if (!pid) return alert("Property id missing");

    try {
      // setIsBooked(true);

      const res = await fetch(
        `http://localhost:8080/group/booking/request/${pid}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   duration,
          //   bookingType,
          // }),
        }
      );

      if (!res.ok) throw new Error("Booking failed");

      const data = await res.json();
      console.log("Booking success:", data);
      alert("Booking request sent! Pending approval.");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed. See console for details.");
      setIsBooked(false); // ถ้าเกิด error ให้ปุ่มกดได้อีกครั้ง
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F1B2D] text-black">
      {/* TopBar / SearchBar */}
      <SearchBar onSearch={handleSearch} onFilter={handleFilter} />

      {/* Content */}
      <div className="flex flex-1 p-4 gap-4">
        {/* Left side: Booking detail */}
        <div className="flex-1 bg-white rounded-2xl p-6 overflow-y-auto ml-[62px]">
          <button
            style={{
              background: "none",
              border: "none",
              fontSize: 32,
              fontWeight: 300,
              cursor: "pointer",
              color: "#1D2D44",
              padding: 0,
            }}
            aria-label="Back"
          >
            &#60;
          </button>

          <h2 className="text-2xl font-bold my-4">
            Booking{" "}
            <span className="ml-6 mr-4">{property ? property.placeName : "Loading..."}</span>
            {/* Bookmark / prefer toggle */}
            <button
              aria-label="Toggle preferred"
              disabled={prefLoading}
              onClick={async () => {
                if (!property || prefLoading) return;
                // optimistic update
                const prev = isPreferred;
                setIsPreferred(!prev);
                setPrefLoading(true);
                try {
                  const url = `http://localhost:8080/group/preferred-property/${property.id}`;
                  const method = !prev ? "POST" : "DELETE";
                  const res = await fetch(url, { method, credentials: "include" });
                  const text = await res.text();
                  let data: any = null;
                  try { data = text ? JSON.parse(text) : null; } catch (e) { /* ignore non-json */ }
                  if (!res.ok) {
                    const msg = (data && (data.message || data.error)) || text || `Request failed (${res.status})`;
                    throw new Error(msg);
                  }
                } catch (err: any) {
                  console.error("Failed to toggle preferred", err);
                  setIsPreferred(prev); // revert
                  alert(err?.message || "Failed to update preferred list. Try again.");
                } finally {
                  setPrefLoading(false);
                }
              }}
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isPreferred ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              {/* simple bookmark icon (SVG) */}
              {isPreferred ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v12l7-4 7 4V5a2 2 0 00-2-2H5z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 3a2 2 0 00-2 2v14l9-5 9 5V5a2 2 0 00-2-2H5z" />
                </svg>
              )}
            </button>
          </h2>

          {/* Pictures */}
          <div className="flex gap-2 mb-4">
            {property?.pictures.map((pic, i) => (
              <div key={i} className="w-1/3 h-100 relative">
                <Image
                  src={pic}
                  alt={`property-${property.placeName}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}

            {!property?.pictures?.length &&
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1/3 h-40 bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  No Image
                </div>
              ))}
          </div>

          <h3 className="text-xl font-semibold mb-2">Description</h3>
          <p className="text-gray-700">
            {property ? property.description : "Loading description..."}
          </p>
        </div>

        {/* Right side: Booking info */}
        <div className="w-1/3 bg-white rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-4">Booking Info</h3>

            {/* <div className="mb-4">
              <label className="block text-gray-600 mb-2">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration"
                className="w-full rounded-[16px] border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div> */}

            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Booking by</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setBookingType("myself")}
                  className={`px-4 py-2 rounded-[16px] w-1/2 ${bookingType === "myself"
                    ? "bg-[#445C7B] text-white"
                    : "bg-gray-100 text-gray-600 hover:cursor-pointer"
                    }`}
                >
                  By Myself
                </button>
                <button
                  onClick={() => setBookingType("group")}
                  className={`px-4 py-2 rounded-[16px] w-1/2 ${bookingType === "group"
                    ? "bg-[#445C7B] text-white"
                    : "bg-gray-100 text-gray-600 hover:cursor-pointer"
                    }`}
                >
                  With Group
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={isBooked} // ปุ่ม disabled หลัง submit
            className={`mx-auto mt-6 w-1/3 ${isBooked
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#F0EBD8] hover:bg-[#E0DBC8] hover:cursor-pointer"
              } text-black font-medium py-2 rounded-[16px] transition`}
          >
            {isBooked ? "Pending..." : "Book"}
          </button>
        </div>
      </div>
    </div>
  );
}

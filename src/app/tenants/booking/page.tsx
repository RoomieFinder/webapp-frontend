"use client";

import SearchBar from "@/components/ui/SearchBar";
import Image from "next/image";
import { useState, useEffect } from "react";

interface PropertyPicture {
  Key: string;
  Link: string;
}

interface Property {
  PlaceName: string;
  Caption: string;
  Type: string;
  Address: string;
  Description: string;
  RentalFee: number;
  Capacity: number;
  RoomSize: number;
  Pictures: PropertyPicture[];
}

export default function BookingPage() {
  const [duration, setDuration] = useState("");
  const [bookingType, setBookingType] = useState<"myself" | "group">("myself");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [property, setProperty] = useState<Property | null>(null);
  const [isBooked, setIsBooked] = useState(false)

  // ตัวแปร pid สำหรับ API
  const pid = 3;

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
    const fetchProperty = async () => {
      try {
        const res = await fetch(`http://localhost:8080/property/${pid}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        setProperty(data.property);
      } catch (error) {
        console.error("Failed to fetch property:", error);
      }
    };

    fetchProperty();
  }, [pid]);

  // ฟังก์ชัน submit booking
  const handleBooking = async () => {
    if (isBooked) return; // ป้องกันกดซ้ำ

    try {
      // setIsBooked(true);

      const res = await fetch(`http://localhost:8080/group/booking/request/${pid}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({
        //   duration,
        //   bookingType,
        // }),
      });

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
            <span className="ml-2">{property ? property.PlaceName : "Loading..."}</span>
          </h2>

          {/* Pictures */}
          <div className="flex gap-2 mb-4">
            {property?.Pictures.map((pic) => (
              <div key={pic.Key} className="w-1/3 h-100 relative">
                <Image src={pic.Link} alt={`property-${pic.Key}`} fill className="object-cover rounded-lg" />
              </div>
            ))}

            {!property?.Pictures?.length &&
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
          <p className="text-gray-700">{property ? property.Description : "Loading description..."}</p>
        </div>

        {/* Right side: Booking info */}
        <div className="w-1/3 bg-white rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-4">Booking Info</h3>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration"
                className="w-full rounded-[16px] border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Booking by</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setBookingType("myself")}
                  className={`px-4 py-2 rounded-[16px] w-1/2 ${
                    bookingType === "myself"
                      ? "bg-[#445C7B] text-white"
                      : "bg-gray-100 text-gray-600 hover:cursor-pointer"
                  }`}
                >
                  By Myself
                </button>
                <button
                  onClick={() => setBookingType("group")}
                  className={`px-4 py-2 rounded-[16px] w-1/2 ${
                    bookingType === "group"
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
            className={`mx-auto mt-6 w-1/3 ${
              isBooked ? "bg-gray-400 cursor-not-allowed" : "bg-[#F0EBD8] hover:bg-[#E0DBC8] hover:cursor-pointer"
            } text-black font-medium py-2 rounded-[16px] transition`}
          >
            {isBooked ? "Pending..." : "Book"}
          </button>
        </div>
      </div>
    </div>
  );
}

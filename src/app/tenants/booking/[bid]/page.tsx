"use client";

import SearchBar from "@/components/ui/SearchBar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import TopBar from "@/components/ui/TopBar";

interface Property {
  id: number;
  placeName: string;
  caption: string;
  type: string;
  rentalFee: number;
  capacity: number;
  roomSize: number;
  description: string;
  pictures: string[];
  subDistrictName: string;
  districtName: string;
  provinceName: string;
  isPreferred?: boolean;
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bid = params?.bid ? parseInt(params.bid as string, 10) : null;

  const [duration, setDuration] = useState("");
  const [bookingType, setBookingType] = useState<"myself" | "group">("myself");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [property, setProperty] = useState<Property | null>(null);
  const [isPreferred, setIsPreferred] = useState<boolean>(false);
  const [isBooked, setIsBooked] = useState(false);
  const [prefLoading, setPrefLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Callback for search box
  const handleSearch = (query: string) => {
    console.log("Search:", query);
    setSearchQuery(query);
  };

  // Callback for filter dropdown
  const handleFilter = (filter: string) => {
    console.log("Filter:", filter);
    setFilterValue(filter);
  };

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      if (!bid) {
        setError("Property ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const baseUrl = process.env.APP_ADDRESS || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/property/${bid}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch property: ${res.status}`);
        }

        const data = await res.json();
        const p: Property = data.property;
        setIsPreferred(Boolean(p.isPreferred));
        setProperty(p);
      } catch (err) {
        console.error("Failed to fetch property:", err);
        setError(err instanceof Error ? err.message : "Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [bid]);

  // Submit booking function
  const handleBooking = async () => {
    if (isBooked) return;
    if (!bid) {
      alert("Property ID missing");
      return;
    }

    try {
      setIsBooked(true);
      const baseUrl = process.env.APP_ADDRESS || "http://localhost:8080";
      const res = await fetch(
        `${baseUrl}/group/booking/request/${bid}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Booking failed");

      const data = await res.json();
      console.log("Booking success:", data);
      alert("Booking request sent! Pending approval.");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed. See console for details.");
      setIsBooked(false);
    }
  };

  // Toggle preferred property
  const togglePreferred = async () => {
    if (!property || prefLoading) return;

    const prev = isPreferred;
    setIsPreferred(!prev);
    setPrefLoading(true);

    try {
      const baseUrl = process.env.APP_ADDRESS || "http://localhost:8080";
      const url = `${baseUrl}/group/preferred-property/${property.id}`;
      const method = !prev ? "POST" : "DELETE";
      const res = await fetch(url, { method, credentials: "include" });
      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        /* ignore non-json */
      }
      if (!res.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          text ||
          `Request failed (${res.status})`;
        throw new Error(msg);
      }
    } catch (err: any) {
      console.error("Failed to toggle preferred", err);
      setIsPreferred(prev);
      alert(err?.message || "Failed to update preferred list. Try again.");
    } finally {
      setPrefLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F1B2D]">
        <div className="text-white text-xl">Loading property details...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0F1B2D]">
        <div className="text-white text-xl mb-4">
          {error || "Property not found"}
        </div>
        <button
          onClick={() => router.back()}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0F1B2D] text-black">
        
      <TopBar pageName={property.placeName+" detail"} />

      {/* Content */}
      <div className="flex flex-1 p-4 gap-4">
        {/* Left side: Booking detail */}
        <div className="flex-1 bg-white rounded-2xl p-6 overflow-y-auto ml-[62px]">
          <h2 className="text-2xl font-bold my-4">
            Booking <span className="ml-6 mr-4">{property.placeName}</span>
            {/* Bookmark / prefer toggle */}
            <button
              aria-label="Toggle preferred"
              disabled={prefLoading}
              onClick={togglePreferred}
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                isPreferred
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {isPreferred ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 3a2 2 0 00-2 2v12l7-4 7 4V5a2 2 0 00-2-2H5z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 3a2 2 0 00-2 2v14l9-5 9 5V5a2 2 0 00-2-2H5z" />
                </svg>
              )}
            </button>
          </h2>

          {/* Property Info */}
          <div className="mb-4 text-sm text-gray-600">
            <div className="flex gap-4">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {property.type}
              </span>
              <span>Capacity: {property.capacity} people</span>
              <span>Size: {property.roomSize} m²</span>
            </div>
            <div className="mt-2">
              📍 {property.districtName}, {property.provinceName}
            </div>
            <div className="mt-2 text-xl font-bold text-blue-600">
              ฿{property.rentalFee.toLocaleString()}/month
            </div>
          </div>

          {/* Pictures */}
          <div className="flex gap-2 mb-4">
            {property.pictures && property.pictures.length > 0 ? (
              property.pictures.map((pic, i) => (
                <div key={i} className="w-1/3 h-100 relative">
                  <Image
                    src={pic}
                    alt={`${property.placeName}-${i + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))
            ) : (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1/3 h-40 bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  No Image
                </div>
              ))
            )}
          </div>

          <h3 className="text-xl font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{property.description}</p>
        </div>

        {/* Right side: Booking info */}
        <div className="w-1/3 bg-white rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-4">Booking Info</h3>

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
            disabled={isBooked}
            className={`mx-auto mt-6 w-1/3 ${
              isBooked
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
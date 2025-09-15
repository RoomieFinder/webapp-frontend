"use client";

import TopBar from "@/components/ui/TopBar";
import { useState } from "react";

export default function BookingPage() {
  const [duration, setDuration] = useState("");
  const [bookingType, setBookingType] = useState<"myself" | "group">("myself");

  return (
    <div className="flex flex-col h-screen bg-[#0F1B2D] text-black">
      {/* TopBar */}
      <TopBar pageName="Booking" />

      {/* Content */}
      <div className="flex flex-1 p-4 gap-4">
        {/* Left side: Booking detail */}
        <div className="flex-1 bg-white rounded-2xl p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">
            Booking <span className="ml-2">Duplex 21 Apartment ★★★★★</span>
          </h2>
          <div className="flex gap-2 mb-4">
            <img
              src="/images/apartment1.jpg"
              alt="apartment"
              className="w-1/3 h-40 object-cover rounded-lg"
            />
            <img
              src="/images/apartment2.jpg"
              alt="apartment"
              className="w-1/3 h-40 object-cover rounded-lg"
            />
            <img
              src="/images/apartment3.jpg"
              alt="apartment"
              className="w-1/3 h-40 object-cover rounded-lg"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2">Description</h3>
          <p className="text-gray-700">
            A modern and stylish apartment located in the Lasalle area of
            Bangkok, offering a peaceful residential atmosphere with easy access
            to main roads and public transportation. The fully furnished unit
            features a cozy bedroom, spacious living area, functional kitchen,
            and private balcony.
          </p>
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
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Booking by</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setBookingType("myself")}
                  className={`px-4 py-2 rounded-lg ${
                    bookingType === "myself"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  By Myself
                </button>
                <button
                  onClick={() => setBookingType("group")}
                  className={`px-4 py-2 rounded-lg ${
                    bookingType === "group"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  With Group
                </button>
              </div>
            </div>
          </div>
          <button className="mt-6 w-full bg-amber-100 hover:bg-amber-200 text-black font-medium py-2 rounded-lg transition">
            Book
          </button>
        </div>
      </div>
    </div>
  );
}

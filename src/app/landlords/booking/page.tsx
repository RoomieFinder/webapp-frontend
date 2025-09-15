"use client";

import TopBar from "@/components/ui/TopBar";
import Image from "next/image";
import { useState } from "react";

type Tenant = {
  id: string;
  name: string;
  avatar: string;
};

type BookingGroup = {
  id: string;
  propertyName: string;
  propertyThumb: string;
  tenants: Tenant[];
};

type Property = {
  id: string;
  name: string;
  image: string;
  description: string;
};

type RequestData = {
  ID: number;
  Status: string;
  Property: {
    ID: number;
    PlaceName: string;
    Pictures: { Key: string; Link: string }[] | null;
  };
  Group: {
    ID: number;
    Name: string;
    Members?: any[]; // TODO เพิ่มสมาชิกจริงในอนาคต
  };
};

const fetchGroupRequests = async (landlordId: number) => {
  try {
    const res = await fetch(`{{URL}}/group/requests/landlord/${landlordId}`);
    const data = await res.json();

    if (!data.success) throw new Error("Failed to fetch requests");

    // map API data -> bookingGroups
    const groups = data.data.map((r: RequestData) => ({
      id: r.ID.toString(),
      propertyName: r.Property.PlaceName,
      propertyThumb: r.Property.Pictures?.[0]?.Link || "/default-property.jpg",
      tenants: r.Group.Members?.map((m: any) => ({
        id: m.ID.toString(),
        name: m.Name,
        avatar: m.Avatar || "/default-avatar.jpg",
      })) || [],
      status: r.Status,
    }));

    setBookingGroups(groups);
  } catch (err) {
    console.error(err);
  }
};

const initialProperties: Property[] = [
  {
    id: "p1",
    name: "The Excel",
    image: "/properties/excel.jpg",
    description:
      "A modern and stylish apartment located in the Lasalle area of Bangkok, offering a peaceful residential atmosphere with easy access to main roads and public transportation. The fully furnished unit features a cozy bedroom, spacious living area, functional kitchen, and private balcony.",
  },
  {
    id: "p2",
    name: "Lasalle",
    image: "/properties/lasalle.jpg",
    description:
      "Modern 1-bedroom apartment located in the heart of Bangkok, offering a perfect blend of comfort and convenience. Fully furnished with stylish interiors, spacious living area, and a well-equipped kitchen. The unit features large windows with plenty of natural light and a private balcony.",
  },
];

export default function LandlordDashboardPage() {
  const [bookingGroups, setBookingGroups] =
    useState<BookingGroup[]>(initialBookingGroups);
  const [properties] = useState<Property[]>(initialProperties);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedGroup((prev) => (prev === id ? null : id));
  };

  const handleApprove = (id: string) => {
    setBookingGroups((prev) => prev.filter((g) => g.id !== id));
    // TODO: call API PATCH /bookings/group/:id/approve
  };

  const handleDeny = (id: string) => {
    setBookingGroups((prev) => prev.filter((g) => g.id !== id));
    // TODO: call API PATCH /bookings/group/:id/deny
  };

  return (  
    <div className="flex flex-col h-screen bg-[#0F1B2D] text-black">
      
      <TopBar pageName="Properties Management" />

      <div className="flex flex-1 p-4 gap-4">
        {/* Content grid - 2 columns */}
        <section className="grid grid-cols-2 gap-6">
          {/* Left: Bookings Approval */}
          <section className="bg-white rounded-lg shadow-lg p-5 ml-[62px]">
            <h2 className="text-2xl font-mono mb-4">Bookings Approval</h2>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {bookingGroups.map((group) => {
                const isExpanded = expandedGroup === group.id;
                return (
                  <div
                    key={group.id}
                    className="bg-white rounded-lg border p-3 shadow-sm"
                  >
                    {/* Group header */}
                    <div
                      className="flex items-center justify-between"
                    >
                      {/* Property Thumbnail */}
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={group.propertyThumb}
                            alt={group.propertyName}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{group.propertyName}</p>
                        </div>
                      </div>

                      {/* Clickable compact avatars bubble */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 cursor-pointer" onClick={() => toggleExpand(group.id)}>
                          {group.tenants.slice(0, 3).map((t) => (
                            <div
                              key={t.id}
                              className="w-8 h-8 rounded-full overflow-hidden border -ml-2 first:ml-0"
                            >
                              <Image
                                src={t.avatar}
                                alt={t.name}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {group.tenants.length > 3 && (
                            <span className="ml-2 text-sm text-gray-600">
                              +{group.tenants.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 ml-2">
                        <button
                            onClick={() => handleDeny(group.id)}
                            title="Deny"
                            className="w-9 h-9 rounded-full flex items-center justify-center border shadow-sm hover:scale-105 transition bg-[#e25555] hover:bg-[#c73f3f] hover:cursor-pointer"
                        >
                            <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            >
                            <path
                                d="M18 6L6 18"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M6 6L18 18"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            </svg>
                        </button>

                        <button
                            onClick={() => handleApprove(group.id)}
                            title="Approve"
                            className="w-9 h-9 rounded-full flex items-center justify-center border shadow-sm hover:scale-105 transition bg-[#2fb86f] hover:bg-[#249d5e] hover:cursor-pointer"
                        >
                            <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            >
                            <path
                                d="M20 6L9 17l-5-5"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            </svg>
                        </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded tenants list */}
                    {isExpanded && (
                      <div className="mt-1 pl-5 space-y-2">
                        {group.tenants.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition"
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden border">
                              <Image
                                src={t.avatar}
                                alt={t.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium">{t.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {bookingGroups.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No pending bookings
                </div>
              )}
            </div>
          </section>

          {/* Right: Edit Posts */}
          <section className="bg-white rounded-lg shadow-lg p-5">
            <h2 className="text-2xl font-mono mb-4">Edit Posts</h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {properties.map((p) => (
                <article
                  key={p.id}
                  className="flex gap-4 items-start bg-white border rounded-lg p-4 shadow-sm"
                >
                  <div className="w-[160px] h-[100px] rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={160}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-semibold">{p.name}</h3>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 rounded-md border">
                          Edit
                        </button>
                        <button className="px-3 py-1 rounded-md border">
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-700">
                      {p.description}
                    </p>
                  </div>
                </article>
              ))}

              {properties.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No properties found
                </div>
              )}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

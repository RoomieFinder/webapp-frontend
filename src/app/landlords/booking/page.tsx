"use client";

import TopBar from "@/components/ui/TopBar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { apiServices } from "@/api/apiServices";
import Link from "next/link";

type PropertyPicture = {
  ID: number;
  Link: string;
  Key: string;
};

type GroupRequest = {
  ID: number;
  Property: {
    ID: number;
    PlaceName: string;
    Caption: string;
    Type: string;
    Address: string;
    Description: string;
    RentalFee: number;
    Capacity: number;
    RoomSize: number;
    Pictures: PropertyPicture[];
  };
  Group: {
    ID: number;
    Name: string;
    Description: string;
  };
  Status: string;
  RequestedAt: string;
};

type Property = {
  id: number;
  placeName: string;
  caption: string;
  type: string;
  rentalFee: number;
  capacity: number;
  roomSize: number;
  description: string;
  pictures: string[]; // array ของ URL string
  isPreferred: boolean;
  subDistrictName: string;
  districtName: string;
  provinceName: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _User = {
  ID: number;
  Username: string;
  Email: string;
  Phone: string;
  Role: string;
  Landlord?: {
    ID: number;
    Properties?: Property[] | null;
  };
  Tenant?: {
    ID: number;
    PersonalProfile?: {
      Gender?: string;
      Description?: string;
      Pictures?: { Link: string }[];
    };
  };
};

export default function LandlordDashboardPage() {
  const [requests, setRequests] = useState<GroupRequest[]>([]);
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);

  // Fetch booking requests
  useEffect(() => {
    async function fetchRequests() {
      const me = await apiServices.getMe();
      if (!me?.Landlord?.ID) return;

      const lid = me.Landlord.ID;

      try {
        const res = await fetch(
          process.env.APP_ADDRESS ? `${process.env.APP_ADDRESS}/group/requests/landlord/${lid}` : `https://roomie-finder-api-316466908775.asia-southeast1.run.app/group/requests/landlord/${lid}`
        );
        const json = await res.json();
        if (json.success) {
          setRequests(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch requests", err);
      }
    }
    fetchRequests();
  }, []);

  // Fetch all properties of landlord
  useEffect(() => {
    async function fetchAllProperties() {
      try {
        const res = await fetch(process.env.APP_ADDRESS ? `${process.env.APP_ADDRESS}/landlord/properties` : `https://roomie-finder-api-316466908775.asia-southeast1.run.app/landlord/properties`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const json = await res.json();
        // console.log("Json res", json)

        setProperties(json.properties);
      } catch (err) {
        console.error("Failed to fetch properties", err);
      }
    }
    fetchAllProperties();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedGroup((prev) => (prev === id ? null : id));
  };

  const sendResponse = async (id: number, accept: boolean) => {
    try {
      const res = await fetch(process.env.APP_ADDRESS ? `${process.env.APP_ADDRESS}/landlord/response/${id}` : `https://roomie-finder-api-316466908775.asia-southeast1.run.app/landlord/response/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });
      console.log("Res", res);
      setRequests((prev) => prev.filter((r) => r.ID !== id));
    } catch (err) {
      console.error("Failed to send response", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F1B2D] text-black">
      <TopBar pageName="Properties Management" />

      <div className="flex flex-1 p-4 gap-4">
        <section className="grid grid-cols-2 gap-6 w-full">
          {/* Left: Requests List */}
          <section className="bg-white rounded-lg shadow-lg p-5 ml-[62px]">
            <h2 className="text-2xl font-mono mb-4">Bookings Approval</h2>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {requests.map((req) => {
                const isExpanded = expandedGroup === req.ID;
                const picture = req.Property.Pictures?.[0]?.Link;

                return (
                  <div
                    key={req.ID}
                    className="bg-white rounded-lg border p-3 shadow-sm"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
                          {picture ? (
                            <Image
                              src={picture}
                              alt={req.Property.PlaceName}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-xs text-gray-500">
                              No Image
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {req.Property.PlaceName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Group: {req.Group.Name}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => sendResponse(req.ID, false)}
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
                          onClick={() => sendResponse(req.ID, true)}
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

                    {/* Expand */}
                    {isExpanded && (
                      <div className="mt-2 pl-5 text-sm text-gray-700">
                        <p>Status: {req.Status}</p>
                        <p>
                          Requested at:{" "}
                          {new Date(req.RequestedAt).toLocaleString()}
                        </p>
                        <p>Description: {req.Group.Description}</p>
                      </div>
                    )}

                    <button
                      className="mt-2 text-xs text-blue-600 hover:underline"
                      onClick={() => toggleExpand(req.ID)}
                    >
                      {isExpanded ? "Hide details" : "View details"}
                    </button>
                  </div>
                );
              })}

              {requests.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No pending requests
                </div>
              )}
            </div>
          </section>

          {/* Right: Properties */}
          <section className="bg-white rounded-lg shadow-lg p-5">
            <h2 className="text-2xl font-mono mb-4">Edit Posts</h2>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {(properties ?? [] ).map((p) => {
                const firstPic = p.pictures?.[0];

                return (
                  <article
                    key={p.id}
                    className="flex gap-4 items-start bg-white border rounded-lg p-4 shadow-sm"
                  >
                    {/* Picture */}
                    <div className="w-[160px] h-[100px] rounded-md overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
                      {firstPic ? (
                        <Image
                          src={firstPic}
                          alt={p.placeName}
                          width={160}
                          height={100}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-xs text-gray-500">No Image</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-2xl font-semibold">
                          {p.placeName}
                        </h3>
                        <div className="flex gap-2">
                          <Link
                            href={`/landlords/edit?pid=${p.id}`}
                            className="px-3 py-1 rounded-md border bg-white hover:bg-gray-100"
                          >
                            Edit
                          </Link>
                          {/* <button className="px-3 py-1 rounded-md border">
                            Delete
                          </button> */}
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-gray-700">
                        {p.description}
                      </p>
                    </div>
                  </article>
                );
              })}

              {(!properties || properties?.length === 0) && (
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

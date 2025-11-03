"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/ui/TopBar";

// Type definitions
interface Member {
  id: number;
  userId: number;
  role: string;
  name: string;
  personalPicture?: string;
}

interface RentIn {
  id: number;
  placeName: string;
  caption: string;
  type: string;
  address: string;
  description: string;
  rentalFee: number;
  capacity: number;
  roomSize: number;
}

interface PreferredProperty {
  id: number;
  placeName: string;
}

interface Group {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  hobbies: string[];
  members: Member[];
  rentIn: RentIn;
  preferredProperties: PreferredProperty[];
  leaderId: number;
  visibility: boolean;
}

// API Services
const apiServices = {
  getGroup: async (groupId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/group/${groupId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();
      // console.log("Data", json.data)
      if (json.success) return json.data;

      console.error("Failed to fetch group");
      return null;
    } catch (err) {
      console.error("Error fetching group:", err);
      return null;
    }
  },
};

// Utility function
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ViewGroup({ gid }: { gid: number }) {
  const [loading, setLoading] = useState(true);
  const [hasGroup, setHasGroup] = useState<boolean | null>(null);
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    if (gid) {
      fetchGroup();
    }
  }, [gid]);

  const fetchGroup = async () => {
    setLoading(true);
    try {
      if (!gid) {
        console.error("No gid provided");
        setHasGroup(false);
        setGroup(null);
        setLoading(false);
        return;
      }

      console.log("Fetching group with gid:", gid);
      const groupData = await apiServices.getGroup(gid);
      console.log("Raw API response:", groupData);

      if (!groupData) {
        console.error("No group data returned from API");
        setHasGroup(false);
        setLoading(false);
        return;
      }

      const g = groupData;
      const sortedMembers = (g.Members || [])
        .map((m: any) => ({
          id: m.ID,
          userId: m.UserID,
          role: m.UserID === g.Leader ? "Leader" : "Member",
          name: m.Name || `User ${m.UserID}`,
          personalPicture: m.PersonalProfile?.Pictures?.[0]?.Link,
        }))
        .sort((a: Member, b: Member) =>
          a.userId === g.Leader ? -1 : b.userId === g.Leader ? 1 : 0
        );

      const mappedGroup: Group = {
        id: g.ID,
        name: g.Name,
        description: g.Description,
        createdAt: g.CreatedAt,
        hobbies: g.Hobbies || [],
        members: sortedMembers,
        rentIn: {
          id: g.RentIn?.ID || 0,
          placeName: g.RentIn?.PlaceName || "",
          caption: g.RentIn?.Caption || "",
          type: g.RentIn?.Type || "",
          address: g.RentIn?.Address || "",
          description: g.RentIn?.Description || "",
          rentalFee: g.RentIn?.RentalFee || 0,
          capacity: g.RentIn?.Capacity || 0,
          roomSize: g.RentIn?.RoomSize || 0,
        },
        preferredProperties: (g.PreferredProperties || []).map((p: any) => ({
          id: p.ID,
          placeName: p.PlaceName || "",
        })),
        leaderId: g.Leader,
        visibility: g.Visibility,
      };

      console.log("Mapped Group:", mappedGroup);
      console.log("Members:", mappedGroup.members);

      setGroup(mappedGroup);
      console.log("Group set in state:", mappedGroup);
      setHasGroup(true);
    } catch (err) {
      console.error("Error fetching group:", err);
      console.error(
        "Error details:",
        err instanceof Error ? err.message : "Unknown error"
      );
      setHasGroup(false);
      setGroup(null);
    } finally {
      setLoading(false);
    }
  };

  console.log("Rendering ViewGroup with state:", { loading, hasGroup, group });
  return (
    <>
      <div className="flex flex-col h-screen bg-[#0F1B2D] text-black">
        <TopBar pageName="Group Management" />

        <div className="flex flex-col flex-1 p-4 gap-4 overflow-auto">
          {/* Section บน */}
          <section className="flex justify-between bg-white rounded-lg shadow-lg p-6 ml-[62px]">
            <div className="flex gap-6 items-center">
              <div>
                <Image
                  src="/default_profile.png"
                  alt="Group Avatar"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white shadow-md"
                />
              </div>
              <div>
                <h2 className="text-4xl font-semibold">{group?.name}</h2>
                <p className="text-lg text-gray-600 mt-2">
                  Members: {group?.members.length}
                </p>
                <p className="text-lg text-gray-700">
                  Description: {group?.description}
                </p>
              </div>
            </div>
          </section>

          {/* Section ล่าง (แบ่งโซนซ้าย-ขวา) */}
          <section className="flex h-full w-full gap-4">
            {/* ซ้าย - Members */}
            <section className="w-2/5 bg-white rounded-lg shadow-lg p-6 ml-[62px] overflow-auto">
              <h3 className="text-3xl font-semibold my-4 mx-5">Members</h3>
              <div className="flex flex-col gap-4">
                {group?.members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between mx-5"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={m.personalPicture || "/default_profile.png"}
                        alt={m.name || `User ${m.userId}`}
                        width={84}
                        height={84}
                        className="rounded-full border border-gray-300 w-21 h-21"
                      />
                      <div>
                        <p className="text-lg font-medium">{m.name}</p>
                        <p className="text-gray-500 text-sm">
                          {m.userId === group?.leaderId ? "Leader" : "Member"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ขวา - Group Details */}
            <section className="w-3/5 bg-white rounded-lg shadow-lg p-6 overflow-auto">
              <div className="mx-5 my-4">
                <h3 className="text-3xl font-semibold mb-4">Group Details</h3>
                <p className="text-lg mb-2">
                  <span className="font-medium">Created date:</span>
                  &nbsp;&nbsp;
                  {group?.createdAt ? formatDate(group.createdAt) : "No date"}
                </p>
                <p className="text-lg mb-2">
                  <span className="font-medium">Created by:</span>
                  &nbsp;&nbsp;
                  {group?.members.find((m) => m.userId === group?.leaderId)
                    ?.name || "Unknown"}
                </p>
                <p className="text-lg mb-2">
                  <span className="font-medium">Status:</span>
                  &nbsp;
                  {group?.visibility ? "Opened" : "Closed"}
                </p>
                <p className="text-lg mb-2">
                  <span className="font-medium">Location Details:</span>{" "}
                  {group?.rentIn.address || "Not specified"}
                </p>
                <p className="text-lg mb-2">
                  <span className="font-medium">Group code:</span> {group?.id}
                </p>
                <p className="text-lg mb-2">
                  <span className="font-medium">Tags:</span>{" "}
                  {group?.hobbies.join(", ") || "None"}
                </p>
                <p className="flex items-center text-lg mb-2 gap-2">
                  <span className="font-medium">Preferred rooms:</span>{" "}
                  <span className="mr-2">
                    {group?.preferredProperties?.length
                      ? group.preferredProperties
                          .map((p) => p.placeName)
                          .join(", ")
                      : "None"}
                  </span>
                  <Link href="/tenants/room">
                    <Image
                      src="/pencil-edit.svg"
                      alt="Edit preferred rooms"
                      width={18}
                      height={18}
                      className="cursor-pointer hover:opacity-70"
                    />
                  </Link>
                </p>
              </div>
            </section>
          </section>
        </div>
      </div>
    </>
  );
}

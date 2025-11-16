"use client";

import TopBar from "@/components/ui/TopBar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { apiServices } from "@/api/apiServices";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SuccessModal from "@/components/ui/SuccessModal";
import ReportModal from "@/components/ui/ReportModal";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import GroupOptionBox from "@/components/ui/GroupOptionBox";
import { AlertTriangle } from "lucide-react";
import { Group } from "@/types/group";
import { removeAuthToken } from "@/utils/auth";

type PendingRequest = {
  ID: number;
  TenantID: number;
  Status: string;
  IsBanned?: boolean;
  Tenant: {
    User: {
      ID: number;
      Username?: string;
      IsBanned?: boolean;
    };
    PersonalProfile: { Pictures?: { Link: string }[] };
  };
};

type GroupMember = {
  ID: number;
  UserID: number;
  Name?: string;
  IsBanned?: boolean;
  User: { IsBanned?: boolean };
  PersonalProfile: { Pictures?: { Link: string }[] };
};

type SortedMember = {
  id: number;
  userId: number;
  role: string;
  name: string;
  personalPicture?: string;
  isBanned?: boolean;
};

type PendingMember = {
  id: number;
  requestId?: number;
  userId: number;
  name: string;
  personalPicture?: string;
  isPending?: boolean;
};


export default function GroupManagementPage() {
  const [myTenantId, setMyTenantId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [hasGroup, setHasGroup] = useState<boolean | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([]);

  // สำหรับ dropdown ของสมาชิกแต่ละคน
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [showConfirm, setShowConfirm] = useState<null | "delete" | "leave">(
    null
  );

  const [memberAction, setMemberAction] = useState<{
    type: "kick" | "promote";
    memberId: number;
    userId: number;
  } | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [visLoading, setVisLoading] = useState(false);

  const [reportTarget, setReportTarget] = useState<{
    id: number;
    name: string;
    personalPicture?: string;
  } | null>(null);
  const [showReport, setShowReport] = useState(false);

  const [successContext, setSuccessContext] = useState<
    "report" | "groupAction" | null
  >(null);

  useEffect(() => {
    async function init() {
      try {
        const me = await apiServices.getMe();
        if (!me) return;

        setMyTenantId(me.Tenant.ID);
        // เรียก fetchGroup หลังจากได้ Tenant ID
        // fetchGroup();
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    }

    init();
  }, []);

  useEffect(() => {
    if (myTenantId) {
      fetchGroup();
    }
  }, [myTenantId]);

  const fetchGroup = async () => {
    setLoading(true);
    try {
      const me = await apiServices.getMe();
      if (me.IsBanned) {
        removeAuthToken(); // ลบ token
        window.location.href = "/"; // redirect
      }

      const gid = me.Tenant?.GroupID;

      if (!gid) {
        setHasGroup(false);
        setGroup(null);
      } else {
        const groupData = await apiServices.getGroup(gid);
        if (!groupData) return;

        const g = groupData;

        const sortedMembers = (g.Members || [])
          // กรองคนที่โดนแบนออกก่อน
          .filter((m: GroupMember) => !m.User.IsBanned)
          .map((m: GroupMember) => ({
            id: m.ID,
            userId: m.UserID,
            role: m.UserID === g.Leader ? "Leader" : "Member",
            name: m.Name || `User ${m.UserID}`,
            personalPicture: m.PersonalProfile.Pictures?.[0]?.Link,
            isBanned: m.IsBanned,
          }))
          .sort((a: SortedMember, b: SortedMember) =>
            a.userId === g.Leader ? -1 : b.userId === g.Leader ? 1 : 0
          );

        const mappedGroup: Group = {
          id: g.ID,
          name: g.Name,
          description: g.Description,
          createdAt: g.CreatedAt,
          hobbies: g.Hobbies || [],
          members: sortedMembers,
          rent_in: {
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
          preferredProperties: (g.PreferredProperties || []).map((p: { ID: number; PlaceName?: string }) => ({
            id: p.ID,
            placeName: p.PlaceName || "",
          })),
          leaderId: g.Leader,
          is_visible: g.Visibility,
          genderRestriction: g.GenderRestriction,
          rent_in_id: 0
        };

        setGroup(mappedGroup);
        setHasGroup(true);
        console.log("Mapped group:", mappedGroup);
      }
    } catch (err) {
      console.error("Error fetching group:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPending = async () => {
    if (!group || !myTenantId) return;
    if (myTenantId !== group.leaderId) return;

    try {
      const pendingRequests = await apiServices.getPendingRequests(group.id);
      const filtered = (pendingRequests || []).filter(
        (p: PendingRequest) => p.Status === "pending" && !p.Tenant.User.IsBanned
      );
      const mappedPending = filtered.map((p: PendingRequest) => ({
        id: p.TenantID,
        requestId: p.ID,
        userId: p.Tenant.User.ID,
        role: "Pending",
        name: p.Tenant.User.Username || `User ${p.TenantID}`,
        personalPicture:
          p.Tenant.PersonalProfile.Pictures?.[0]?.Link ||
          "/default_profile.png",
        isPending: true,
        isBanned: p.IsBanned,
      }));
      setPendingMembers(mappedPending);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [group?.id, myTenantId]);

  // useEffect สำหรับปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      // ถ้ามี dropdown เปิดอยู่ แล้วคลิกนอก element dropdown ให้ปิด
      const target = e.target as HTMLElement;
      if (
        !target.closest(".dropdown-menu") &&
        !target.closest(".menu-button")
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ดักดูปุ่มว่า delete หรือ leave
  function handleGroupActions(action: "delete" | "leave") {
    setShowConfirm(action);
  }

  // ถ้า Modal เรากดยืนยัน
  function confirmAction() {
    if (showConfirm === "delete") handleDeleteGroup();
    if (showConfirm === "leave") handleLeaveGroup();
    setShowConfirm(null); // ปิด modal; เพราะโค้ดใน modal ให้ open={!!showConfirm} แล้วมันจะเช็คว่า if(!open) return null (ปิด)
  }

  const handleDeleteGroup = async () => {
    if (!group) return;
    try {
      const success = await apiServices.deleteGroup(group.id);
      if (success) {
        setSuccessMessage("You delete the group successfully");
        setSuccessContext("groupAction");
        setShowSuccess(true);
      }
    } catch (err) {
      console.error("Failed to delete group:", err);
    }
  };

  const handleLeaveGroup = async () => {
    if (!group) return;
    try {
      const success = await apiServices.leaveGroup(group.id);
      if (success) {
        setSuccessMessage("You left the group successfully");
        setSuccessContext("groupAction");
        setShowSuccess(true);
      }
    } catch (err) {
      console.error("Failed to leave group:", err);
    }
  };

  const handleMenuToggle = (id: number) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleKick = async (memberId: number) => {
    if (!group) return;
    const success = await apiServices.deleteMember(group.id, memberId);
    if (success) fetchGroup(); // รีเฟรช list
  };

  const handlePromote = async (memberId: number) => {
    if (!group) return;
    const success = await apiServices.promoteLeader(group.id, memberId);
    if (success) fetchGroup();
  };

  const handleReportSubmit = async (reason: string, tenantId: number) => {
    try {
      await apiServices.reportUser(tenantId, reason);
      setSuccessMessage("Report submitted successfully");
      setSuccessContext("report");
      setShowSuccess(true);
    } catch (err) {
      console.error("Failed to submit report:", err);
      setSuccessMessage("You left the group successfully");
      setSuccessContext("groupAction");
      setShowSuccess(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <div className="bg-[#748CAB] p-10 rounded-4xl text-2xl">
          Loading group info...
        </div>
      </div>
    );
  }
  if (!hasGroup) {
    return (
      <div className="h-screen w-full bg-[#1D2D44] overflow-hidden flex flex-col">
        <TopBar pageName="Group" />
        <div className="min-h-screen w-full bg-slate-800 flex flex-col items-center justify-center p-8">
          <div className="max-w-4xl w-full">
            {/* Header with Alert */}
            <div className="flex items-start gap-6 mb-12">
              <AlertTriangle
                className="text-white flex-shrink-0"
                size={80}
                strokeWidth={1.5}
              />
              <div>
                <h1 className="text-white text-4xl font-bold mb-3">
                  Seem like you don&apos;t have a group yet.
                </h1>
                <p className="text-gray-300 text-xl">
                  You can find your roommates with the options below !
                </p>
              </div>
            </div>

            {/* Group Options */}
            <div className="space-y-6">
              <GroupOptionBox
                title="Create a group"
                description="You'll be the leader and can manage the group"
                path="/tenants/group/create"
              />

              <GroupOptionBox
                title="Join a group"
                description="You'll be a member of any group you choose"
                path="/tenants/group/join"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!group) return null; // กัน error ของ HTML ด้านล่าง

  return (
    <div className="flex flex-col h-screen bg-[#0F1B2D] text-black font-mono">
      <TopBar pageName="Group Management" />

      <div className="flex flex-col flex-1 p-4 gap-4">
        {/* Section บน */}
        <section className="flex justify-between bg-white rounded-lg shadow-lg p-6 ml-[62px]">
          <div className="flex gap-6 items-center ">
            <div>
              <Image
                src="/default_profile.png" // replace with your image path
                alt="Group Avatar"
                width={120}
                height={120}
                className="rounded-full border-4 border-white shadow-md"
              />
            </div>
            <div>
              <h2 className="text-4xl font-semibold">{group.name}</h2>
              <p className="text-lg text-gray-600 mt-2">
                Member: {group.members.length}
                {/*/{group.rentIn.capacity}{" "}*/}
              </p>
              <p className="text-lg text-gray-700">
                Description: {group.description}
              </p>
            </div>
          </div>
          <div>
            <Button
              className="w-60 h-15 cursor-pointer bg-red-400 hover:bg-red-500 text-white"
              onClick={() => {
                handleGroupActions(
                  myTenantId === group?.leaderId ? "delete" : "leave"
                );
              }}
            >
              {myTenantId === group?.leaderId ? "Delete Group" : "Leave Group"}
            </Button>
          </div>
        </section>

        {/* Section ล่าง (แบ่งโซนซ้าย-ขวา) */}
        <section className="flex h-full w-full gap-4">
          {/* ซ้าย - Members */}
          <section className="w-2/5 bg-white rounded-lg shadow-lg p-6 ml-[62px]">
            <h3 className="text-3xl font-semibold my-4 mx-5">Members</h3>
            <div className="flex flex-col gap-4">
              {[...group.members, ...pendingMembers].map((m) => (
                <div
                  key={`${m.isPending ? "pending-" : "member-"}${m.id}`}
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
                      <p className="text-gray-500">
                        {m.isPending
                          ? "Pending"
                          : m.id === group.leaderId
                          ? m.id === myTenantId
                            ? "Head of group (You)"
                            : "Head of group"
                          : m.id === myTenantId
                          ? "(You)"
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    {myTenantId === group?.leaderId &&
                      m.id !== group.leaderId && (
                        <>
                          {/* ปุ่มสามจุด */}
                          <Image
                            src="/three-dots.png"
                            alt="Options"
                            width={24}
                            height={24}
                            className="cursor-pointer menu-button"
                            onClick={() => handleMenuToggle(m.id)}
                          />

                          {/* Dropdown */}
                          {openMenuId === m.id && (
                            <div className="absolute right-0 mt-2 w-50 bg-[#EEF2F6] border border-gray-200 rounded-lg shadow-lg z-50 dropdown-menu px-2 py-3">
                              {m.isPending ? (
                                <>
                                  <button
                                    className="w-full text-left px-2 py-1 text-green-600 hover:bg-[#90A3BC]/70 hover:text-white hover:cursor-pointer rounded-lg"
                                    onClick={async () => {
                                      if (!m.requestId) {
                                        alert("Request ID is missing");
                                        return;
                                      }
                                      console.log(
                                        "Approve request:",
                                        m.requestId
                                      );
                                      setOpenMenuId(null);
                                      const success =
                                        await apiServices.acceptRequest(
                                          m.requestId
                                        );
                                      if (success) {
                                        alert("Accepted successfully");
                                        fetchGroup(); // รีเฟรช list หลัง approve
                                        fetchPending();
                                      } else {
                                        alert("Failed to accept request");
                                      }
                                    }}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="w-full text-left px-2 py-1 text-red-600 hover:bg-[#90A3BC]/70 hover:text-white hover:cursor-pointer rounded-lg"
                                    onClick={async () => {
                                      if (!m.requestId) {
                                        alert("Request ID is missing");
                                        return;
                                      }
                                      console.log("Deny request:", m.requestId);
                                      setOpenMenuId(null);
                                      const success =
                                        await apiServices.rejectRequest(
                                          m.requestId
                                        );
                                      if (success) {
                                        alert("Rejected successfully");
                                        fetchGroup(); // รีเฟรช list หลัง reject
                                        fetchPending();
                                      } else {
                                        alert("Failed to reject request");
                                      }
                                    }}
                                  >
                                    Deny
                                  </button>
                                  <Link
                                    href={`/tenants/profile/${m.userId}`}
                                    className="w-full block text-left px-2 py-1 hover:bg-[#90A3BC]/70 hover:text-white hover:cursor-pointer rounded-lg"
                                    onClick={() => setOpenMenuId(null)}
                                  >
                                    View Profile
                                  </Link>
                                  <button
                                    className="w-full text-left px-2 py-1 text-gray-600 hover:bg-[#90A3BC]/70 hover:text-white hover:cursor-pointer rounded-lg"
                                    onClick={() => {
                                      setReportTarget({
                                        id: m.id,
                                        name: m.name || `User ${m.userId}`,
                                        personalPicture:
                                          m.personalPicture ?? undefined,
                                      });
                                      setShowReport(true);
                                      setOpenMenuId(null);
                                    }}
                                  >
                                    Report
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="w-full text-left px-2 py-1 text-red-600 hover:bg-[#90A3BC]/70 hover:text-white hover:cursor-pointer rounded-lg"
                                    onClick={() => {
                                      setMemberAction({
                                        type: "kick",
                                        memberId: m.id,
                                        userId: m.userId,
                                      });
                                      setOpenMenuId(null);
                                    }}
                                  >
                                    Kick
                                  </button>
                                  <button
                                    className="w-full text-left px-2 py-1 hover:bg-[#90A3BC]/70 hover:text-white hover:cursor-pointer rounded-lg"
                                    onClick={() => {
                                      setMemberAction({
                                        type: "promote",
                                        memberId: m.id,
                                        userId: m.userId,
                                      });
                                      setOpenMenuId(null);
                                    }}
                                  >
                                    Promote to leader
                                  </button>
                                  <button
                                    className="w-full text-left px-2 py-1 text-gray-600 hover:bg-[#90A3BC]/70 hover:text-white hover:cursor-pointer rounded-lg"
                                    onClick={() => {
                                      setReportTarget({
                                        id: m.id,
                                        name: m.name || `User ${m.userId}`,
                                        personalPicture:
                                          m.personalPicture ?? undefined,
                                      });
                                      setShowReport(true);
                                      setOpenMenuId(null);
                                    }}
                                  >
                                    Report
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ขวา - RentIn */}
          <section className="w-3/5 bg-white rounded-lg shadow-lg p-6">
            <div className="mx-5 my-4">
              <div className="flex items-center mb-4">
                <h3 className="text-3xl font-semibold">Group Details</h3>
                {myTenantId === group.leaderId && (
                  <div className="ml-3">
                    <button
                      aria-label="Toggle visibility"
                      disabled={visLoading}
                      onClick={async () => {
                        if (visLoading) return;
                        // optimistic update: toggle locally first
                        const prevVis = group.is_visible;
                        const optimisticVis = prevVis ? 0 : 1;
                        setGroup({ ...group, is_visible: optimisticVis });
                        setVisLoading(true);
                        try {
                          const gid = group.id;
                          const res = await fetch(
                            process.env.APP_ADDRESS ? `${process.env.APP_ADDRESS}/group/${gid}/visibility` : `https://roomie-finder-api-316466908775.asia-southeast1.run.app/group/${gid}/visibility`,
                            {
                              method: "PATCH",
                              credentials: "include",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                visibility: optimisticVis,
                              }),
                            }
                          );
                          const text = await res.text();
                          let data: unknown = null;
                          try {
                            data = text ? JSON.parse(text) : null;
                          } catch {
                            /* ignore */
                          }
                          if (!res.ok) {
                            const msg =
                              (data && typeof data === 'object' && ('message' in data || 'error' in data) ? ((data as { message?: string; error?: string }).message || (data as { message?: string; error?: string }).error) : null) ||
                              text ||
                              `Request failed (${res.status})`;
                            const normalized = (msg || "")
                              .toString()
                              .trim()
                              .toLowerCase();
                            if (
                              normalized.includes("already set") ||
                              normalized.includes(
                                "already set to the requested value"
                              ) ||
                              normalized.includes(
                                "already set to the requested value."
                              )
                            ) {
                              // server indicates the value is already applied — keep optimistic state
                            } else {
                              // rollback optimistic state on other errors
                              setGroup({ ...group, is_visible: prevVis });
                              throw new Error(msg);
                            }
                          }
                        } catch (err: unknown) {
                          console.error("Failed to update visibility", err);
                          alert((err as Error)?.message || "Failed to update visibility");
                        } finally {
                          setVisLoading(false);
                        }
                      }}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${group.is_visible ? 'bg-green-200' : 'bg-gray-200'}`}
                    >
                      {visLoading ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            strokeWidth="4"
                            stroke="currentColor"
                            strokeOpacity="0.25"
                          />
                          <path
                            d="M4 12a8 8 0 018-8"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : group.is_visible ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zM12 17a5 5 0 110-10 5 5 0 010 10z" />
                        </svg>
                      ) : (
                        group.is_visible ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zM12 17a5 5 0 110-10 5 5 0 010 10z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z" />
                            <path d="M15 9l-6 6" />
                            <path d="M9 9l6 6" />
                          </svg>
                        )
                      )}
                    </button>
                  </div>
                )}
              </div>
              <p className="text-lg mb-2">
                <span className="font-medium">Created date:</span>
                &nbsp;&nbsp;
                {formatDate(group.createdAt)}
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Created by:</span>
                &nbsp;&nbsp;
                {group.members[0].name}
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Status:</span>
                &nbsp;
                {group.is_visible ? "Opened" : "Closed"}
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Location Details:</span>{" "}
                {group.rent_in.address}
              </p>
              {/* <p className="text-lg mb-2">
                <span className="font-medium">Group code:</span>{" "}
              </p> */}
              <p className="text-lg mb-2">
                <span className="font-medium">Tags:</span>{" "}
                {/* {group.rentIn.rentalFee} */}
              </p>
              <p className="flex items-center text-lg mb-2 gap-2">
                <span className="font-medium">Preferred rooms:</span>{" "}
                <span className="mr-2">
                  {group.preferredProperties
                    ?.map((p) => p.placeName)
                    .join(", ")}
                </span>
                <Link href={`/tenants/room?gid=${group.id}`}>
                  <Image
                    src="/pencil-edit.svg"
                    alt="Edit preferred rooms"
                    width={18}
                    height={18}
                    className="cursor-pointer edit-room-button hover:w-5"
                  />
                </Link>
              </p>
            </div>
          </section>
        </section>
      </div>

      <ConfirmModal
        open={!!showConfirm}
        title={showConfirm === "delete" ? "Delete Group" : "Leave Group"}
        message={
          showConfirm === "delete"
            ? "Are you sure you want to delete this group?"
            : "Are you sure you want to leave this group?"
        }
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={confirmAction}
        onCancel={() => setShowConfirm(null)}
      />

      <ConfirmModal
        open={!!memberAction}
        title={
          memberAction?.type === "kick" ? "Kick Member" : "Promote to Leader"
        }
        message={
          memberAction?.type === "kick"
            ? "Are you sure you want to kick this member?"
            : "Are you sure you want to promote this member to leader?"
        }
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={async () => {
          if (!memberAction || !group) return;

          if (memberAction.type === "kick") {
            await handleKick(memberAction.userId);
          } else if (memberAction.type === "promote") {
            await handlePromote(memberAction.userId);
          }
          setMemberAction(null);
        }}
        onCancel={() => setMemberAction(null)}
      />

      <SuccessModal
        open={showSuccess}
        message={successMessage}
        onConfirm={() => {
          setShowSuccess(false);
          if (successContext === "groupAction") {
            setGroup(null);
            setHasGroup(false);
          }
        }}
      />

      <ReportModal
        open={showReport}
        onClose={() => setShowReport(false)}
        user={reportTarget}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}

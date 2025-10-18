"use client";

import React, { useEffect, useState } from "react";
import TopBar from "@/components/ui/TopBar";
import Image from "next/image";
import Button from "@/components/ui/Button";

interface PreferredProperty {
    id: number;
    name: string;
    description: string;
    pictures?: string[];
}

export default function PreferredRoomPage() {
    const [gid, setGid] = useState<string | null>(null);
    const [items, setItems] = useState<PreferredProperty[]>([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [bookingId, setBookingId] = useState<number | null>(null);

    useEffect(() => {
        const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const q = search?.get("gid") || null;
        setGid(q);
    }, []);

    useEffect(() => {
        if (!gid) return;
        fetchPreferred();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gid]);

    async function fetchPreferred() {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/groups/${gid}/preferred-property/`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            if (res.ok) setItems(data.data || []);
            else {
                console.error("Failed to fetch preferred:", data);
                setItems([]);
            }
        } catch (err) {
            console.error(err);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(pid: number) {
        if (!gid) return alert("Group ID missing");
        if (!confirm("Remove this preferred property?")) return;
        setDeletingId(pid);
        try {
            const res = await fetch(`http://localhost:8080/groups/${gid}/preferred-property/${pid}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if (res.ok) setItems((s) => s.filter((p) => p.id !== pid));
            else alert(data.message || "Failed to remove preferred property");
        } catch (err) {
            console.error(err);
            alert("Network error while removing preferred property");
        } finally {
            setDeletingId(null);
        }
    }

    async function handleBook(pid: number) {
        if (bookingId === pid) return;
        setBookingId(pid);
        try {
            const res = await fetch(`http://localhost:8080/group/booking/request/${pid}`, {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) {
                const d = await res.json();
                alert(d.message || "Booking failed");
                return;
            }
            alert("Booking request sent! Pending approval.");
        } catch (err) {
            console.error(err);
            alert("Network error while booking");
        } finally {
            setBookingId(null);
        }
    }

    return (
        <div className="min-h-screen w-full">
            <div className="bg-[#192A46] flex flex-col">
                <div className="w-full px-4">
                    <TopBar pageName="Group Management" />
                </div>

                <div className="flex-1 p-6">
                    <div className="max-w-5xl mx-auto bg-white rounded-2xl p-6">
                        <h2 className="text-xl font-mono mb-4">Preferred Room</h2>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-600">Group ID (from query)</label>
                            <div className="mt-1 text-sm text-gray-800">{gid ?? "No gid provided — use ?gid=GROUP_ID in URL"}</div>
                        </div>

                        <div className="space-y-4">
                            {loading && <p>Loading...</p>}

                            {!loading && items.length === 0 && (
                                <p className="text-gray-600">No preferred properties found.</p>
                            )}

                            {items.map((prop) => (
                                <div key={prop.id} className="flex items-start gap-4 bg-white rounded-xl shadow p-4">
                                    <div className="w-36 h-24 relative rounded-lg overflow-hidden bg-gray-100">
                                        {prop.pictures && prop.pictures.length > 0 ? (
                                            <Image src={prop.pictures[0]} alt={prop.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">No Image</div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{prop.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-4">{prop.description}</p>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <button
                                            onClick={() => handleDelete(prop.id)}
                                            aria-label="Remove preferred"
                                            className="p-2 rounded-md border border-gray-200 hover:bg-gray-50"
                                            disabled={deletingId === prop.id}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                                            </svg>
                                        </button>

                                        <Button
                                            onClick={() => handleBook(prop.id)}
                                            className="w-24"
                                            disabled={bookingId === prop.id}
                                        >
                                            {bookingId === prop.id ? "Pending..." : "Book"}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


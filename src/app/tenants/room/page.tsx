"use client";

import React, { useEffect, useState } from "react";
import { apiServices } from "@/api";
import { useRouter } from "next/navigation";
import TopBar from "@/components/ui/TopBar";
import Image from "next/image";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SuccessModal from "@/components/ui/SuccessModal";

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
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [bookingId, setBookingId] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const q = search?.get("gid") || null;
        // use the gid provided by the previous page; do not force a default
        setGid(q);
    }, []);

    useEffect(() => {
        if (!gid) return;

        const controller = new AbortController();
        const signal = controller.signal;

        async function doFetch() {
            setLoading(true);
            try {
                const data = await apiServices.getPreferredProperties(gid || "");
                if (data) {
                    setItems(data || []);
                    setErrorMessage(null);
                } else {
                    setItems([]);
                    setErrorMessage('Failed to fetch preferred properties');
                }
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.log('fetch aborted');
                } else {
                    console.error(err);
                    setItems([]);
                    setErrorMessage('Network error while fetching preferred properties');
                }
            } finally {
                setLoading(false);
            }
        }

        doFetch();
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gid]);

    // fetchPreferred logic inlined into effect (uses AbortController)

    async function handleDelete(pid: number) {
        setDeletingId(pid);
        try {
            const ok = await apiServices.removePreferredProperty(pid);
            if (ok) {
                setItems((s) => s.filter((p) => p.id !== pid));
                setSuccessMessage("Property removed from preferred list.");
                setShowSuccess(true);
            } else {
                alert("Failed to remove preferred property");
            }
        } catch (err) {
            console.error(err);
            alert("Network error while removing preferred property");
        } finally {
            setDeletingId(null);
            setPendingDeleteId(null);
        }
    }

    function handleBook(pid: number) {
        // navigate to booking page and include pid and gid in query
        const q = new URLSearchParams();
        q.set("pid", String(pid));
        if (gid) q.set("gid", gid);
        router.push(`/tenants/booking?${q.toString()}`);
    }

    return (
        <div className="min-h-screen w-full">
            <div className="bg-[#192A46] flex flex-col min-h-screen">
                <div className="w-full px-4">
                    <TopBar pageName="Group Management" />
                </div>

                <div className="flex-1 p-8">
                    {/* White panel that contains all cards */}
                    <div className="bg-white shadow p-6 border border-gray-100" style={{ margin: '10px 15px 0 80px', borderRadius: '6px' }}>
                        <h2 className="text-2xl font-mono mb-2 text-black">Preferred Room</h2>
                        <div className="h-px bg-gray-200 mb-6" />

                        <div className="space-y-6">
                            {loading && <p className="py-6">Loading...</p>}

                            {!loading && items.length === 0 && (
                                <div className="bg-white rounded-xl shadow p-6">
                                    <p className="text-gray-600">No preferred properties found.</p>
                                </div>
                            )}

                            {items.map((prop) => (
                                <div key={prop.id} className="bg-white rounded-xl shadow p-4 flex gap-6 items-start w-full">
                                    {/* Thumbnail on the left */}
                                    <div className="w-36 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                                        {prop.pictures && prop.pictures.length > 0 ? (
                                            <Image
                                                src={prop.pictures[0].startsWith("/") ? `http://localhost:8080${prop.pictures[0]}` : prop.pictures[0]}
                                                alt={prop.name}
                                                width={160}
                                                height={112}
                                                className="object-cover"
                                                sizes="(max-width: 640px) 120px, 160px"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">No Image</div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 pr-8">
                                        <h3 className="text-lg font-mono font-semibold mb-1 text-black">{prop.name}</h3>
                                        <p className="text-sm font-mono text-gray-600">{prop.description}</p>
                                    </div>

                                    {/* Actions: trash icon and Book button aligned to the right */}
                                    <div className="flex flex-col items-end gap-3">
                                        <button
                                            onClick={() => setPendingDeleteId(prop.id)}
                                            aria-label="Remove preferred"
                                            className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 bg-white"
                                            disabled={deletingId === prop.id}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                                            </svg>
                                        </button>

                                        <Button
                                            onClick={() => handleBook(prop.id)}
                                            className="w-24 bg-[#E6DFC9] text-black hover:bg-[#e6dfc8]"
                                            disabled={bookingId === prop.id}
                                        >
                                            {bookingId === prop.id ? "Pending..." : "Book"}
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <ConfirmModal
                                open={!!pendingDeleteId}
                                title="Remove preferred property"
                                message="Are you sure you want to remove this property from preferred list?"
                                confirmText="Remove"
                                cancelText="Cancel"
                                onConfirm={() => pendingDeleteId && handleDelete(pendingDeleteId)}
                                onCancel={() => setPendingDeleteId(null)}
                            />
                            <SuccessModal
                                open={showSuccess}
                                message={successMessage}
                                onConfirm={() => setShowSuccess(false)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


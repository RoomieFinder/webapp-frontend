"use client";

import { useState } from "react";
import Image from "next/image";

export default function CreateGroup() {
    const [groupName, setGroupName] = useState("");
    const [stayLocation, setStayLocation] = useState(""); // maps to property_id
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/group", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    group_name: groupName,
                    description: description,
                    property_id: stayLocation, // backend requires string
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("✅ Group created successfully!");
                setGroupName("");
                setStayLocation("");
                setDescription("");
            } else {
                setMessage(`❌ ${data.message || "Failed to create group"}`);
            }
        } catch (error) {
            setMessage("⚠️ Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full">
            {/* Main Content */}
            <div className="flex-1 bg-[#192A46] flex flex-col">
                {/* Header */}
                <div className="bg-white p-3">
                    <h1 className="text-xl font-mono">‹ Create a Group</h1>
                </div>

                {/* Form */}
                <div className="flex flex-col flex-1 items-center justify-center">
                    <div className="mb-6">
                        <Image
                            src="/sunset.jpg" // replace with your image path
                            alt="Group Avatar"
                            width={120}
                            height={120}
                            className="rounded-full border-4 border-white shadow-md"
                        />
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col items-center space-y-4 w-full max-w-md"
                    >
                        <input
                            type="text"
                            placeholder="Group’s name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                            className="w-full rounded-md p-2 font-mono"
                        />

                        <input
                            type="text"
                            placeholder="Looking to stay at (property_id)"
                            value={stayLocation}
                            onChange={(e) => setStayLocation(e.target.value)}
                            required
                            className="w-full rounded-md p-2 font-mono"
                        />

                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-md p-2 font-mono"
                            rows={3}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 bg-[#E6DFC9] text-black px-6 py-2 rounded-md shadow font-mono"
                        >
                            {loading ? "Creating..." : "Create Group"}
                        </button>
                    </form>

                    {message && (
                        <p className="mt-4 text-white font-mono">{message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

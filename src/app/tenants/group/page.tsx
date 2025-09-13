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
                            src="/sunset.svg" // replace with your image path
                            alt="Group Avatar"
                            width={269}
                            height={269}
                            className="rounded-full border-4 border-white shadow-md"
                        />
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col items-center space-y-4 w-full max-w-3xl"
                    >
                        {/* Group’s name */}
                        <div className="w-full">
                            <label className="block text-white font-mono mb-1">Group’s name</label>
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                required
                                className="w-full rounded-md p-2 font-mono bg-white text-black"
                            />
                        </div>

                        {/* Looking to stay at */}
                        <div className="w-full">
                            <label className="block text-white font-mono mb-1">Looking to stay at</label>
                            <input
                                type="text"
                                value={stayLocation}
                                onChange={(e) => setStayLocation(e.target.value)}
                                required
                                className="w-full rounded-md p-2 font-mono bg-white text-black"
                            />
                        </div>

                        {/* Description */}
                        <div className="w-full">
                            <label className="block text-white font-mono mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded-md p-2 font-mono bg-white text-black"
                                rows={2}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 bg-[#E6DFC9] text-black px-10 py-3 rounded-md shadow font-mono font-extrabold"
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

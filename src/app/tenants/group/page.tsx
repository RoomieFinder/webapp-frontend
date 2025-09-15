"use client";

import { useState } from "react";
import Image from "next/image";
import TopBar from "@/components/ui/TopBar";

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
            const url = "http://localhost:8080/group"; // backend route
            const body = {
                group_name: groupName,
                description: description,
                //property_id: Number(stayLocation),
            };

            console.log("Sending POST request to:", url);
            console.log("Request body:", body);

            const res = await fetch(url, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            console.log("Response status:", res.status);

            const data = await res.json();
            console.log("Response data:", data);

            if (res.ok) {
                setMessage("✅ Group created successfully!");
                setGroupName("");
                setStayLocation("");
                setDescription("");
            } else {
                setMessage(`❌ ${data.message || "Failed to create group"}`);
            }
        } catch (error) {
            console.error("Network error:", error);
            setMessage("⚠️ Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full">
            {/* Main Content */}
            <div className="flex-1 bg-[#192A46] flex flex-col">

                {/* TopBar */}
                <div className="w-full px-4">
                    <TopBar pageName="Create a Group" />
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

                        {/* Create Group button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-10 bg-[#E6DFC9] text-black px-10 py-3 rounded-md shadow font-mono font-extrabold
                                       hover:bg-[#d4c6aa] hover:scale-105 hover:shadow-lg transition-all duration-200"
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

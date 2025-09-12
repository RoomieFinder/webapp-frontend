"use client";

import Image from "next/image";
import { useState } from "react";

export default function SelectRolePage() {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    return (
        <div
            className="h-screen w-full bg-cover bg-center relative"
            style={{ backgroundImage: "url('/background.png')" }}
        >
            {/* White Rectangle */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 bg-white shadow-xl flex flex-col items-center justify-center rounded-lg h-1/2 w-[1920px]"
            >
                {/* Header */}
                <div
                    className="absolute left-[50px] top-[50px] font-extrabold text-[32px] font-jetbrains text-black"
                >
                    Choose Your Role
                    <div className="mt-2 font-medium text-[24px] font-jetbrains text-black">
                        What Fit You Best ?
                    </div>
                </div>
                {/* Logo at top right */}
                <div
                    className="absolute right-[50px] top-[50px]"
                >
                    <Image src="/logoblack.svg" alt="logo" width={174} height={185} />
                </div>
            </div>
            {/* Role Options OUTSIDE the white rectangle */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-6 items-center justify-center">
                {/* Landlord Card */}
                <div
                    className={`flex flex-col items-center p-6 rounded-lg shadow cursor-pointer transition w-[450px] h-[450px] ${selectedRole === "landlord"
                        ? "bg-gray-100 border-2 border-blue-500"
                        : "bg-gray-50 hover:bg-gray-100"
                        }`}
                    onClick={() => setSelectedRole("landlord")}
                >
                    <Image
                        src="/landlord.svg"
                        alt="Landlord"
                        width={100}
                        height={100}
                        className="rounded-full mb-4 object-cover"
                    />
                    <span className="font-medium text-black font-jetbrains text-[24px]">Landlord</span>
                </div>
                {/* Tenant Card */}
                <div
                    className={`flex flex-col items-center p-6 rounded-lg shadow cursor-pointer transition w-[450px] h-[450px] ${selectedRole === "tenant"
                        ? "bg-gray-100 border-2 border-blue-500"
                        : "bg-gray-50 hover:bg-gray-100"
                        }`}
                    onClick={() => setSelectedRole("tenant")}
                >
                    <Image
                        src="/tenant.svg"
                        alt="Tenant"
                        width={100}
                        height={100}
                        className="rounded-full mb-4 object-cover"
                    />
                    <span className="font-medium text-black font-jetbrains text-[24px]">Tenant</span>
                </div>
            </div>
            {/* Continue Button OUTSIDE the white rectangle and role cards */}
            <div className="absolute right-[100px] top-[85%]">
                <button
                    disabled={!selectedRole}
                    className={`flex items-center font-jetbrains text-white text-[28px] border-2 border-white rounded-lg overflow-hidden transition
            ${selectedRole
                            ? "bg-transparent hover:bg-white hover:text-blue-600"
                            : "bg-transparent text-gray-400 border-gray-400 cursor-not-allowed"
                        }`}
                    style={{ width: 220, height: 60 }}
                >
                    <span className="flex-1 px-6 py-2 text-left">Continue</span>
                    <span className="border-l-2 border-white px-4 flex items-center justify-center h-full">
                        →
                    </span>
                </button>
            </div>
        </div>
    );
}
"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SelectRolePage() {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const router = useRouter();

    const handleContinue = () => {
        if (selectedRole === "tenant") {
            router.push("/tenants/group");
        } else if (selectedRole === "landlord") {
            router.push("/landlords/booking");
        }
    };

    return (
        <div
            className="h-screen w-full bg-cover bg-center relative"
            style={{ backgroundImage: "url('/background.svg')" }}
        >
            {/* White Rectangle */}
            <div
                className="absolute top-0 left-0 bg-white shadow-xl flex flex-col items-center justify-center h-[40%] w-full px-6"
            >
                {/* Header */}
                <div
                    className="absolute left-[50px] top-[50px] font-extrabold text-[48px] font-mono text-black"
                >
                    Choose Your Role
                    <div className="mt-2 font-medium text-[30px] font-mono text-black">
                        What Fit You Best ?
                    </div>
                </div>
                {/* Logo at top right */}
                <div
                    className="absolute right-[50px] top-[10px]"
                >
                    <Image src="/logoblack.svg" alt="logo" width={174} height={185} />
                </div>
            </div>
            {/* Role Options */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-6 items-center justify-center">
                {/* Landlord Card */}
                <div
                    className={`flex flex-col items-center p-6 rounded-lg shadow cursor-pointer transition w-[350px] h-[350px] ${selectedRole === "landlord"
                        ? "bg-gray-100 border-2 border-gray-400"
                        : "bg-gray-50 hover:bg-gray-200"
                        }`}
                    onClick={() => setSelectedRole("landlord")}
                >
                    <Image
                        src="/landlord.svg"
                        alt="Landlord"
                        width={180}
                        height={180}
                        className="rounded-full mb-4 object-cover"
                    />
                    <span className="font-medium text-black font-mono text-[28px]">Landlord</span>
                </div>
                {/* Tenant Card */}
                <div
                    className={`flex flex-col items-center p-6 rounded-lg shadow cursor-pointer transition w-[350px] h-[350px] ${selectedRole === "tenant"
                        ? "bg-gray-100 border-2 border-gray-400"
                        : "bg-gray-50 hover:bg-gray-200"
                        }`}
                    onClick={() => setSelectedRole("tenant")}
                >
                    <Image
                        src="/tenant.svg"
                        alt="Tenant"
                        width={180}
                        height={180}
                        className="rounded-full mb-4 object-cover"
                    />
                    <span className="font-medium text-black font-mono text-[28px]">Tenant</span>
                </div>
            </div>
            {/* Continue Button */}
            <div className="absolute right-[100px] top-[85%]">
                <button
                    disabled={!selectedRole}
                    onClick={handleContinue}
                    className={`group flex items-center font-jetbrains text-white text-[28px] border-2 border-white rounded-lg overflow-hidden
                        transition-transform duration-300 group-hover:border-black
                    ${selectedRole
                            ? "bg-transparent hover:scale-105"
                            : "bg-transparent text-gray-400 border-gray-400 cursor-not-allowed"
                        }`}
                    style={{ width: 220, height: 60 }}
                >
                    <span className="flex-1 px-6 py-2 text-left font-mono text-[24px]">Continue</span>
                    <span className="border-l-2 border-white group-hover:border-white px-4 flex items-center justify-center h-full transition-transform duration-300 group-hover:scale-105">
                        →
                    </span>
                </button>
            </div>
        </div>
    );
}
"use client";
import React, { useState } from "react";
import TopBar from "@/components/ui/TopBar";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="h-screen w-full bg-[#1D2D44] overflow-hidden flex flex-col">
      <TopBar pageName="Edit Profile" />
      <div className="flex flex-1 items-center justify-center mt-2">
        <div className="flex flex-col items-center w-full max-w-xl">
          <img
            src="/profile-pic.jpg"
            alt="Profile"
            className="rounded-full border-4 border-white mb-4"
            style={{ width: 140, height: 140, objectFit: "cover" }}
          />
          <form className="w-full flex flex-col gap-3">
            <div>
              <label className="block text-white font-mono mb-1 text-sm">
                Name-Lastname
              </label>
              <input
                type="text"
                className="w-full rounded px-3 py-2 font-mono bg-[#223355] text-white text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name Lastname"
                style={{ height: 32 }}
              />
            </div>
            <div>
              <label className="block text-white font-mono mb-1 text-sm">
                Phone number
              </label>
              <input
                type="text"
                className="w-full rounded px-3 py-2 font-mono bg-[#223355] text-white text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081-111-1111"
                style={{ height: 32 }}
              />
            </div>
            <div>
              <label className="block text-white font-mono mb-1 text-sm">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded px-3 py-2 font-mono bg-[#223355] text-white text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ height: 32 }}
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-white font-mono mb-1 text-sm">
                  Gender
                </label>
                <select
                  className="w-full rounded px-3 py-2 font-mono bg-[#223355] text-white text-sm"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{ height: 32 }}
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-white font-mono mb-1 text-sm">
                  Hobbies
                </label>
                <input
                  type="text"
                  className="w-full rounded px-3 py-2 font-mono bg-[#223355] text-white text-sm"
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  placeholder="Add Your Hobbies !!"
                  style={{ height: 32 }}
                />
              </div>
            </div>
            <div>
              <label className="block text-white font-mono mb-1 text-sm">
                Description
              </label>
              <textarea
                className="w-full rounded px-3 py-2 font-mono bg-[#223355] text-white text-sm"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe yourself..."
                style={{ resize: "none", minHeight: 48, maxHeight: 64 }}
              />
            </div>
            <button
              type="submit"
              className="mt-2 px-6 py-2 rounded bg-[#F5F3E7] text-black font-mono font-semibold text-base hover:bg-[#e5e3d7] transition"
              style={{ height: 40 }}
            >
              Confirm Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
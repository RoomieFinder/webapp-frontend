"use client";
import React, { useState, useEffect } from "react";
import { getUser, getUserCookie } from "@/api/getUser";
import { postUser } from "@/api/postUser";

type Hobby = {
  ID: number;
  Name: string;
};

export default function EditProfile() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");

      // hobbies state
  const [allHobbies, setAllHobbies] = useState<Hobby[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<number[]>([]);

  // preload user + hobbies data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userCookie = await getUserCookie();
        const userId = userCookie.data.ID;
        const userData = await getUser(userId);
        const userInfo = userData.Tenant.PersonalProfile;

        if (userInfo.Pictures && userInfo.Pictures.length > 0) {
          setProfilePicUrl(userInfo.Pictures[0].Link);
        }

        setName(userData.Username || "");
        setPhone(userData.Phone || "");
        setEmail(userData.Email || "");
        setGender(userInfo.Gender || "");
        setDescription(userInfo.Description || "");

        // load user selected hobbies IDs
        if (userInfo.Hobbies) {
          setSelectedHobbies(userInfo.Hobbies.map((h: any) => h.ID));
          console.log("User hobbies IDs:", userInfo.Hobbies.map((h: any) => h.ID)); // Debug log
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

    };

    const fetchAllHobbies = async () => {
      try {
        const baseUrl = process.env.APP_ADDRESS || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/hobby`);
        const data = await res.json();
        if (data.success) {
          setAllHobbies(data.data); // array of hobbies from backend
        }
      } catch (err) {
        console.error("Error fetching hobbies:", err);
      }
    };
    fetchAllHobbies();
    fetchUserData();

  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^[0-9]{10}$/.test(phone.replace(/[-\s]/g, ""));

  // toggle multiple hobbies
  const toggleHobby = (id: number) => {
    setSelectedHobbies((prev) =>
      prev.includes(id) ? prev.filter((hid) => hid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name is required ❌");
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      alert("Valid email is required ❌");
      return;
    }
    if (!phone.trim() || !isValidPhone(phone)) {
      alert("Phone number must be exactly 10 digits ❌");
      return;
    }

    try {
      const success = await postUser({
        username: name,
        email,
        phone,
        gender,
        hobbies: selectedHobbies, // ✅ pass array of IDs
        description,
        personal_picture: profilePic,
      });

      if (success) {
        alert("Profile updated successfully ✅");
        if (profilePic) {
          setProfilePicUrl(URL.createObjectURL(profilePic));
          setProfilePic(null);
        }
      } else {
        alert("Failed to update profile ❌");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile ❌");
    }
  };

  return (
    <div className="h-screen w-full bg-[#1D2D44] overflow-hidden flex flex-col">
      <div className="flex flex-1 items-center justify-center mt-2">
        <div className="flex flex-col items-center w-full max-w-xl">
          {/* Profile Picture */}
          <label htmlFor="profile-upload" className="cursor-pointer">
            <img
              src={
                profilePic
                  ? URL.createObjectURL(profilePic)
                  : profilePicUrl || "/default_profile.png"
              }
              alt="Profile"
              className="rounded-full border-4 border-white mb-4 object-cover hover:opacity-80 transition"
              style={{ width: 140, height: 140 }}
            />
          </label>
          <input
            type="file"
            accept="image/*"
            id="profile-upload"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            {/* name */}
            <div>
              <label className="block text-white font-mono mb-1 text-sm">Name-Lastname</label>
              <input
                type="text"
                className="w-full rounded px-3 py-2 font-mono bg-[#223355] text-white text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name Lastname"
                style={{ height: 32 }}
              />
            </div>

            {/* phone */}
            <div>
              <label className="block text-white font-mono mb-1 text-sm">Phone number</label>
              <input
                type="text"
                className="w-full rounded px-3 py-2 font-mono bg-[#223355] text-white text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812345678"
                style={{ height: 32 }}
              />
            </div>

            {/* email */}
            <div>
              <label className="block text-white font-mono mb-1 text-sm">Email</label>
              <input
                type="email"
                className="w-full rounded px-3 py-2 font-mono bg-[#223355] text-white text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ height: 32 }}
              />
            </div>

            {/* gender */}
            <div>
              <label className="block text-white font-mono mb-1 text-sm">Gender</label>
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

            {/* hobbies */}
            <div>
              <label className="block text-white font-mono mb-1 text-sm">Hobbies</label>
              <div className="flex flex-wrap gap-2">
                {allHobbies.map((hobby) => (
                  <button
                    type="button"
                    key={hobby.ID}
                    onClick={() => toggleHobby(hobby.ID)}
                    className={`px-3 py-1 rounded-full text-sm font-mono border ${
                      selectedHobbies.includes(hobby.ID)
                        ? "bg-[#F5F3E7] text-black border-[#F5F3E7]"
                        : "bg-[#223355] text-white border-gray-400"
                    }`}
                  >
                    {hobby.Name}
                  </button>
                ))}
              </div>
            </div>

            {/* description */}
            <div>
              <label className="block text-white font-mono mb-1 text-sm">Description</label>
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

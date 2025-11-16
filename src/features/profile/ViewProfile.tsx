'use client';
import { useEffect, useState } from "react";
import { getUser } from "@/api/getUser";

type Hobby = {
  ID: number;
  Name: string;
};

export default function ViewProfile({ id }: { id: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");
  const [allHobbies, setAllHobbies] = useState<Hobby[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data for ID:", id);
        const userData = await getUser(id);
        console.log("User data fetched successfully:", userData);
        const userInfo = userData.Tenant.PersonalProfile;

        if (userInfo.Pictures && userInfo.Pictures.length > 0) {
          setProfilePicUrl(userInfo.Pictures[0].Link);
        }

        setName(userData.Username || "");
        setPhone(userData.Phone || "");
        setEmail(userData.Email || "");
        setGender(userInfo.Gender || "");
        setDescription(userInfo.Description || "");

        if (userInfo.Hobbies) {
          setSelectedHobbies(userInfo.Hobbies.map((h: Hobby) => h.ID));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError((error as Error)?.message || "Failed to load profile");
      }
    };

    const fetchAllHobbies = async () => {
      try {
        const baseUrl = process.env.APP_ADDRESS || "https://roomie-finder-api-316466908775.asia-southeast1.run.app";
        const res = await fetch(`${baseUrl}/hobby`);
        const data = await res.json();
        if (data.success) {
          setAllHobbies(data.data);
        }
      } catch (err) {
        console.error("Error fetching hobbies:", err);
      }
    };

    const loadData = async () => {
      await Promise.all([fetchAllHobbies(), fetchUserData()]);
      setLoading(false);
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#1D2D44] flex items-center justify-center">
        <div className="text-white text-lg">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full bg-[#1D2D44] flex items-center justify-center">
        <div className="text-white text-center max-w-lg px-6">
          <h2 className="text-2xl font-semibold mb-2">Unable to load profile</h2>
          <p className="mb-4">{error}</p>
          <p className="text-sm text-white/70">If you believe this is a mistake, try logging in or check your network.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#1D2D44] overflow-auto">
      <div className="flex items-center justify-center py-8 px-4">
        <div className="flex flex-col items-center w-full max-w-xl space-y-6">
          {/* Profile Picture */}
          <img
            src={profilePicUrl || "/default_profile.png"}
            alt="Profile"
            className="rounded-full border-4 border-white object-cover"
            style={{ width: 140, height: 140 }}
          />

          {/* Name */}
          <div className="w-full">
            <label className="block text-white font-mono mb-2 text-sm">Name-Lastname</label>
            <div className="bg-white/10 rounded-lg px-4 py-3 text-white">
              {name || "Not provided"}
            </div>
          </div>

          {/* Phone */}
          <div className="w-full">
            <label className="block text-white font-mono mb-2 text-sm">Phone number</label>
            <div className="bg-white/10 rounded-lg px-4 py-3 text-white">
              {phone || "Not provided"}
            </div>
          </div>

          {/* Email */}
          <div className="w-full">
            <label className="block text-white font-mono mb-2 text-sm">Email</label>
            <div className="bg-white/10 rounded-lg px-4 py-3 text-white">
              {email || "Not provided"}
            </div>
          </div>

          {/* Gender */}
          <div className="w-full">
            <label className="block text-white font-mono mb-2 text-sm">Gender</label>
            <div className="bg-white/10 rounded-lg px-4 py-3 text-white">
              {gender || "Not provided"}
            </div>
          </div>

          {/* Hobbies */}
          <div className="w-full">
            <label className="block text-white font-mono mb-2 text-sm">Hobbies</label>
            <div className="bg-white/10 rounded-lg px-4 py-3 min-h-[50px]">
              {selectedHobbies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {allHobbies
                    .filter((hobby) => selectedHobbies.includes(hobby.ID))
                    .map((hobby) => (
                      <span
                        key={hobby.ID}
                        className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {hobby.Name}
                      </span>
                    ))}
                </div>
              ) : (
                <span className="text-white/70">No hobbies selected</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="w-full">
            <label className="block text-white font-mono mb-2 text-sm">Description</label>
            <div className="bg-white/10 rounded-lg px-4 py-3 text-white min-h-[100px]">
              {description || "No description provided"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';
import getGroups from "@/api/getGroups";
import { GroupCard } from "@/components/ui/GroupCard";
import { Search, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { getUser, getUserCookie } from "@/api/getUser";
import Link from "next/link";

// Types
interface Member {
  id: number;
  name: string;
}

interface RentIn {
  id: number;
  name: string;
}

interface Hobby {
  id: number;
  name: string;
}

interface Group {
  id: number;
  name: string;
  description: string;
  hobbies: Hobby[];
  members: Member[];
  rent_in_id: number;
  rent_in: RentIn;
  max_members?: number;
  created_by?: string;
  is_visible?: number;
}

interface SearchGroupResponse {
  success: boolean;
  message: string;
  data: {
    groups: Group[];
    total: number;
    page: number;
    limit: number;
  };
}

interface SearchFilters {
  name?: string;
  genderRestriction?: string;
  hobbies?: string[];
  rentInProperties?: string[];
}

// Main Component
export default function SearchGroup() {
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  
  // Filter states
  const [gender, setGender] = useState("");
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [propertyName, setPropertyName] = useState("");
  const [allHobbies, setAllHobbies] = useState<Hobby[]>([]);

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

      } catch (error) {
        console.error("Error fetching user data:", error);
      }

    };
    fetchUserData();
    fetchGroups();
    fetchAllHobbies();
  }, []);

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

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters: SearchFilters = {
        name: searchTerm || undefined,
        genderRestriction: gender || undefined,
        hobbies: selectedHobbies.length > 0 ? selectedHobbies : undefined,
        rentInProperties: propertyName ? [propertyName] : undefined,
      };
      
      const result = await getGroups(filters);
      setGroups(result.data.groups);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchGroups();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setGender("");
    setSelectedHobbies([]);
    setPropertyName("");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-slate-800">
      <div className="bg-slate-900 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search"
              className="w-full bg-gray-200 rounded-full px-6 py-3 pr-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <button
              onClick={handleSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <Search className="text-gray-600" size={20} />
            </button>
          </div>
          
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="bg-gray-200 rounded-full px-6 py-3 flex items-center gap-2 hover:bg-gray-300 transition relative"
          >
            <span className="text-gray-600">Filter</span>
            <ChevronDown className={`text-gray-600 transition-transform ${showFilter ? 'rotate-180' : ''}`} size={20} />
          </button>
          
          {/* Profile Picture */}
            <Link href="/tenants/profile">
            <img
                src={profilePicUrl || "/default_profile.png"}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover cursor-pointer"
            />
            </Link>

        </div>

        {/* Inline Filter Dropdown */}
        {showFilter && (
          <div className="mt-4 bg-slate-800 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Group Gender */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Group Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male Only</option>
                  <option value="female">Female Only</option>
                </select>
              </div>
              
              {/* Hobbies */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Hobbies</label>
                <select
                    onChange={(e) => {
                    const value = e.target.value;
                    if (value && !selectedHobbies.includes(value)) {
                        setSelectedHobbies([...selectedHobbies, value]);
                    }
                    e.target.value = "";
                    }}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                    <option value="">Select hobbies</option>

                    {allHobbies.map((hobby) => (
                    <option
                        key={hobby.ID || hobby.id || hobby._id || hobby.Name || hobby.name}
                        value={hobby.Name || hobby.name}
                    >
                        {hobby.Name || hobby.name}
                    </option>
                    ))}
                </select>
              </div>
              
              {/* Preferred Properties */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Property Name</label>
                <input
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="Properties' names"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Selected Hobbies Tags */}
            {selectedHobbies.length > 0 && (
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">Selected Hobbies:</label>
                <div className="flex flex-wrap gap-2">
                  {selectedHobbies.map((hobby) => (
                    <span
                      key={hobby}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {hobby}
                      <button
                        onClick={() => setSelectedHobbies(selectedHobbies.filter(h => h !== hobby))}
                        className="hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  fetchGroups();
                  setShowFilter(true);
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-500 transition font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">Recommended for you</h2>
        
        {loading && (
          <div className="text-white text-center py-8">Loading groups...</div>
        )}
        
        {error && (
          <div className="text-red-400 text-center py-8">Error: {error}</div>
        )}
        
        {!loading && !error && groups.length === 0 && (
          <div className="text-white text-center py-8">No groups found</div>
        )}
        
        <div className="space-y-4">
          {groups
            .filter((group) => group.is_visible === 1)
            .map((group) => (
              <Link href={`/tenants/group/${group.id}`} key={group.id} className="block"
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <GroupCard group={group} />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
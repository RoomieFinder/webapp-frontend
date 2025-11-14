import { useState, useEffect } from "react";
import { getGroups, getUser, getUserCookie, fetchAllHobbies } from "@/api";
import { Group, Hobby, SearchFilters } from "@/types/group";

export function useSearchGroups() {
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

    const init = async () => {
      await fetchUserData();
      await fetchGroups();
      try {
        const data = await fetchAllHobbies();
        if (data?.success) setAllHobbies(data.data || []);
      } catch (err) {
        console.error("Error fetching hobbies:", err);
      }
    };
    init();
  }, []);


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

  return {
    profilePicUrl,
    searchTerm,
    setSearchTerm,
    groups,
    loading,
    error,
    showFilter,
    setShowFilter,
    gender,
    setGender,
    selectedHobbies,
    setSelectedHobbies,
    propertyName,
    setPropertyName,
    allHobbies,
    fetchGroups,
    handleSearch,
    handleKeyPress,
    clearFilters,
  };
}
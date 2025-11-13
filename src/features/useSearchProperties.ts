import { useState, useEffect } from "react";
import getProperties from "@/api/getProperties";
import { getUser, getUserCookie } from "@/api/getUser";
import { Property, PropertySearchFilters } from "@/types/property";

export function useSearchProperties() {
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  
  // Filter states
  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [minRoomSize, setMinRoomSize] = useState("");
  const [maxRoomSize, setMaxRoomSize] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");

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
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters: PropertySearchFilters = {
        name: searchTerm || undefined,
        propertyType: propertyType || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minCapacity: minCapacity ? Number(minCapacity) : undefined,
        maxCapacity: maxCapacity ? Number(maxCapacity) : undefined,
        minRoomSize: minRoomSize ? Number(minRoomSize) : undefined,
        maxRoomSize: maxRoomSize ? Number(maxRoomSize) : undefined,
        province: province || undefined,
        district: district || undefined,
        subDistrict: subDistrict || undefined,
        page,
        limit,
      };
      
      const result = await getProperties(filters);
      setProperties(result.properties);
      setTotal(result.total);
      console.log("API Response:", result); // ADD THIS
console.log("Properties:", result.properties); // ADD THIS
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1); // Reset to first page on new search
    fetchProperties();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Fetch properties with new page
    setTimeout(() => {
      fetchProperties();
    }, 0);
  };

  const clearFilters = () => {
    setPropertyType("");
    setMinPrice("");
    setMaxPrice("");
    setMinCapacity("");
    setMaxCapacity("");
    setMinRoomSize("");
    setMaxRoomSize("");
    setProvince("");
    setDistrict("");
    setSubDistrict("");
    setSearchTerm("");
    setPage(1);
  };

  return {
    profilePicUrl,
    searchTerm,
    setSearchTerm,
    properties,
    loading,
    error,
    showFilter,
    setShowFilter,
    propertyType,
    setPropertyType,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minCapacity,
    setMinCapacity,
    maxCapacity,
    setMaxCapacity,
    minRoomSize,
    setMinRoomSize,
    maxRoomSize,
    setMaxRoomSize,
    province,
    setProvince,
    district,
    setDistrict,
    subDistrict,
    setSubDistrict,
    page,
    total,
    limit,
    fetchProperties,
    handleSearch,
    handleKeyPress,
    handlePageChange,
    clearFilters,
  };
}
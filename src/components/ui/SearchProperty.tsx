'use client';
import SearchHeader from "@/components/ui/SearchHeader";
import PropertyFilterPanel from "@/components/ui/PropertyFilterPanel";
import PropertyList from "@/components/ui/PropertyList";
import { useSearchProperties } from "@/features/useSearchProperties";

export default function SearchProperty() {
  const {
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
  } = useSearchProperties();

  return (
    <div className="min-h-screen bg-slate-800">
      <SearchHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleKeyPress={handleKeyPress}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        profilePicUrl={profilePicUrl}
      />
      
      <PropertyFilterPanel
        showFilter={showFilter}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minCapacity={minCapacity}
        setMinCapacity={setMinCapacity}
        maxCapacity={maxCapacity}
        setMaxCapacity={setMaxCapacity}
        minRoomSize={minRoomSize}
        setMinRoomSize={setMinRoomSize}
        maxRoomSize={maxRoomSize}
        setMaxRoomSize={setMaxRoomSize}
        province={province}
        setProvince={setProvince}
        district={district}
        setDistrict={setDistrict}
        subDistrict={subDistrict}
        setSubDistrict={setSubDistrict}
        fetchProperties={fetchProperties}
        clearFilters={clearFilters}
      />
      
      <PropertyList
        properties={properties}
        loading={loading}
        error={error}
        total={total}
        page={page}
        limit={limit}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
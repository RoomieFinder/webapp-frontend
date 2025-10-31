'use client';
import SearchHeader from "@/components/ui/SearchHeader";
import FilterPanel from "@/components/ui/FilterPanel";
import GroupList from "@/components/ui/GroupList";
import { useSearchGroups } from "@/features/useSearchGroups";

export default function SearchGroup() {
  const {
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
  } = useSearchGroups();

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
      
      <FilterPanel
        showFilter={showFilter}
        gender={gender}
        setGender={setGender}
        selectedHobbies={selectedHobbies}
        setSelectedHobbies={setSelectedHobbies}
        propertyName={propertyName}
        setPropertyName={setPropertyName}
        allHobbies={allHobbies}
        fetchGroups={fetchGroups}
        clearFilters={clearFilters}
      />
      
      <GroupList
        groups={groups}
        loading={loading}
        error={error}
      />
    </div>
  );
}
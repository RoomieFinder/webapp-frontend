import { Hobby } from "@/types/group";

interface FilterPanelProps {
  showFilter: boolean;
  gender: string;
  setGender: (gender: string) => void;
  selectedHobbies: string[];
  setSelectedHobbies: (hobbies: string[]) => void;
  propertyName: string;
  setPropertyName: (name: string) => void;
  allHobbies: Hobby[];
  fetchGroups: () => void;
  clearFilters: () => void;
}

export default function FilterPanel({
  showFilter,
  gender,
  setGender,
  selectedHobbies,
  setSelectedHobbies,
  propertyName,
  setPropertyName,
  allHobbies,
  fetchGroups,
  clearFilters
}: FilterPanelProps) {
  if (!showFilter) return null;

  return (
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
                key={hobby.id || hobby.Name}
                value={hobby.Name}
              >
                {hobby.Name}
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
          onClick={fetchGroups}
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
  );
}
interface PropertyFilterPanelProps {
  showFilter: boolean;
  propertyType: string;
  setPropertyType: (type: string) => void;
  minPrice: string;
  setMinPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  minCapacity: string;
  setMinCapacity: (capacity: string) => void;
  maxCapacity: string;
  setMaxCapacity: (capacity: string) => void;
  minRoomSize: string;
  setMinRoomSize: (size: string) => void;
  maxRoomSize: string;
  setMaxRoomSize: (size: string) => void;
  province: string;
  setProvince: (province: string) => void;
  district: string;
  setDistrict: (district: string) => void;
  subDistrict: string;
  setSubDistrict: (subDistrict: string) => void;
  fetchProperties: () => void;
  clearFilters: () => void;
}

export default function PropertyFilterPanel({
  showFilter,
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
  fetchProperties,
  clearFilters
}: PropertyFilterPanelProps) {
  if (!showFilter) return null;

  const propertyTypes = ["Condo", "Apartment", "House", "Dormitory"];

  return (
    <div className="mt-4 bg-slate-800 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Property Type */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Property Type</label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="">All Types</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Min Price (฿)</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 placeholder-gray-400"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Max Price (฿)</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="No limit"
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 placeholder-gray-400"
          />
        </div>

        {/* Min Capacity */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Min Capacity</label>
          <input
            type="number"
            value={minCapacity}
            onChange={(e) => setMinCapacity(e.target.value)}
            placeholder="1"
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 placeholder-gray-400"
          />
        </div>

        {/* Max Capacity */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Max Capacity</label>
          <input
            type="number"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(e.target.value)}
            placeholder="No limit"
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 placeholder-gray-400"
          />
        </div>

        {/* Min Room Size */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Min Room Size (m²)</label>
          <input
            type="number"
            value={minRoomSize}
            onChange={(e) => setMinRoomSize(e.target.value)}
            placeholder="0"
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 placeholder-gray-400"
          />
        </div>

        {/* Max Room Size */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Max Room Size (m²)</label>
          <input
            type="number"
            value={maxRoomSize}
            onChange={(e) => setMaxRoomSize(e.target.value)}
            placeholder="No limit"
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 placeholder-gray-400"
          />
        </div>

        {/* Province */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Province</label>
          <input
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            placeholder="e.g., Bangkok"
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 placeholder-gray-400"
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">District</label>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="e.g., Khlong Toei"
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 placeholder-gray-400"
          />
        </div>

        {/* Sub-District */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Sub-District</label>
          <input
            type="text"
            value={subDistrict}
            onChange={(e) => setSubDistrict(e.target.value)}
            placeholder="e.g., คลองเตย"
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={fetchProperties}
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
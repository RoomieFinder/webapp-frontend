import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {property.placeName}
            </h3>
            <p className="text-sm text-gray-600">{property.caption}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {property.type}
          </span>
          <span>Capacity: {property.capacity} people</span>
          <span>Size: {property.roomSize} m²</span>
        </div>
        
        <div className="text-sm text-gray-600 mb-2">
          📍 {property.districtName}, {property.provinceName}
        </div>
        
        <div className="text-lg font-bold text-blue-600">
          ฿{property.rentalFee.toLocaleString()}/month
        </div>
      </div>
      
      <div className="flex gap-2">
        {property.pictures.slice(0, 3).map((pic, index) => (
          <img
            key={index}
            src={pic}
            alt={`${property.placeName} ${index + 1}`}
            className="w-24 h-24 object-cover rounded-lg"
          />
        ))}
      </div>
      
      <button className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition">
        Book
      </button>
    </div>
  );
}
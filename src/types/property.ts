export interface Property {
  id: number;
  placeName: string;
  caption: string;
  type: string;
  rentalFee: number;
  capacity: number;
  roomSize: number;
  description: string;
  isEmpty: boolean;
  pictures: string[];
  subDistrictName: string;
  districtName: string;
  provinceName: string;
}

export interface PropertySearchFilters {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  maxCapacity?: number;
  minCapacity?: number;
  minRoomSize?: number;
  maxRoomSize?: number;
  province?: string;
  district?: string;
  subDistrict?: string;
  page: number;
  limit: number;
}

export interface PropertySearchResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
}
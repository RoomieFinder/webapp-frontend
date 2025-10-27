
export interface Property {
  id: number;
  placeName: string;
  caption: string;
  type: string;
  rentalFee: number;
  capacity: number;
  roomSize: number;
  description: string;
  pictures: string[]; // เพราะ API ส่ง array ของ string
  subDistrictName: string;
  districtName: string;
  provinceName: string;
  isPreferred?: boolean;
}

import { Property } from "./property";

// Types
export interface Member {
  id: number;
  userId: number;
  role: string;
  personalPicture?: string | null;
  name?: string;
}

export interface RentIn {
  id: number;
  placeName: string;
  caption: string;
  type: string;
  address: string;
  description: string;
  rentalFee: number;
  capacity: number;
  roomSize: number;
}


export interface Hobby {
  id: number;
  Name: string;
  name: string;
}

export interface Group {
  id: number;
  name: string;
  genderRestriction: "male" | "female" | "none";
  description: string;
  createdAt: string;
  hobbies: Hobby[];
  members: Member[];
  rent_in_id: number;
  rent_in: RentIn;
  max_members?: number;
  group_picture?: string;
  created_by?: string;
  preferredProperties: Property[];
  leaderId: number;
  is_visible?: number;
}

export interface SearchGroupResponse {
  success: boolean;
  message: string;
  data: {
    groups: Group[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface SearchFilters {
  name?: string;
  genderRestriction?: string;
  hobbies?: string[];
  rentInProperties?: string[];
}

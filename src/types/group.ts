import { Property } from "./property";
import { Member } from "./member";
import { RentIn } from "./rentIn";

// Types
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

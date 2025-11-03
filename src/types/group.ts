import { Member, Properties, RentIn } from "@/types";

export interface Group {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  hobbies: string[];
  members: Member[];
  rentIn: RentIn;
  preferredProperties: Properties[];
  leaderId: number;
  visibility: number;
}

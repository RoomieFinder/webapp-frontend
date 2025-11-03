// src/types/member.ts
export interface Member {
  id: number;
  userId: number;
  role: string;
  personalPicture?: string | null;
  name?: string;
  isPending?: boolean;
}
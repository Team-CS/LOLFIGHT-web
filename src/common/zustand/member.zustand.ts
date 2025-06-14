import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MemberDTO } from "../DTOs/member/member.dto";

interface MemberState {
  member: MemberDTO | null;
  setMember: (member: MemberDTO | null) => void;
  updateMember: (partial: Partial<MemberDTO>) => void;
}

export const useMemberStore = create(
  persist<MemberState>(
    (set) => ({
      member: null,
      setMember: (member) => set({ member }),
      updateMember: (partial) =>
        set((state) => ({
          member: state.member ? { ...state.member, ...partial } : null,
        })),
    }),
    {
      name: "member-store", // localStorage key
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MemberDto } from "../DTOs/member/member.dto";

interface MemberState {
  member: MemberDto | null;
  setMember: (member: MemberDto | null) => void;
  updateMember: (partial: Partial<MemberDto>) => void;
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
      name: "member-store",
    }
  )
);

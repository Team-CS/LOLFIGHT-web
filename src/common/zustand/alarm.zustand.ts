import { getMyInviteList } from "@/src/api/guild_team.api";
import { getScrimApplicationList } from "@/src/api/scrim.api";
import { create } from "zustand";
import { GuildTeamInviteDto } from "../DTOs/guild/guild_team/guild_team_invite.dto";
import { ScrimApplicationDto } from "../DTOs/scrim/scrim_application.dto";
import { GuildInviteDto } from "../DTOs/guild/guild_invite.dto";

interface AlarmState {
  hasAlarm: boolean;
  teamInvites: GuildTeamInviteDto[];
  setTeamInvites: (
    updater:
      | GuildTeamInviteDto[]
      | ((prev: GuildTeamInviteDto[]) => GuildTeamInviteDto[])
  ) => void;
  applications: ScrimApplicationDto[];
  setApplications: (
    updater:
      | ScrimApplicationDto[]
      | ((prev: ScrimApplicationDto[]) => ScrimApplicationDto[])
  ) => void;
  isMatched: boolean;
  loading: boolean;
  checkAlarms: () => Promise<void>;
  clearAlarms: () => void;
}

export const useAlarmStore = create<AlarmState>((set) => ({
  hasAlarm: false,
  teamInvites: [],
  applications: [],
  isMatched: false,
  loading: false,

  // ✅ 알림 확인 함수
  checkAlarms: async () => {
    set({ loading: true });
    try {
      const [inviteRes, scrimRes] = await Promise.all([
        getMyInviteList(),
        getScrimApplicationList(),
      ]);

      const invites = inviteRes.data.data || [];
      const scrims = scrimRes.data.data || [];

      const hasInvite = invites.length > 0;
      const hasAcceptedScrim = scrims.some(
        (app: ScrimApplicationDto) => app.status === "ACCEPTED"
      );

      set({
        teamInvites: invites,
        applications: scrims,
        isMatched: hasAcceptedScrim,
        hasAlarm: hasInvite || hasAcceptedScrim,
      });
    } catch (error) {
      console.error("🔔 알림 조회 실패:", error);
    } finally {
      set({ loading: false });
    }
  },

  clearAlarms: () =>
    set({
      hasAlarm: false,
      teamInvites: [],
      applications: [],
      isMatched: false,
    }),

  setApplications: (updater) =>
    set((state) => ({
      applications:
        typeof updater === "function" ? updater(state.applications) : updater,
    })),
  setTeamInvites: (updater) =>
    set((state) => ({
      teamInvites:
        typeof updater === "function" ? updater(state.teamInvites) : updater,
    })),
}));

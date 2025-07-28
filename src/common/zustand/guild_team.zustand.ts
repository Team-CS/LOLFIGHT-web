import { create } from "zustand";
import { GuildTeamDto } from "../DTOs/guild/guild_team/guild_team.dto";

interface GuildTeamState {
  guildTeam: GuildTeamDto | null;
  setGuildTeam: (team: GuildTeamDto | null) => void;
  updateGuildTeam: (partial: Partial<GuildTeamDto>) => void;
}

export const useGuildTeamStore = create<GuildTeamState>((set) => ({
  guildTeam: null,
  setGuildTeam: (team) => set({ guildTeam: team }),
  updateGuildTeam: (partial) =>
    set((state) => ({
      guildTeam: state.guildTeam ? { ...state.guildTeam, ...partial } : null,
    })),
}));

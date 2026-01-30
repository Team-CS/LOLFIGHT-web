import {
  GuildChampionStatsDto,
  GuildChampionStatsListResponseDto,
} from "../common/DTOs/guild/guild_champion_stats.dto";
import { GuildMemberChampionStatsDto } from "../common/DTOs/guild/guild_member_champion_stats.dto";
import { ResponseDto } from "../common/DTOs/response.dto";
import constant from "../common/constant/constant";
import axios, { AxiosResponse } from "axios";

const baseUrl = `${constant.SERVER_URL}/guild_stats`;

export const getGuildChampionStats = async (
  guildId: string,
  page: number,
  limit: number,
): Promise<AxiosResponse<ResponseDto<GuildChampionStatsListResponseDto>>> => {
  let url = `${baseUrl}/${guildId}/champion-stats`;
  let queryParams = `?page=${page}&limit=${limit}`;

  url += queryParams;

  return await axios.get(url);
};

export const getMostGuildChampionStats = async (
  guildId: string,
  limit: number,
): Promise<AxiosResponse<ResponseDto<GuildChampionStatsDto[]>>> => {
  let url = `${baseUrl}/${guildId}/most-played`;

  if (limit) {
    url += `?limit=${limit}`;
  }
  return await axios.get(url);
};

export const getMemberChampionStats = async (
  guildId: string,
  memberId: string,
  limit: number,
): Promise<AxiosResponse<ResponseDto<GuildMemberChampionStatsDto[]>>> => {
  let url = `${baseUrl}/${guildId}/member/${memberId}/champion-stats`;
  if (limit) {
    url += `?limit=${limit}`;
  }
  return await axios.get(url);
};

export const getMostMemberChampionStats = async (
  guildId: string,
  memberId: string,
  limit: number,
): Promise<AxiosResponse<ResponseDto<GuildMemberChampionStatsDto[]>>> => {
  let url = `${baseUrl}/${guildId}/member/${memberId}/most-played`;
  if (limit) {
    url += `?limit=${limit}`;
  }
  return await axios.get(url);
};

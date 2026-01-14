import { BetStatus, ProMatchStatus } from "../../types/enums/bet.enum";
import { BaseDto } from "../base.dto";
import { PaginationDto } from "../pagination.dto";

export interface ProMatchDto {
  id: string;
  riotMatchId: string;
  leagueName: string;
  leagueSlug: string;
  startTime: Date;
  teamACode: string;
  teamAName: string;
  teamAImage: string | null;
  teamBCode: string;
  teamBName: string;
  teamBImage: string | null;
  status: ProMatchStatus;
  winnerTeamCode: string | null;
  totalVoteCount: number;
  teamAVoteCount: number;
  teamBVoteCount: number;
  bestOf: number;
  blockName: string | null;
}

export interface BetDto {
  id: string;
  proMatch: ProMatchDto;
  memberId: string;
  betTeamCode: string;
  status: BetStatus;
}

export interface CreateBetDto {
  proMatchId: string;
  betTeamCode: string;
  // betAmount: number;
}

export interface ProMatchWithBetsDto extends ProMatchDto {
  bets: BetDto[];
}

export interface BetListResponseDto extends BaseDto {
  betList: BetDto[];
  pagination: PaginationDto;
}

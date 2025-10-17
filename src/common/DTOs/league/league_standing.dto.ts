// 팀 경기 결과
export interface TeamResultDto {
  gameWins: number;
  outcome: "win" | "loss" | "draw" | string;
}

// 팀 기록 (순위용)
export interface TeamRecordDto {
  wins: number;
  losses: number;
}

// 경기 내 팀 정보
export interface MatchTeamDto {
  code: string;
  image: string;
  name: string;
  id?: string;
  slug?: string;
  result?: TeamResultDto;
  record?: TeamRecordDto;
}

// 경기 정보
export interface MatchDto {
  id: string;
  state: "completed" | "scheduled" | "ongoing" | string;
  teams: MatchTeamDto[];
  previousMatchIds?: string[];
  flags?: string;
}

// 순위 정보
export interface RankingDto {
  ordinal: number;
  teams: MatchTeamDto[];
}

// 스테이지 내 섹션
export interface StageSectionDto {
  name: string;
  matches: MatchDto[];
  rankings: RankingDto[];
}

// 스테이지 정보
export interface StageDto {
  name: string;
  type: "groups" | "playoffs" | string;
  slug: string;
  sections: StageSectionDto[];
}

// standings 정보
export interface StandingDto {
  stages: StageDto[];
}

// 최상위 응답 DTO
export interface StandingsResponseDto {
  data: {
    standings: StandingDto[];
  };
}

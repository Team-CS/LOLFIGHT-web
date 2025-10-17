// league_schedule.dto.ts

/** 팀의 경기 기록 */
export interface MatchTeamRecordDto {
  wins: number;
  losses: number;
}

/** 팀의 경기 결과 */
export interface MatchTeamResultDto {
  gameWins: number;
  outcome: "win" | "loss" | "draw" | null;
}

/** 경기 팀 정보 */
export interface MatchTeamDto {
  code: string;
  image: string;
  name: string;
  result?: MatchTeamResultDto;
  record?: MatchTeamRecordDto;
}

/** 경기 전략 정보 (BO1, BO3 등) */
export interface MatchStrategyDto {
  count: number; // 예: 3 → BO3
  type: string; // 예: "bestOf"
}

/** 개별 경기 정보 */
export interface MatchDto {
  id: string;
  strategy: MatchStrategyDto;
  teams: MatchTeamDto[];
}

/** 소속 리그 정보 */
export interface LeagueInfoDto {
  name: string;
  slug: string; // 예: "lck", "worlds", "msi"
}

/** 개별 이벤트(매치, 방송 블록 등) */
export interface ScheduleEventDto {
  startTime: string; // ISO 8601 UTC (예: "2025-10-16T03:33:43Z")
  blockName?: string;
  match?: MatchDto;
  state: "completed" | "inProgress" | "unstarted";
  type: string; // "match" 등
  league: LeagueInfoDto;
}

/** 페이지 정보 (다음/이전 pageToken) */
export interface SchedulePageInfoDto {
  older?: string;
  newer?: string;
}

/** 일정 데이터 */
export interface ScheduleDto {
  updated: string;
  pages: SchedulePageInfoDto;
  events: ScheduleEventDto[];
}

/** 전체 API 응답 구조 */
export interface ScheduleResponseDto {
  data: {
    schedule: ScheduleDto;
  };
}

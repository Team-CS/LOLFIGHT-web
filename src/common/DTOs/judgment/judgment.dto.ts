import { BaseDto } from "../base.dto";
import { MemberDto } from "../member/member.dto";
import { PaginationDto } from "../pagination.dto";
import { JudgmentVoteDto } from "./judgment_vote.dto";

export interface JudgmentDto extends BaseDto {
  id: number;
  judgmentTitle: string;
  judgmentDesc: string;
  judgmentView: number;
  judgmentLeftChampion: string;
  judgmentLeftName: string;
  judgmentLeftTier: string;
  judgmentLeftLine: string;
  judgmentRightChampion: string;
  judgmentRightName: string;
  judgmentRightTier: string;
  judgmentRightLine: string;
  judgmentVideo: string;
  votes: JudgmentVoteDto[];
  member: MemberDto;
}

export interface JudgmentCreateDto extends BaseDto {
  id: number;
  judgmentTitle: string;
  judgmentDesc: string;
  judgmentView: number;
  judgmentLeftChampion: string;
  judgmentLeftName: string;
  judgmentLeftTier: string;
  judgmentLeftLine: string;
  judgmentRightChampion: string;
  judgmentRightName: string;
  judgmentRightTier: string;
  judgmentRightLine: string;
  judgmentVideo: string;
  votes: JudgmentVoteDto[];
}

export interface JudgmentListResponseDto extends BaseDto {
  judgmentList: JudgmentDto[];
  pagination: PaginationDto;
}

import { BaseDto } from "../base.dto";
import { MemberDto } from "../member/member.dto";
import { JudgmentDto } from "./judgment.dto";

export interface JudgmentVoteDto extends BaseDto {
  id: number;
  judgment: JudgmentDto;
  member: MemberDto;
  voteSide: string;
}

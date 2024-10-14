import { BaseDTO } from "../base.dto";

export interface JudgmentDTO extends BaseDTO {
  id: number;
  judgmentWriter: string;
  judgmentTitle: string;
  judgmentDesc: string;
  judgmentView: number;
  judgmentLeftChampion: string;
  judgmentLeftName: string;
  judgmentLeftTier: string;
  judgmentLeftLine: string;
  judgmentLeftLike: number;
  judgmentRightChampion: string;
  judgmentRightName: string;
  judgmentRightTier: string;
  judgmentRightLine: string;
  judgmentRightLike: number;
  judgmentVideo: string;
}

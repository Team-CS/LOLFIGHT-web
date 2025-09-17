export interface CreateReportDto {
  type: string;
  targetId: string;
  board?: string;
  targetMemberId: string;
  reporterId: string;
  reason: string;
}

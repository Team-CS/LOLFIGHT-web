export enum ProMatchStatus {
  UPCOMING = "upcoming", // 경기 예정
  LIVE = "live", // 경기 진행 중
  COMPLETED = "completed", // 경기 완료
  CANCELLED = "cancelled", // 경기 취소
}

export enum BetStatus {
  PENDING = "pending", // 경기 전
  WON = "won", // 승리
  LOST = "lost", // 패배
  CANCELLED = "cancelled", // 취소됨 (경기 취소 등)
  REFUNDED = "refunded", // 환불됨
}

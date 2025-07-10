export const getTierStyle = (tier: string | undefined) => {
  if (!tier) return "";

  const baseTier = tier.split(" ")[0].toUpperCase();

  switch (baseTier) {
    case "BRONZE":
      return "text-[#cd7f32] font-medium"; // 브론즈 (청동)
    case "SILVER":
      return "text-[#A6A9AA] font-semibold"; // 실버 (은색)
    case "GOLD":
      return "text-[#e3c314] font-semibold"; // 골드 (금색)
    case "PLATINUM":
      return "text-[#40c2ff] font-bold"; // 플래티넘 (청록)
    case "EMERALD":
      return "text-[#50c878] font-bold"; // 에메랄드 (녹색 계열)
    case "DIAMOND":
      return "text-[#5b7fff] font-bold"; // 다이아 (파란 보석)
    case "MASTER":
      return "text-[#ff44aa] font-extrabold"; // 마스터 (핑크톤)
    case "GRANDMASTER":
      return "text-[#ff3333] font-extrabold"; // 그마 (레드)
    case "CHALLENGER":
      return "bg-gradient-to-t from-[#00eaff] via-[#36bfff] to-[#a8e2ff] text-transparent bg-clip-text drop-shadow-[0_0_1px_#00eaff] font-extrabold";

    default:
      return "text-white";
  }
};

export const calGuildTier = (ladderPoint: number) => {
  const tierScoreMap = {
    BRONZE: 1200,
    SILVER: 1400,
    GOLD: 1600,
    PLATINUM: 1900,
    DIAMOND: 2200,
    MASTER: 2600,
    GRANDMASTER: 3000,
    CHALLENGER: 3500,
  };

  if (ladderPoint >= tierScoreMap["CHALLENGER"]) {
    return "CHALLENGER";
  } else if (ladderPoint >= tierScoreMap["GRANDMASTER"]) {
    return "GRANDMASTER";
  } else if (ladderPoint >= tierScoreMap["MASTER"]) {
    return "MASTER";
  } else if (ladderPoint >= tierScoreMap["DIAMOND"]) {
    return "DIAMOND";
  } else if (ladderPoint >= tierScoreMap["PLATINUM"]) {
    return "PLATINUM";
  } else if (ladderPoint >= tierScoreMap["GOLD"]) {
    return "GOLD";
  } else if (ladderPoint >= tierScoreMap["SILVER"]) {
    return "SILVER";
  } else {
    return "BRONZE";
  }
};

export function formatKoreanDatetime(datetimeStr: string): string {
  const date = new Date(datetimeStr);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0부터 시작하니까 +1
  const day = date.getDate();

  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? "오후" : "오전";
  hours = hours % 12;
  if (hours === 0) hours = 12; // 12시 표현

  // 두 자리 숫자 만들기
  const mm = month.toString().padStart(2, "0");
  const dd = day.toString().padStart(2, "0");
  const hh = hours.toString().padStart(2, "0");
  const min = minutes.toString().padStart(2, "0");

  return `${year}-${mm}-${dd} ${ampm} ${hh}시 ${min}분`;
}

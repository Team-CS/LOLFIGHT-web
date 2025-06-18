export const getTierStyle = (tier: string | undefined) => {
  if (!tier) return "";

  const baseTier = tier.split(" ")[0].toUpperCase();

  switch (baseTier) {
    case "BRONZE":
      return "text-[#cd7f32] font-medium"; // 브론즈 (청동)
    case "SILVER":
      return "text-[#c0c0c0] font-semibold"; // 실버 (은색)
    case "GOLD":
      return "text-[#ffd700] font-semibold"; // 골드 (금색)
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

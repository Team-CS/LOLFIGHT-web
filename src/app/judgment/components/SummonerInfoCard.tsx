import constant from "@/src/common/constant/constant";

export const SummonerInfoCard = ({
  name,
  line,
  tier,
  championId,
  align = "left",
}: {
  name?: string;
  line?: string;
  tier?: string;
  championId?: string;
  align?: "left" | "right";
}) => {
  return (
    <div
      className={`flex items-center ${
        align === "left" ? "flex-row-reverse" : "flex-row"
      } gap-[24px]`}
    >
      {championId && (
        <img
          src={`${constant.SERVER_URL}/public/champions/${championId}.png`}
          className="w-[70px] h-[70px] rounded-[12px]"
          alt="champion"
        />
      )}
      <div className="flex flex-col w-[260px] text-[14px] gap-[4px]">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">소환사명:</span>
          <span className="font-medium">{name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">라인:</span>
          <span className="font-medium">{line}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">티어:</span>
          <div className="flex items-center gap-[4px] font-medium">
            {tier}
            {tier && (
              <img
                src={`${constant.SERVER_URL}/public/rank/${
                  tier.split(" ")[0]
                }.png`}
                className="w-[24px] h-[24px]"
                alt="tier"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

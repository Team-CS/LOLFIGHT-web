import constant from "@/src/common/constant/constant";
import { getTierStyle } from "@/src/utils/string/string.util";

const TeamMemberCard = () => {
  return (
    <div
      className="flex w-full items-center justify-center border border-brandborder rounded-lg bg-no-repeat bg-center dark:branddarkborder"
      style={{
        backgroundImage: `url(${constant.SERVER_URL}/public/rank/GOLD.png)`,
        backgroundColor: "#f0f6fd",
        backgroundSize: "50%",
      }}
    >
      <div className="flex w-full items-center justify-between bg-white/70 rounded-md px-[8px] py-[8px] gap-[12px] shadow-sm dark:bg-black/70">
        <div className="flex items-center gap-[8px]">
          <p className="text-[14px] font-semibold dark:text-white">dddd</p>
          <p className="text-[14px] dark:text-white">
            남탓을해도된다우린남이니깐#KR1
          </p>
        </div>
        <div className="flex items-center gap-[8px]">
          <img
            src={`${constant.SERVER_URL}/public/rank/GOLD.png`}
            className="w-[30px] h-[30px]"
          />
          <p className="text-[14px]">
            <span className={getTierStyle("GOLD")}>GOLD IV</span>
          </p>
          <div className="text-[14px] px-[4px] py-[2px] rounded-md bg-brandhover text-branddark font-medium">
            TOP
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;

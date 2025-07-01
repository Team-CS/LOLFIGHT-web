import constant from "@/src/common/constant/constant";
import { getTierStyle } from "@/src/utils/string/string.util";
import TeamMemberCard from "./components/TeamMemberCard";

export default function Page() {
  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-[24px] py-[28px]">
      {/* Team Info */}
      <div className="flex flex-col w-full p-[32px] shadow-md rounded-[12px] gap-[12px] dark:bg-branddark">
        {/* Team Info Header */}
        <div className="flex gap-[12px] items-center">
          <img
            src="/LOLFIGHT_NONE_TEXT.png"
            alt="logo"
            className="cursor-pointer w-[50px] h-[50px]"
          />
          <p className="text-[24px] font-medium">길드명</p>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <TeamMemberCard />
            <TeamMemberCard />
            <TeamMemberCard />
            <TeamMemberCard />
            <TeamMemberCard />
          </div>
          <div className="flex flex-col gap-[4px]">
            <TeamMemberCard />
            <TeamMemberCard />
            <TeamMemberCard />
            <TeamMemberCard />
            <TeamMemberCard />
          </div>
        </div>
        {/* Team Info Member */}
      </div>

      {/* Battle Team List */}
      <div className="w-full p-[32px] shadow-md rounded-[12px] dark:bg-branddark"></div>
    </div>
  );
}

"use client";
import React from "react";
import { inviteGuild } from "@/src/api/guild.api";
import { useRouter } from "next/navigation";
import CustomAlert from "../../../../common/components/alert/CustomAlert";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import constant from "@/src/common/constant/constant";

interface Props {
  GuildDto: GuildDto;
}

const GuildBanner = (props: Props) => {
  const { GuildDto } = props;
  const router = useRouter();
  const { member } = useMemberStore();

  const handleClickInviteGuild = () => {
    if (member && GuildDto.id !== null && GuildDto.id !== undefined) {
      inviteGuild(member.id, GuildDto.id)
        .then((response) => {
          CustomAlert("success", "길드가입", "길드 가입신청이 완료되었습니다.");
        })
        .catch((error) => {
          CustomAlert(
            "warning",
            "길드가입",
            "이미 신청한 길드이거나, 이미 가입된 길드가 있습니다."
          );
        });
    } else {
      CustomAlert("warning", "길드가입", "로그인후 이용할 수 있습니다.");
      router.push("/register");
    }
  };

  return (
    <div className="w-full bg-brandcolor dark:bg-branddark">
      <div className="max-w-[1200px] mx-auto py-[24px] flex justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <img
            className="h-[75px] w-[75px] object-cover rounded-md"
            src={`${constant.SERVER_URL}/${GuildDto.guildIcon}`}
            alt="GuildIcon"
          />
          <div className="flex flex-col gap-[4px]">
            <p className="text-white text-sm font-medium">
              롤파이트 공식리그 - 1부리그 -{GuildDto.guildRecord?.recordRanking}
              위
            </p>
            <div className="flex items-center gap-[12px]">
              <h2 className="text-white text-2xl font-extrabold">
                {GuildDto.guildName}
              </h2>
              <button
                aria-label="길드가입"
                onClick={handleClickInviteGuild}
                className="px-[12px] py-[4px] bg-white text-sm font-semibold text-brandcolor rounded hover:bg-gray-100 transition"
              >
                길드가입
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[4px] text-white text-sm">
          <p className="font-medium">길드 마스터: {GuildDto.guildMaster}</p>
          <p className="font-medium">클랜원:{GuildDto.guildMembers.length}명</p>
          <p className="font-medium">
            길드 설립일: {GuildDto.createdAt?.toString()?.split("T")[0]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuildBanner;

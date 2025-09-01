"use client";
import React from "react";
import { inviteGuild } from "@/src/api/guild.api";
import { useRouter } from "next/navigation";
import CustomAlert from "../../../../common/components/alert/CustomAlert";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import constant from "@/src/common/constant/constant";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

interface Props {
  guild: GuildDto;
}

const GuildBanner = (props: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { guild } = props;
  const { member } = useMemberStore();

  const handleClickInviteGuild = () => {
    if (member && guild.id !== null && guild.id !== undefined) {
      if (guild.guildMembers.length === guild.maxMembers) {
        CustomAlert(
          "error",
          "길드가입",
          "가입하려는 길드의 정원 수가 초과되었습니다."
        );
        return;
      }
      inviteGuild(member.id, guild.id)
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
    }
  };

  return (
    <div className="w-full bg-brandcolor dark:bg-branddark">
      <div
        className={`max-w-[1200px] mx-auto py-[24px] flex justify-between items-center ${
          isMobile && "px-[12px]"
        }`}
      >
        <div className="flex items-center gap-[12px]">
          <img
            className=" object-cover rounded-md"
            src={`${constant.SERVER_URL}/${guild.guildIcon}`}
            width={isMobile ? 50 : 75}
            height={isMobile ? 50 : 75}
            alt="GuildIcon"
          />
          <div className="flex flex-col gap-[4px]">
            <p
              className={`text-white font-medium ${
                isMobile ? "text-[10px]" : "text-[14px]"
              }`}
            >
              롤파이트 공식리그 - 1부리그 -{guild.guildRecord?.recordRanking}위
            </p>
            <div className="flex items-center gap-[12px]">
              <h2
                className={`text-white font-extrabold ${
                  isMobile ? "text-[20px]" : "text-[24px]"
                }`}
              >
                {guild.guildName}
              </h2>
              <button
                aria-label="길드가입"
                onClick={handleClickInviteGuild}
                className={`bg-white font-semibold text-brandcolor rounded hover:bg-gray-100 transition ${
                  isMobile
                    ? "px-[8px] py-[2px] text-[12px]"
                    : "px-[12px] py-[4px] text-[14px]"
                }`}
              >
                길드가입
              </button>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col text-white ${
            isMobile ? "text-[10px] gap-[2px]" : "text-[14px] gap-[4px]"
          }`}
        >
          <p className="font-medium">길드 마스터 : {guild.guildMaster}</p>
          <p className="font-medium">
            길드원 : {guild.guildMembers.length}{" "}
            <span className="text-brandhover"> / {guild.maxMembers}</span>
          </p>
          <p className="font-medium">
            길드 설립일: {guild.createdAt?.toString()?.split("T")[0]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuildBanner;

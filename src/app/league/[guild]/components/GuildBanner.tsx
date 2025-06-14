"use client";
import React from "react";
import { inviteGuild } from "@/src/api/guild.api";
import { useRouter } from "next/navigation";
import CustomAlert from "../../../../common/components/alert/CustomAlert";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { GuildDTO } from "@/src/common/DTOs/guild/guild.dto";
import constant from "@/src/common/constant/constant";

interface Props {
  guildDto: GuildDTO;
}

const GuildBanner = (props: Props) => {
  const { guildDto } = props;
  const router = useRouter();
  const { member } = useMemberStore();

  const handleClickInviteGuild = () => {
    if (member && guildDto.id !== null && guildDto.id !== undefined) {
      inviteGuild(member.id, guildDto.id)
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
      <section className="w-1200px mx-auto h-44 flex justify-between items-center ">
        {/* Left */}
        <div className="w-1200px flex flex-col justify-center">
          <div className="flex flex-row pb-[8px]">
            <img
              className="h-[50px] w-[50px] object-cover"
              src={`${constant.SERVER_URL}/${guildDto.guildIcon}`}
              alt="GuildIcon"
            />
            <div className="flex flex-col ml-3">
              <div className="font-extra text-white text-12px mt-1">
                롤파이트 공식리그 - 1부리그 -
                {guildDto.guildRecord?.recordRanking}위
              </div>
              <div className="font-extrabold text-white text-24px">
                {guildDto.guildName}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              aria-label="길드가입"
              className="flex text-black bg-white w-24 h-10 items-center justify-center cursor-pointer rounded hover:bg-gray-200"
              onClick={handleClickInviteGuild}
            >
              길드가입
            </button>
          </div>
        </div>
        {/* Right */}
        <div className="w-350px h-full flex flex-col justify-end pb-4">
          <div className="flex mt-3">
            <div className=" text-white text-14px">
              길드 마스터: {guildDto.guildMaster}
            </div>
            <p className="text-white font-thin ml-2 mr-2"> | </p>
            <div className="text-white text-14px">
              클랜원: {guildDto.guildMembers.length} 명
            </div>
          </div>
          <div className="text-white text-14px mt-3  mb-5">
            길드 설립일: {guildDto.createdAt?.toString()?.split("T")[0]}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuildBanner;

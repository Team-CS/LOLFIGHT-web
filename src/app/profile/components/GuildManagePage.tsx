import { useRouter } from "next/navigation";
import { FaRegQuestionCircle, FaArrowCircleRight } from "react-icons/fa";
import constant from "@/src/common/constant/constant";
import { useEffect, useState } from "react";
import CustomAlert from "../../../common/components/alert/CustomAlert";
import {
  destroyGuild,
  getGuildInfo,
  getInviteGuildList,
  inviteAccept,
  inviteReject,
} from "@/src/api/guild.api";
import GuildMemberBox from "./GuildMemberBox";
import { GuildDTO } from "@/src/common/DTOs/guild/guild.dto";
import { GuildInviteDTO } from "@/src/common/DTOs/guild/guild_invite.dto";
import { leaveMember } from "@/src/api/member.api";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { GuildInfoItem } from "./guildInfoItem";
import { ProfileHeader } from "./profileHeader";

const GuildManagePage = () => {
  const [inviteMembers, setInviteMembers] = useState<GuildInviteDTO[]>([]);
  const [guild, setGuild] = useState<GuildDTO>();
  const [currentTab, setCurrentTab] = useState("members");
  const [checked, setChecked] = useState(false);
  const [memberChecked, setMemberChecked] = useState(false);
  const { member } = useMemberStore();
  const router = useRouter();

  const recordDefeat = guild?.guildRecord?.recordDefeat ?? 0;
  const recordVictory = guild?.guildRecord?.recordVictory ?? 0;
  const total = recordDefeat + recordVictory;

  const recordString =
    total === 0
      ? `0 전 0승 0패 기록없음`
      : `${total} 전 ${recordVictory}승 ${recordDefeat}패 (${(
          (recordVictory / total) *
          100
        ).toFixed(2)}%)`;

  const handleCreateGuild = () => {
    router.push("/league/guild/create");
  };
  const changeTab = (tab: string) => {
    setCurrentTab(tab);
  };
  const handleCheckboxChange = () => {
    // 길드마스터 길드해체 체크박스
    setChecked(!checked);
  };
  const handleMemberCheckboxChange = () => {
    //길드원 길드탈퇴 체크박스
    setMemberChecked(!memberChecked);
  };
  const deleteGuild = () => {
    //길드마스터 길드해체
    if (checked) {
      destroyGuild(member!.memberGuild!.guildName).then((response) => {
        CustomAlert("success", "길드해체", "성공적으로 길드가 해체되었습니다.");
        router.push("/");
      });
    } else {
      CustomAlert(
        "warning",
        "길드해체",
        "주의사항 확인 체크를 활성화 시켜주십시오."
      );
    }
  };
  const leaveGuild = () => {
    //길드원 길드탈퇴
    if (memberChecked) {
      leaveMember(member!.memberId).then((response) => {
        CustomAlert("success", "길드탈퇴", "성공적으로 길드를 탈퇴했습니다.");
        router.push("/");
      });
    } else {
      CustomAlert(
        "warning",
        "길드해체",
        "주의사항 확인 체크를 활성화 시켜주십시오."
      );
    }
  };
  const acceptMember = (member: GuildInviteDTO) => {
    //길드신청 수락
    inviteAccept(member.memberId!.id, member.guildId!.id)
      .then((response) => {
        CustomAlert("success", "신청수락", "길드 가입신청을 수락하셨습니다.");
        router.refresh();
      })
      .catch((error) => {
        CustomAlert(
          "error",
          "신청수락",
          "이미 길드에 가입되었거나 길드에 속한 멤버입니다."
        );
      });
  };
  const rejectMember = (member: GuildInviteDTO) => {
    //길드신청 거절
    inviteReject(member.memberId!.id, member.guildId!.id)
      .then((response) => {
        CustomAlert("success", "신청거설", "길드 가입신청을 거절하셨습니다.");
        router.refresh();
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (!(member!.memberGuild === null || member!.memberGuild === undefined)) {
      getGuildInfo(member!.memberGuild.guildName)
        .then((response) => {
          setGuild(response.data.data);
        })
        .catch((error) => {});
      getInviteGuildList(member!.memberGuild.guildName)
        .then((response) => {
          setInviteMembers(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <div className="flex flex-col p-[16px] gap-24px">
      {member!.memberGuild === null || member!.memberGuild === undefined ? (
        <div className="flex w-full py-10">
          <div className="flex flex-col w-full border-2 border-black rounded-lg p-7">
            <div className="mb-10">
              <p className="font-extrabold text-4xl">롤파이트에 오신것을</p>
              <p className="font-extrabold text-4xl">환영합니다</p>
            </div>
            <div className="mb-10">
              <p className="font-extrabold text-3xl text-brandcolor">
                길드를 생성하세요
              </p>
              <p className="font-extrabold text-3xl text-brandcolor">
                나만의 길드를 운영해보세요.
              </p>
            </div>
            <button
              className="flex h-45px rounded-lg w-200px items-center justify-center bg-brandcolor gap-2"
              onClick={handleCreateGuild}
            >
              <FaArrowCircleRight className="w-30px h-30px text-white" />
              <p className="text-3xl text-white">길드만들기</p>
            </button>
          </div>
          <div className="flex flex-col pl-5">
            <div className="flex w-full gap-2 pb-3">
              <FaRegQuestionCircle className="w-30px h-30px text-brandcolor" />
              <p className="font-extrabold text-2xl text-brandcolor">
                롤파이트 길드란?
              </p>
            </div>
            <p className="text-lg">
              롤파이트 유저가 자신만의 길드를 만들어 원하는 다른 길드들과 함께
              롤파이트 전적시스템을 이용할 수 있습니다.
            </p>
            <div className="flex w-full gap-2 pb-3 pt-3">
              <FaRegQuestionCircle className="w-30px h-30px text-brandcolor" />
              <p className="font-extrabold text-2xl text-brandcolor">
                어떻게 참여하나요?
              </p>
            </div>
            <p className="text-lg">
              길드생성을 하면 자동으로 롤파이트 공식 리그에 참여하여 참여 중인
              다른 길드들과 경쟁하세요.
            </p>
            <div className="flex w-full gap-2 pb-3 pt-3">
              <FaRegQuestionCircle className="w-30px h-30px text-brandcolor" />
              <p className="font-extrabold text-2xl text-brandcolor">
                길드는 어떻게 만들수 있나요.
              </p>
            </div>
            <p className="text-lg">
              롤파이트 클라이언트를 통해 롤 계정 인증을 완료한 유저만 길드를
              생성할 수 있습니다. 길드를 생성해 강한팀을 만들어 보세요.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-[24px] p-[8px]">
          <div className="flex items-center gap-[16px]">
            <img
              src={`${constant.SERVER_URL}/${guild?.guildIcon}`}
              alt="GuildIcon"
              className="object-cover w-[100px] h-[100px]"
            />
            <div className="flex flex-col items-between">
              <h2 className="text-[28px] font-bold">{guild?.guildName}</h2>
              <p className="text-[16px]">
                {member!.memberGuild.guildDescription}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-[12px]">
            <GuildInfoItem title={"길드마스터"} value={guild?.guildMaster} />
            <div className="grid grid-cols-2 gap-[12px]">
              <GuildInfoItem
                title="길드랭킹"
                value={
                  guild?.guildRecord?.recordRanking === "기록없음"
                    ? "기록없음"
                    : `${guild?.guildRecord?.recordRanking}위`
                }
              />
              <GuildInfoItem
                title={"길드인원"}
                value={`${guild?.guildMembers.length}명`}
              />
            </div>
            <div className="grid grid-cols-2 gap-[12px]">
              <GuildInfoItem title="길드티어" value={guild?.guildTier} />
              <GuildInfoItem
                title={"래더점수"}
                value={`${guild?.guildRecord?.recordLadder}점`}
              />
            </div>
            <GuildInfoItem title={"길드 전적"} value={recordString} />
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-4 gap-[4px]">
              <ProfileHeader
                title="길드원"
                onClick={() => changeTab("members")}
              />
              {member &&
                member.memberName === member.memberGuild.guildMaster && (
                  <ProfileHeader
                    title="길드탈퇴"
                    onClick={() => changeTab("leave")}
                  />
                )}
              {member &&
                member.memberName === member.memberGuild.guildMaster && (
                  <>
                    <ProfileHeader
                      title="가입신청자"
                      onClick={() => changeTab("applicants")}
                    />
                    <ProfileHeader
                      title="길드해체"
                      onClick={() => changeTab("delete")}
                    />
                  </>
                )}
            </div>

            <div className="py-[12px]">
              {currentTab === "members" && (
                <div className="flex flex-col gap-[4px] max-h-[300px]">
                  <div className="grid grid-cols-3 bg-brandcolor px-[8px] dark:bg-brandgray text-white text-[12px]">
                    <p>닉네임</p>
                    <p>소환사명</p>
                    <p>티어</p>
                  </div>
                  <div className="flex flex-col gap-[12px] overflow-y-auto">
                    {guild?.guildMembers.map((member) => (
                      <GuildMemberBox
                        key={member.id}
                        guildIcon={`${constant.SERVER_URL}/${
                          member!.memberGuild?.guildIcon
                        }`}
                        guildMember={member}
                        guild={guild!}
                      />
                    ))}
                  </div>
                </div>
              )}
              {currentTab === "leave" && (
                <div className="flex flex-col p-[16px] gap-[24px] justify-center items-center">
                  <div className="flex flex-col gap-[14px] p-[12px]">
                    <div>
                      <span className="text-sky-950 font-bold dark:text-sky-500">
                        1. 정보 유실
                      </span>
                      <p className="text-sm">
                        길드를 탈퇴하면 해당 길드와 관련된 모든 데이터가
                        삭제됩니다.
                      </p>
                    </div>
                    <div>
                      <span className="text-sky-950 font-bold dark:text-sky-500">
                        2. 접근 권한
                      </span>
                      <p className="text-sm">
                        길드를 탈퇴하면 해당 길드에 대한 접근 권한을 잃게
                        됩니다.
                      </p>
                    </div>
                    <div>
                      <span className="text-sky-950 font-bold dark:text-sky-500">
                        3. 서비스 이용 중단
                      </span>
                      <p className="text-sm">
                        길드를 탈퇴한 후에는 해당 길드의 서비스 및 혜택을 더
                        이상 이용할 수 없게 됩니다. 이는 길드 멤버 간의 활동 및
                        협업에 영향을 줄 수 있으며, 데이터 또한 다시 복구,
                        이용할 수 없습니다.
                      </p>
                    </div>
                  </div>

                  <label>
                    <input
                      type="checkbox"
                      checked={memberChecked}
                      onChange={handleMemberCheckboxChange}
                    />
                    주의사항을 모두 확인하였습니다.
                  </label>
                  <button
                    className="w-full bg-red-500 rounded p-2"
                    onClick={leaveGuild}
                  >
                    <p className="text-white font-extrabold tracking-widest">
                      길드탈퇴
                    </p>
                  </button>
                </div>
              )}
              //@todo 여기서부터해라.
              {currentTab === "applicants" && (
                <div>
                  <div className="font-bold text-xl ">
                    {inviteMembers.map((invite) => (
                      <div
                        className="w-full bg-brandbgcolor hover:bg-sky-100 rounded flex p-2 dark:bg-dark dark:hover:bg-gray-600 border-b border-gray-700"
                        key={invite.id}
                      >
                        <div className="flex">
                          <div className="flex w-250px items-center text-16px font-semibold pl-2">
                            {invite.memberId?.memberName}
                          </div>
                          <div className="flex w-250px items-center text-16px font-semibold pl-2">
                            {invite.memberId?.memberGame?.gameName}
                          </div>
                          <div className="flex w-250px items-center text-16px font-semibold pl-2">
                            {invite.memberId?.memberGame?.gameTier}
                          </div>
                          <button
                            aria-label="수락"
                            onClick={() => acceptMember(invite)}
                            className="flex items-center text-16px font-semibold pl-2 hover:text-blue-700"
                          >
                            수락
                          </button>
                          <button
                            aria-label="거절"
                            onClick={() => rejectMember(invite)}
                            className="flex items-center text-16px font-semibold pl-2 hover:text-red-500"
                          >
                            거절
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {currentTab === "delete" && (
                <div className="flex flex-col p-[16px] gap-[24px] justify-center items-center">
                  <div className="flex flex-col gap-[14px] p-[12px]">
                    <div>
                      <span className="text-sky-950 font-bold dark:text-sky-500">
                        1. 정보 유실
                      </span>
                      <p className="text-sm">
                        길드를 해체하면 해당 길드와 관련된 모든 데이터가 삭제될
                        수 있습니다.
                      </p>
                    </div>
                    <div>
                      <span className="text-sky-950 font-bold dark:text-sky-500">
                        2. 접근 권한
                      </span>
                      <p className="text-sm">
                        길드를 해체하면 해당 길드에 대한 접근 권한을 잃게
                        됩니다.
                      </p>
                    </div>
                    <div>
                      <span className="text-sky-950 font-bold dark:text-sky-500">
                        3. 서비스 이용 중단
                      </span>
                      <p className="text-sm">
                        길드를 해체한 후에는 해당 길드의 서비스 및 혜택을 더
                        이상 이용할 수 없게 됩니다.
                      </p>
                    </div>
                    <div>
                      <span className="text-sky-950 font-bold dark:text-sky-500">
                        4. 서비스 연관성
                      </span>
                      <p className="text-sm">
                        길드를 해체할 경우 해당 길드와 연관된 모든 서비스와
                        기능에 대한 접근 권한이 손실될 수 있습니다. 이는 길드
                        멤버 간의 활동 및 협업에 영향을 줄 수 있습니다.
                      </p>
                    </div>
                  </div>

                  <label>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={handleCheckboxChange}
                    />
                    주의사항을 모두 확인하였습니다.
                  </label>

                  <button
                    className="w-40 bg-red-500 rounded p-2"
                    onClick={deleteGuild}
                  >
                    <p className="text-white font-bold tracking-widest">
                      길드해체
                    </p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuildManagePage;

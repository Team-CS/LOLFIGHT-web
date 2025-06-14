import { MemberDTO } from "@/src/common/DTOs/member/member.dto";
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

const GuildManagePage = () => {
  const [inviteMembers, setInviteMembers] = useState<GuildInviteDTO[]>([]);
  const [guild, setGuild] = useState<GuildDTO>();
  const [currentTab, setCurrentTab] = useState("description");
  const [checked, setChecked] = useState(false);
  const [memberChecked, setMemberChecked] = useState(false);
  const { member } = useMemberStore();

  const router = useRouter();
  const handleCreateGuild = () => {
    // if (member!.memberGame) {
    router.push("/league/guild/create");
    // } else {
    //   CustomAlert(
    //     "warning",
    //     "길드생성",
    //     "롤 계정이 등록되지 않은 계정은 길드를 생성할 수 없습니다."
    //   );
    // }
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
          console.log(response.data.data);
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
    <div className="w-1200px h-full mx-auto pt-4">
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
        // 가입하거나 관리하는 길드가 존재하는 경우
        <div className="pt-4">
          {/* <div className=" w-full h-80 left-0 top-32 z-1">
            <img
              src={`${constant.SERVER_URL}/${member!.memberGuild?.guildIcon}`}
              alt="GuildBanner"
              className="object-cover object-center w-full h-full"
            />
          </div> */}
          <div className="flex flex-col w-full gap-2 p-5">
            <div className="flex items-center">
              <div className="rounded p-2 w-32 h-32 z-10">
                <img
                  src={`${constant.SERVER_URL}/${guild?.guildIcon}`}
                  alt="GuildIcon"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="grid mx-2 h-28 text-center items-end">
                <h3 className="text-3xl font-bold mx-4">{guild?.guildName}</h3>
              </div>
            </div>
            <div className="guildinfo-container ml-5">
              <div className="flex items-center w-210px">
                <p className="font-bold py-2 pr-8">길드마스터</p>
                <p>{guild?.guildMaster}</p>
              </div>
              <div className="flex gap-12">
                <div className="flex items-center w-210px">
                  <p className="font-bold py-2 pr-8">길드랭킹</p>
                  <p>{guild?.guildRecord?.recordRanking}</p>
                </div>
                <div className="flex items-center w-210px">
                  <p className="font-bold py-2 pr-8">길드인원</p>
                  <p>{guild?.guildMembers.length}</p>
                </div>
              </div>
              <div className="flex gap-12">
                <div className="flex items-center w-210px">
                  <p className="font-bold py-2 pr-8"> 길드티어</p>
                  <p> {guild?.guildTier}</p>
                </div>
                <div className="flex items-center w-210px">
                  <p className="font-bold py-2 pr-8">래더점수</p>
                  <p>{guild?.guildRecord?.recordLadder}</p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="font-bold py-2 pr-8"> 길드전적</p>
                <p>
                  {guild?.guildRecord?.recordDefeat! +
                    guild?.guildRecord?.recordVictory!}
                  전 {guild?.guildRecord?.recordVictory}승{" "}
                  {guild?.guildRecord?.recordDefeat}패{" "}
                  {isNaN(
                    (guild?.guildRecord?.recordVictory! /
                      (guild?.guildRecord?.recordDefeat! +
                        guild?.guildRecord?.recordVictory!)) *
                      100
                  )
                    ? "기록없음"
                    : `(${(
                        (guild?.guildRecord?.recordVictory! /
                          (guild?.guildRecord?.recordDefeat! +
                            guild?.guildRecord?.recordVictory!)) *
                        100
                      ).toFixed(2)}%)`}
                </p>
              </div>
            </div>

            <div className="flex flex-col overflow-x-hidden">
              <div className="flex border-b border-gray-600 text-gray-600">
                <button
                  className="font-semi px-8 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => changeTab("description")}
                >
                  길드소개
                </button>
                <button
                  className="font-semi px-8 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => changeTab("members")}
                >
                  길드원
                </button>
                {member!.memberName !== member!.memberGuild.guildMaster ? (
                  <button
                    className="font-semi px-8 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => changeTab("leave")}
                  >
                    길드탈퇴
                  </button>
                ) : null}
                {member!.memberName === member!.memberGuild.guildMaster ? (
                  <button
                    className="font-semi px-8 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => changeTab("applicants")}
                  >
                    가입신청자
                  </button>
                ) : null}
                {member!.memberName === member!.memberGuild.guildMaster ? (
                  <button
                    className="font-semi px-8 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => changeTab("delete")}
                  >
                    길드해체
                  </button>
                ) : null}
              </div>
              <div className="mt-8 ">
                {currentTab === "description" && (
                  <div className="font-bold text-xl p-8 border border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white">
                    {member!.memberGuild.guildDescription}
                  </div>
                )}
                {currentTab === "members" && (
                  <div>
                    <div className="font-bold text-xl">
                      {guild?.guildMembers.map((member) => (
                        <GuildMemberBox
                          key={member.id}
                          guildIcon={`${constant.SERVER_URL}/${
                            member!.memberGuild?.guildIcon
                          }`}
                          guildMember={member}
                          guild={guild!}
                          user={member!.memberName}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {currentTab === "leave" && (
                  <div className="flex flex-col items-center">
                    <div className="p-2">
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
                          이상 이용할 수 없게 됩니다. 이는 길드 멤버 간의 활동
                          및 협업에 영향을 줄 수 있으며, 데이터 또한 다시 복구,
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
                {currentTab === "applicants" && (
                  <div>
                    {/* <div className="flex w-full bg-slate-200 h-20px">
                        <p className="w-250px text-light text-sm ml-2">
                          닉네임
                        </p>
                        <p className="w-250px text-light text-sm">소환사명</p>
                        <p className="w-250px text-light text-sm">티어</p>
                      </div> */}

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
                  <div className="flex flex-col items-center gap-5">
                    <div className="p-2">
                      <div>
                        <span className="text-sky-950 font-bold dark:text-sky-500">
                          1. 정보 유실
                        </span>
                        <p className="text-sm">
                          길드를 해체하면 해당 길드와 관련된 모든 데이터가
                          삭제될 수 있습니다.
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
        </div>
      )}
    </div>
  );
};

export default GuildManagePage;

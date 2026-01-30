import { useRouter } from "next/navigation";
import constant from "@/src/common/constant/constant";
import { useEffect, useState, useMemo } from "react";
import CustomAlert from "../../../common/components/alert/CustomAlert";
import {
  changeGuildMaster,
  destroyGuild,
  expulsionGuildMember,
  getGuildInfo,
  getInviteGuildList,
  inviteAccept,
  inviteReject,
  updateGuildBanner,
  updateGuildDescription,
} from "@/src/api/guild.api";
import GuildMemberBox from "./GuildMemberBox";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import { GuildInviteDto } from "@/src/common/DTOs/guild/guild_invite.dto";
import { getMemberData, leaveMember } from "@/src/api/member.api";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { GuildCreateIntro } from "./GuildCreateIntro";
import GuildLeaveSection from "./GuildLeaveSection";
import GuildDeleteSection from "./GuildDeleteSection";
import ButtonAlert from "@/src/common/components/alert/ButtonAlert";
import { MemberDto } from "@/src/common/DTOs/member/member.dto";
import { GuildBannerModal } from "./modals/GuildBannerModal";
import { GuildDescriptionModal } from "./modals/GuildDescriptionModal";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { GuildInviteReviewModal } from "./modals/GuildInviteReviewModal";
import { getTierStyle } from "@/src/utils/string/string.util";
import Image from "next/image";

const GuildManagePage = () => {
  const [inviteMembers, setInviteMembers] = useState<GuildInviteDto[]>([]);
  const [selectedInviteMember, setSelectedInviteMember] =
    useState<GuildInviteDto | null>();
  const [guild, setGuild] = useState<GuildDto | null>(null);
  const { member, setMember } = useMemberStore();
  const [currentTab, setCurrentTab] = useState("members");
  const [guildChecked, setGuildChecked] = useState(false);
  const [memberChecked, setMemberChecked] = useState(false);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [newDesc, setNewDesc] = useState<string>("");
  const router = useRouter();
  const isMobile = useIsMobile();

  // guild와 member가 모두 존재할 때만 isMaster 계산
  const isMaster = useMemo(() => {
    return member?.id && guild?.guildMasterId
      ? member.id === guild.guildMasterId
      : false;
  }, [member, guild]);

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

  useEffect(() => {
    if (member?.memberGuild?.guildName) {
      getGuildInfo(member.memberGuild.guildName)
        .then((response) => {
          setGuild(response.data.data);
        })
        .catch((error) => console.log(error));

      getInviteGuildList(member.memberGuild.guildName)
        .then((response) => {
          setInviteMembers(response.data.data);
        })
        .catch((error) => console.log(error));
    }
  }, [member]);

  const changeTab = (tab: string) => setCurrentTab(tab);
  const handleGuildCheckboxChange = () => setGuildChecked(!guildChecked);
  const handleMemberCheckboxChange = () => setMemberChecked(!memberChecked);

  const deleteGuild = async () => {
    if (guildChecked && member?.memberGuild?.guildName) {
      await destroyGuild(member.memberGuild.guildName)
        .then(() => {
          CustomAlert(
            "success",
            "길드해체",
            "성공적으로 길드가 해체되었습니다.",
          );
          getMemberData().then((response) => {
            const memberData: MemberDto = response.data.data;
            setMember(memberData);
            router.push("/");
          });
        })
        .catch(() => {});
    } else {
      CustomAlert(
        "warning",
        "길드해체",
        "주의사항 확인 체크를 활성화 시켜주십시오.",
      );
    }
  };

  const leaveGuild = () => {
    if (memberChecked) {
      leaveMember()
        .then(() => {
          CustomAlert("success", "길드탈퇴", "성공적으로 길드를 탈퇴했습니다.");
          router.push("/");
        })
        .catch((error) => {
          const code = error.response.data.code;
          if (code === "COMMON-002") {
            CustomAlert(
              "warning",
              "길드탈퇴",
              "속한 길드팀이 존재합니다. \n 길드팀을 먼저 탈퇴후 재시도 해주세요",
            );
          }
        });
    } else {
      CustomAlert(
        "warning",
        "길드탈퇴",
        "주의사항 확인 체크를 활성화 시켜주십시오.",
      );
    }
  };

  const expulsionMember = (targetMember: MemberDto) => {
    const expulsion = () => {
      if (guild) {
        expulsionGuildMember(targetMember.memberName, guild.guildName)
          .then((response) => {
            CustomAlert(
              "success",
              "길드추방",
              `${targetMember.memberName} 길드원을 추방하였습니다.`,
            );
            setGuild(response.data.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };

    ButtonAlert(
      "길드추방",
      `${targetMember.memberName} 길드원을 추방하시겠습니까?`,
      "추방",
      "닫기",
      expulsion,
    );
  };

  const transferGuildMaster = (memberName: string, guildName: string) => {
    const changeMaster = () => {
      changeGuildMaster(memberName, guildName)
        .then((response) => {
          CustomAlert(
            "success",
            "길드마스터 변경",
            `${guildName}의 길드마스터가 ${memberName}으로 변경되었습니다`,
          );
          setGuild(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    ButtonAlert(
      "길드마스터 변경",
      `길드마스터를 ${memberName}으로 변경하시겠습니까?`,
      "변경",
      "닫기",
      changeMaster,
    );
  };

  const acceptMember = (memberId: string, guildId: string) => {
    if (guild?.guildMembers.length === guild?.maxMembers) {
      CustomAlert(
        "error",
        "신청수락",
        "가입하려는 길드의 정원 수가 초과되었습니다.",
      );
      return;
    }
    inviteAccept(memberId, guildId)
      .then(() => {
        CustomAlert("success", "신청수락", "길드 가입신청을 수락하셨습니다.");
        setInviteMembers((prev) =>
          prev.filter((invite) => invite.member?.id !== memberId),
        );
      })
      .catch((error: any) => {
        const code = error.response?.data?.code;
        if (code === "COMMON-003") {
          CustomAlert(
            "error",
            "신청수락",
            "이미 길드에 가입되었거나 길드에 속한 멤버입니다.",
          );
        } else if (code === "COMMON-002") {
          CustomAlert(
            "error",
            "신청수락",
            "가입하려는 길드의 정원 수가 초과되었습니다.",
          );
        }
      });
  };

  const rejectMember = (memberId: string, guildId: string) => {
    inviteReject(memberId, guildId)
      .then(() => {
        CustomAlert("success", "신청거절", "길드 가입신청을 거절하셨습니다.");
        setInviteMembers((prev) =>
          prev.filter((invite) => invite.member?.id !== memberId),
        );
      })
      .catch(() => {});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleBannerSubmit = () => {
    if (selectedImage) {
      updateGuildBanner(selectedImage)
        .then((response) => {
          CustomAlert("success", "길드 배너 변경", "변경이 완료되었습니다.");
          setGuild(response.data.data);
          setSelectedImage(null);
          setPreviewImage("");
        })
        .catch(() => CustomAlert("error", "길드 배너 변경", "변경 실패"));
      setOpenModal(null);
    } else {
      CustomAlert(
        "error",
        "길드 배너 변경",
        "길드 배너 이미지를 등록해주세요.",
      );
    }
  };

  const handleDescriptionSubmit = (desc: string) => {
    if (desc.length > 0) {
      updateGuildDescription(desc)
        .then((response) => {
          CustomAlert("success", "길드 소개 변경", "변경이 완료되었습니다.");
          setGuild(response.data.data);
          setNewDesc("");
        })
        .catch((error) => {
          const code = error.response.data.code;
          if (code === "COMMON-018") {
            CustomAlert(
              "error",
              "길드 소개 변경",
              "부적절한 단어가 포함되어 있습니다.",
            );
          } else {
            CustomAlert("error", "길드 소개 변경", "변경 실패");
          }
        });
      setOpenModal(null);
    } else {
      CustomAlert(
        "error",
        "길드 소개 변경",
        "길드 소개를 한 글자 이상 작성해주세요",
      );
    }
  };

  // ========================= JSX =========================
  if (!member) return null; // member가 없으면 렌더하지 않음
  if (!member.memberGuild) return <GuildCreateIntro />;

  return (
    <div className="flex flex-col gap-[20px] p-[20px]">
      {/* 길드 헤더 카드 */}
      <div className="w-full rounded-[16px] bg-white dark:bg-branddark border dark:border-branddarkborder shadow-lg overflow-hidden">
        <div className="flex items-center gap-[20px] p-[24px]">
          <Image
            src={`${constant.SERVER_URL}/${guild?.guildIcon}`}
            alt="GuildIcon"
            width={100}
            height={100}
            className={`object-cover rounded-[16px] shrink-0 shadow-md ${
              isMobile ? "w-[80px] h-[80px]" : "w-[100px] h-[100px]"
            }`}
          />
          <div className="flex flex-col gap-[8px]">
            <p
              className={`font-bold text-gray-900 dark:text-white ${
                isMobile ? "text-[22px]" : "text-[28px]"
              }`}
            >
              {guild?.guildName}
            </p>
            <p
              className={`text-gray-500 dark:text-gray-400 ${isMobile ? "text-[13px]" : "text-[15px]"}`}
            >
              {member.memberGuild.guildDescription}
            </p>
          </div>
        </div>

        {/* 길드 정보 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[1px] bg-gray-200 dark:bg-gray-700">
          <div className="flex flex-col items-center justify-center py-[16px] bg-gray-50 dark:bg-gray-800/50">
            <span className="text-[12px] text-gray-400 dark:text-gray-500">
              길드마스터
            </span>
            <span className="text-[14px] font-semibold text-gray-800 dark:text-white">
              {guild?.guildMasterName}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center py-[16px] bg-gray-50 dark:bg-gray-800/50">
            <span className="text-[12px] text-gray-400 dark:text-gray-500">
              길드랭킹
            </span>
            <span className="text-[14px] font-semibold text-gray-800 dark:text-white">
              {guild?.guildRecord?.recordRanking === "기록없음"
                ? "기록없음"
                : `${guild?.guildRecord?.recordRanking}위`}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center py-[16px] bg-gray-50 dark:bg-gray-800/50">
            <span className="text-[12px] text-gray-400 dark:text-gray-500">
              길드인원
            </span>
            <span className="text-[14px] font-semibold text-gray-800 dark:text-white">
              {guild?.guildMembers.length} / {guild?.maxMembers}명
            </span>
          </div>
          <div className="flex flex-col items-center justify-center py-[16px] bg-gray-50 dark:bg-gray-800/50">
            <span className="text-[12px] text-gray-400 dark:text-gray-500">
              래더점수
            </span>
            <span className="text-[14px] font-semibold text-gray-800 dark:text-white">
              {guild?.guildRecord?.recordLadder}점
            </span>
          </div>
        </div>

        {/* 전적 표시 */}
        <div className="flex items-center justify-center py-[14px] bg-white dark:bg-branddark border-t dark:border-branddarkborder">
          <span className="text-[13px] text-gray-500 dark:text-gray-400">
            {guild?.guildTier} · {recordString}
          </span>
        </div>
      </div>

      {/* 탭 섹션 */}
      <div className="w-full rounded-[16px] bg-white dark:bg-branddark border dark:border-branddarkborder shadow-lg overflow-hidden">
        {/* 탭 헤더 */}
        <div
          className={`flex border-b dark:border-branddarkborder overflow-x-auto ${isMobile ? "text-[10px]" : "text-[14px]"}`}
        >
          <button
            onClick={() => changeTab("banner")}
            className={`flex-1 min-w-[80px] px-[16px] py-[14px] font-medium transition-colors ${
              currentTab === "banner"
                ? "text-brandcolor border-b-[2px] border-brandcolor bg-brandcolor/5"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            길드배너
          </button>
          <button
            onClick={() => changeTab("members")}
            className={`flex-1 min-w-[80px] px-[16px] py-[14px] font-medium transition-colors ${
              currentTab === "members"
                ? "text-brandcolor border-b-[2px] border-brandcolor bg-brandcolor/5"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            길드원
          </button>
          {!isMaster && (
            <button
              onClick={() => changeTab("leave")}
              className={`flex-1 min-w-[80px] px-[16px] py-[14px] font-medium transition-colors ${
                currentTab === "leave"
                  ? "text-brandcolor border-b-[2px] border-brandcolor bg-brandcolor/5"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              길드탈퇴
            </button>
          )}
          {isMaster && (
            <>
              <button
                onClick={() => changeTab("applicants")}
                className={`flex-1 min-w-[80px] px-[16px] py-[14px] font-medium transition-colors ${
                  currentTab === "applicants"
                    ? "text-brandcolor border-b-[2px] border-brandcolor bg-brandcolor/5"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                가입신청자
                {inviteMembers.length > 0 && (
                  <span
                    className={`inline-flex items-center justify-center  font-bold text-white bg-red-500 rounded-full
                      ${isMobile ? "w-[13px] h-[13px] text-[10px]" : "w-[15px] h-[15px] text-[11px]"}`}
                    style={{ marginLeft: "6px" }}
                  >
                    {inviteMembers.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => changeTab("delete")}
                className={`flex-1 min-w-[80px] px-[16px] py-[14px] font-medium transition-colors ${
                  currentTab === "delete"
                    ? "text-red-500 border-b-[2px] border-red-500 bg-red-500/5"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                길드해체
              </button>
            </>
          )}
        </div>

        {/* 탭 콘텐츠 */}
        <div className={isMobile ? "p-[12px]" : "p-[20px]"}>
          {/* 배너 */}
          {currentTab === "banner" && guild && (
            <div className="flex flex-col items-center gap-[16px]">
              {isMaster && (
                <div className="flex gap-[8px]">
                  <button
                    className={`bg-brandcolor hover:bg-brandhover text-white rounded-[8px] font-medium transition-colors ${
                      isMobile
                        ? "px-[12px] py-[8px] text-[12px]"
                        : "px-[16px] py-[10px] text-[14px]"
                    }`}
                    onClick={() => setOpenModal("banner")}
                  >
                    {guild.guildBanner ? "배너 수정" : "배너 추가"}
                  </button>
                  <button
                    className={`bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-[8px] font-medium transition-colors ${
                      isMobile
                        ? "px-[12px] py-[8px] text-[12px]"
                        : "px-[16px] py-[10px] text-[14px]"
                    }`}
                    onClick={() => setOpenModal("description")}
                  >
                    길드소개 수정
                  </button>
                </div>
              )}
              {guild.guildBanner ? (
                <Image
                  src={`${constant.SERVER_URL}/${guild.guildBanner}`}
                  alt="Guild Banner"
                  width={700}
                  height={500}
                  className="rounded-[12px] shadow-md w-full max-w-[700px]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-[30px] text-gray-400 dark:text-gray-500">
                  <p className={`${isMobile ? "text-[12px]" : "text-[14px]"}`}>
                    등록된 배너가 없습니다.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 멤버 탭 */}
          {currentTab === "members" && guild && (
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center justify-between">
                <span
                  className={`text-gray-500 dark:text-gray-400 ${isMobile ? "text-[12px]" : "text-[14px]"}`}
                >
                  총 {guild.guildMembers.length}명
                </span>
              </div>
              <div className="rounded-[12px] border dark:border-branddarkborder overflow-hidden">
                <div
                  className={`flex bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium ${
                    isMobile
                      ? "text-[11px] px-[16px] py-[4px]"
                      : "text-[13px] px-[16px] py-[12px]"
                  }`}
                >
                  <div className="flex-[1]">닉네임</div>
                  <div className="flex-[2]">소환사명</div>
                  <div className={`${isMobile ? "flex-[0.5]" : "flex-[1]"}`}>
                    티어
                  </div>
                  <div className={`${isMobile ? "flex-[1.5]" : "flex-[1]"}`}>
                    라인
                  </div>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {guild.guildMembers.map((m) => (
                    <GuildMemberBox
                      key={m.id}
                      guildMember={m}
                      guild={guild}
                      expulsionMember={expulsionMember}
                      transferGuildMaster={transferGuildMaster}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 길드 탈퇴 탭 */}
          {currentTab === "leave" && !isMaster && (
            <GuildLeaveSection
              isChecked={memberChecked}
              onChange={handleMemberCheckboxChange}
              onClick={leaveGuild}
            />
          )}

          {/* 가입 신청자 탭 */}
          {currentTab === "applicants" && isMaster && (
            <div className="flex flex-col gap-[12px]">
              {inviteMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-[30px] text-gray-400 dark:text-gray-500">
                  <p className={`${isMobile ? "text-[12px]" : "text-[14px]"}`}>
                    가입 신청자가 없습니다.
                  </p>
                </div>
              ) : (
                <div className="rounded-[12px] border dark:border-branddarkborder overflow-hidden">
                  <div className="max-h-[350px] overflow-y-auto">
                    {inviteMembers.map((invite) => (
                      <div
                        key={invite.id}
                        onClick={() => {
                          setSelectedInviteMember(invite);
                          setOpenModal("invite");
                        }}
                        className={`flex items-center justify-between border-b border-gray-100 dark:border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                          isMobile
                            ? "gap-[8px] px-[12px] py-[10px]"
                            : "gap-[16px] px-[16px] py-[14px]"
                        }`}
                      >
                        {/* 닉네임 */}
                        <div
                          className={`flex items-center ${isMobile ? "gap-[8px] min-w-[70px]" : "gap-[10px] min-w-[100px]"}`}
                        >
                          <Image
                            src={`${constant.SERVER_URL}/${invite.member?.memberIcon}`}
                            alt="icon"
                            width={36}
                            height={36}
                            className={`rounded-[8px] object-cover ${isMobile ? "w-[28px] h-[28px]" : "w-[36px] h-[36px]"}`}
                          />
                          <span
                            className={`font-semibold text-gray-900 dark:text-white truncate ${isMobile ? "text-[12px]" : "text-[14px]"}`}
                          >
                            {invite.member?.memberName}
                          </span>
                        </div>

                        {invite.member?.memberGame && (
                          <>
                            {!isMobile && (
                              <span className="text-[13px] text-gray-500 dark:text-gray-400 truncate flex-1">
                                {invite.member?.memberGame?.gameName}
                              </span>
                            )}

                            <div
                              className={`flex items-center ${isMobile ? "gap-[4px]" : "gap-[8px]"}`}
                            >
                              <Image
                                src={`${constant.SERVER_URL}/public/rank/${
                                  invite.member?.memberGame?.gameTier?.split(
                                    " ",
                                  )[0]
                                }.png`}
                                alt="tier"
                                width={24}
                                height={24}
                                className={
                                  isMobile
                                    ? "w-[18px] h-[18px]"
                                    : "w-[24px] h-[24px]"
                                }
                              />
                              <span
                                className={`font-medium ${getTierStyle(
                                  invite.member?.memberGame?.gameTier,
                                )} ${isMobile ? "text-[11px]" : "text-[13px]"}`}
                              >
                                {isMobile
                                  ? invite.member?.memberGame?.gameTier?.split(
                                      " ",
                                    )[0]
                                  : invite.member?.memberGame?.gameTier}
                              </span>
                            </div>

                            <div
                              className={`flex items-center ${isMobile ? "gap-[4px]" : "gap-[6px]"}`}
                            >
                              <Image
                                src={`${constant.SERVER_URL}/public/ranked-positions/${invite.member?.memberGame?.line}.png`}
                                alt="line"
                                width={24}
                                height={24}
                                className={
                                  isMobile
                                    ? "w-[18px] h-[18px]"
                                    : "w-[24px] h-[24px]"
                                }
                              />
                              {!isMobile && (
                                <span className="text-[13px] text-gray-600 dark:text-gray-300">
                                  {invite.member?.memberGame?.line}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 길드 해체 탭 */}
          {currentTab === "delete" && isMaster && (
            <GuildDeleteSection
              isChecked={guildChecked}
              onChange={handleGuildCheckboxChange}
              onClick={deleteGuild}
            />
          )}
        </div>
      </div>

      {openModal === "banner" && (
        <GuildBannerModal
          selectedImage={selectedImage}
          previewImage={previewImage}
          onClose={() => setOpenModal(null)}
          onImageChange={handleImageChange}
          onSubmit={handleBannerSubmit}
        />
      )}
      {openModal === "description" && (
        <GuildDescriptionModal
          value={newDesc}
          onTextChange={(value: string) => setNewDesc(value)}
          onClose={() => {
            setOpenModal(null);
            setNewDesc("");
          }}
          onSubmit={handleDescriptionSubmit}
        />
      )}
      {openModal === "invite" && (
        <GuildInviteReviewModal
          inviteData={selectedInviteMember!}
          onAccept={acceptMember}
          onReject={rejectMember}
          onClose={() => {
            setOpenModal(null);
            setSelectedInviteMember(null);
          }}
        />
      )}
    </div>
  );
};

export default GuildManagePage;

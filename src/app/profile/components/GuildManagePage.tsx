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
import { GuildInfoItem } from "./guildInfoItem";
import { ProfileHeader } from "./profileHeader";
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
            "성공적으로 길드가 해체되었습니다."
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
        "주의사항 확인 체크를 활성화 시켜주십시오."
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
              "속한 길드팀이 존재합니다. \n 길드팀을 먼저 탈퇴후 재시도 해주세요"
            );
          }
        });
    } else {
      CustomAlert(
        "warning",
        "길드탈퇴",
        "주의사항 확인 체크를 활성화 시켜주십시오."
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
              `${targetMember.memberName} 길드원을 추방하였습니다.`
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
      expulsion
    );
  };

  const transferGuildMaster = (memberName: string, guildName: string) => {
    const changeMaster = () => {
      changeGuildMaster(memberName, guildName)
        .then((response) => {
          CustomAlert(
            "success",
            "길드마스터 변경",
            `${guildName}의 길드마스터가 ${memberName}으로 변경되었습니다`
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
      changeMaster
    );
  };

  const acceptMember = (memberId: string, guildId: string) => {
    if (guild?.guildMembers.length === guild?.maxMembers) {
      CustomAlert(
        "error",
        "신청수락",
        "가입하려는 길드의 정원 수가 초과되었습니다."
      );
      return;
    }
    inviteAccept(memberId, guildId)
      .then(() => {
        CustomAlert("success", "신청수락", "길드 가입신청을 수락하셨습니다.");
        setInviteMembers((prev) =>
          prev.filter((invite) => invite.member?.id !== memberId)
        );
      })
      .catch((error: any) => {
        const code = error.response?.data?.code;
        if (code === "COMMON-003") {
          CustomAlert(
            "error",
            "신청수락",
            "이미 길드에 가입되었거나 길드에 속한 멤버입니다."
          );
        } else if (code === "COMMON-002") {
          CustomAlert(
            "error",
            "신청수락",
            "가입하려는 길드의 정원 수가 초과되었습니다."
          );
        }
      });
  };

  const rejectMember = (memberId: string, guildId: string) => {
    inviteReject(memberId, guildId)
      .then(() => {
        CustomAlert("success", "신청거절", "길드 가입신청을 거절하셨습니다.");
        setInviteMembers((prev) =>
          prev.filter((invite) => invite.member?.id !== memberId)
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
        "길드 배너 이미지를 등록해주세요."
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
              "부적절한 단어가 포함되어 있습니다."
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
        "길드 소개를 한 글자 이상 작성해주세요"
      );
    }
  };

  // ========================= JSX =========================
  if (!member) return null; // member가 없으면 렌더하지 않음
  if (!member.memberGuild) return <GuildCreateIntro />;

  return (
    <div className="flex flex-col p-[16px] gap-[24px]">
      <div className="flex flex-col w-full gap-[24px] p-[8px]">
        {/* 길드 헤더 */}
        <div className="flex items-center gap-[16px]">
          <Image
            src={`${constant.SERVER_URL}/${guild?.guildIcon}`}
            alt="GuildIcon"
            width={100}
            height={100}
            className={`object-cover rounded-[12px] shrink-0 ${
              isMobile ? "w-[70px] h-[70px]" : "w-[100px] h-[100px]"
            }`}
          />
          <div className="flex flex-col items-between">
            <p
              className={`font-bold ${
                isMobile ? "text-[20px]" : "text-[28px]"
              }`}
            >
              {guild?.guildName}
            </p>
            <p className={`${isMobile ? "text-[12px]" : "text-[16px]"}`}>
              {member.memberGuild.guildDescription}
            </p>
          </div>
        </div>

        {/* 길드 정보 */}
        <div className="flex flex-col gap-[12px]">
          <GuildInfoItem title="길드마스터" value={guild?.guildMasterName} />
          <div className="grid grid-cols-2 gap-[12px]">
            <GuildInfoItem
              title="길드랭킹"
              value={
                guild?.guildRecord?.recordRanking === "기록없음"
                  ? "기록없음"
                  : `${guild?.guildRecord?.recordRanking}위`
              }
            />
            <div className="grid grid-cols-2 gap-[12px]">
              <GuildInfoItem
                title="길드인원"
                value={`${guild?.guildMembers.length}명`}
              />
              <GuildInfoItem
                title="최대 길드원"
                value={`${guild?.maxMembers}명`}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-[12px]">
            <GuildInfoItem title="길드티어" value={guild?.guildTier} />
            <GuildInfoItem
              title="래더점수"
              value={`${guild?.guildRecord?.recordLadder}점`}
            />
          </div>
          <GuildInfoItem title="길드 전적" value={recordString} />
        </div>

        {/* 탭 */}
        <div className="flex flex-col">
          <div className="grid grid-cols-4 gap-[4px]">
            <ProfileHeader
              title="길드배너"
              onClick={() => changeTab("banner")}
            />
            <ProfileHeader
              title="길드원"
              onClick={() => changeTab("members")}
            />
            {!isMaster && (
              <ProfileHeader
                title="길드탈퇴"
                onClick={() => changeTab("leave")}
              />
            )}
            {isMaster && (
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
            {/* 배너 */}
            {currentTab === "banner" && guild && (
              <div className="flex flex-col items-center justify-center w-full border rounded-[8px] p-[16px] gap-[16px] dark:border-branddarkborder">
                {guild.guildBanner ? (
                  <div className="flex flex-col items-center gap-[12px]">
                    <div className="flex gap-[12px]">
                      {isMaster && (
                        <>
                          <button
                            className={`bg-brandcolor hover:bg-opacity-80 text-white rounded-[8px] shadow ${
                              isMobile
                                ? "px-[8px] py-[4px] text-[12px]"
                                : "px-[12px] py-[8px] text-[14px]"
                            }`}
                            onClick={() => setOpenModal("banner")}
                          >
                            배너 수정하기
                          </button>
                          <button
                            className={`bg-brandcolor hover:bg-opacity-80 text-white rounded-[8px] shadow ${
                              isMobile
                                ? "px-[8px] py-[4px] text-[12px]"
                                : "px-[12px] py-[8px] text-[14px]"
                            }`}
                            onClick={() => setOpenModal("description")}
                          >
                            길드소개 수정하기
                          </button>
                        </>
                      )}
                    </div>
                    <Image
                      src={`${constant.SERVER_URL}/${guild.guildBanner}`}
                      alt="Guild Banner"
                      width={700}
                      height={500}
                      className="rounded-[12px]"
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-gray-400 text-center text-[14px]">
                      배너가 없습니다.
                    </p>
                    {isMaster && (
                      <div className="flex gap-[12px]">
                        <button
                          className="px-[12px] py-[8px] text-[14px] bg-brandcolor hover:bg-opacity-80 text-white rounded-[8px] shadow"
                          onClick={() => setOpenModal("banner")}
                        >
                          배너 추가하기
                        </button>
                        <button
                          className="px-[12px] py-[8px] text-[14px] bg-brandcolor hover:bg-opacity-80 text-white rounded-[8px] shadow"
                          onClick={() => setOpenModal("description")}
                        >
                          길드소개 수정하기
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* 멤버 탭 */}
            {currentTab === "members" && guild && (
              <div className="flex flex-col gap-[4px] max-h-[300px] overflow-y-auto">
                <div
                  className={`flex bg-brandcolor px-[8px] dark:bg-brandgray text-white ${
                    isMobile ? "text-[10px]" : "text-[12px]"
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
              <div className="flex flex-col max-h-[300px] overflow-y-auto">
                {inviteMembers.map((invite) => (
                  <div
                    key={invite.id}
                    onClick={() => {
                      setSelectedInviteMember(invite), setOpenModal("invite");
                    }}
                    className="flex gap-[12px] items-center justify-between px-[12px] py-[10px] border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-[#EFEFEF] dark:hover:bg-brandgray transition"
                  >
                    {/* 닉네임 */}
                    <div className="flex items-center gap-[6px]">
                      <Image
                        src={`${constant.SERVER_URL}/${invite.member?.memberIcon}`}
                        alt="line"
                        width={20}
                        height={20}
                        className={`rounded-[12px] ${
                          isMobile ? "w-[15px] h-[15px]" : "w-[20px] h-[20px]"
                        }`}
                      />
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">
                        {invite.member?.memberName}
                      </span>
                    </div>

                    {invite.member?.memberGame && (
                      <>
                        <span className="text-[12px] text-gray-500 dark:text-gray-300 italic truncate">
                          {invite.member?.memberGame?.gameName}
                        </span>

                        <div className="flex items-center justify-end gap-[6px] text-[12px] text-gray-700 dark:text-gray-400">
                          <Image
                            src={`${constant.SERVER_URL}/public/rank/${
                              invite.member?.memberGame?.gameTier?.split(" ")[0]
                            }.png`}
                            alt="line"
                            width={20}
                            height={20}
                            className={`${
                              isMobile
                                ? "w-[15px] h-[15px]"
                                : "w-[20px] h-[20px]"
                            }`}
                          />
                          <span
                            className={getTierStyle(
                              invite.member?.memberGame?.gameTier
                            )}
                          >
                            {invite.member?.memberGame?.gameTier}
                          </span>
                        </div>

                        <div className="flex items-center justify-end gap-[6px] text-[12px] text-gray-700 dark:text-gray-400">
                          <Image
                            src={`${constant.SERVER_URL}/public/ranked-positions/${invite.member?.memberGame?.line}.png`}
                            alt="line"
                            width={20}
                            height={20}
                            className={`${
                              isMobile
                                ? "w-[15px] h-[15px]"
                                : "w-[20px] h-[20px]"
                            }`}
                          />
                          <span>{invite.member?.memberGame?.line}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
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

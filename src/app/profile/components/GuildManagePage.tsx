import { useRouter } from "next/navigation";
import constant from "@/src/common/constant/constant";
import { useEffect, useState } from "react";
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
} from "@/src/api/guild.api";
import GuildMemberBox from "./GuildMemberBox";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import { GuildInviteDTO } from "@/src/common/DTOs/guild/guild_invite.dto";
import { leaveMember, updateMemberGameLine } from "@/src/api/member.api";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { GuildInfoItem } from "./guildInfoItem";
import { ProfileHeader } from "./profileHeader";
import { GuildCreateIntro } from "./GuildCreateIntro";
import GuildLeaveSection from "./GuildLeaveSection";
import GuildDeleteSection from "./GuildDeleteSection";
import ButtonAlert from "@/src/common/components/alert/ButtonAlert";
import { MemberDto } from "@/src/common/DTOs/member/member.dto";
import { GuildBannerModal } from "./modals/GuildBannerModal";

const GuildManagePage = () => {
  const [inviteMembers, setInviteMembers] = useState<GuildInviteDTO[]>([]);
  const [guild, setGuild] = useState<GuildDto>();
  const { member } = useMemberStore();
  const [currentTab, setCurrentTab] = useState("members");
  const [guildChecked, setGuildChecked] = useState(false);
  const [memberChecked, setMemberChecked] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
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
  }, [member]);

  const changeTab = (tab: string) => {
    setCurrentTab(tab);
  };
  const handleGuildCheckboxChange = () => {
    // 길드마스터 길드해체 체크박스
    setGuildChecked(!guildChecked);
  };
  const handleMemberCheckboxChange = () => {
    //길드원 길드탈퇴 체크박스
    setMemberChecked(!memberChecked);
  };
  const deleteGuild = () => {
    //길드마스터 길드해체
    if (guildChecked) {
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

  const expulsionMember = (member: MemberDto) => {
    const expulsion = () => {
      if (guild) {
        expulsionGuildMember(member.memberName, guild.guildName)
          .then((response) => {
            CustomAlert(
              "success",
              "길드추방",
              `${member.memberName}-길드원을 추방하였습니다.`
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
      `${member.memberName}길드원을 추방하시겠습니까?`,
      "추방",
      expulsion
    );
  };

  const transferGuildMaste = (memberName: string, guildName: string) => {
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
      changeMaster
    );
  };

  const acceptMember = (memberId: string, guildId: string) => {
    //길드신청 수락
    inviteAccept(memberId, guildId)
      .then((response) => {
        CustomAlert("success", "신청수락", "길드 가입신청을 수락하셨습니다.");
        setInviteMembers((prev) =>
          prev.filter((invite) => invite.member?.id !== memberId)
        );
      })
      .catch((error) => {
        CustomAlert(
          "error",
          "신청수락",
          "이미 길드에 가입되었거나 길드에 속한 멤버입니다."
        );
      });
  };
  const rejectMember = (memberId: string, guildId: string) => {
    //길드신청 거절
    inviteReject(memberId, guildId)
      .then((response) => {
        CustomAlert("success", "신청거설", "길드 가입신청을 거절하셨습니다.");
        setInviteMembers((prev) =>
          prev.filter((invite) => invite.member?.id !== memberId)
        );
      })
      .catch((error) => {});
  };

  const handleChangeLine = (memberId: string, newLine: string) => {
    updateMemberGameLine(memberId, newLine)
      .then((response) => {
        const updatedMember: MemberDto = response.data.data;

        if (!guild) return;

        const updatedMembers = guild.guildMembers.map((member) =>
          member.id === updatedMember.id ? updatedMember : member
        );

        setGuild({
          ...guild,
          guildMembers: updatedMembers,
        });
      })
      .catch((error) => {
        console.error("라인 변경 실패:", error);
      });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
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
        .catch((error) => {
          CustomAlert("error", "길드 배너 변경", "변경 실패");
        });
      setOpenModal(!openModal);
    } else {
      CustomAlert(
        "error",
        "길드 배너 변경",
        "길드 배너 이미지를 등록해주세요."
      );
    }
  };

  return (
    <div className="flex flex-col p-[16px] gap-24px">
      {member!.memberGuild === null || member!.memberGuild === undefined ? (
        <GuildCreateIntro />
      ) : (
        <div className="flex flex-col w-full gap-[24px] p-[8px]">
          <div className="flex items-center gap-[16px]">
            <img
              src={`${constant.SERVER_URL}/${guild?.guildIcon}`}
              alt="GuildIcon"
              className="object-cover w-[100px] h-[100px] rounded-[12px]"
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
                title="길드배너"
                onClick={() => changeTab("banner")}
              />
              <ProfileHeader
                title="길드원"
                onClick={() => changeTab("members")}
              />
              {member &&
                member.memberName !== member.memberGuild.guildMaster && (
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
              {currentTab === "banner" && (
                <div className="flex flex-col items-center justify-center w-full border rounded-[8px] p-[16px] gap-[16px]">
                  {guild?.guildBanner ? (
                    <div className="flex flex-col items-center gap-[12px]">
                      {member &&
                        member.memberName ===
                          member.memberGuild.guildMaster && (
                          <button
                            className="px-[12px] py-[8px] text-[14px] bg-brandcolor hover:bg-opacity-80 text-white rounded-[8px] shadow"
                            onClick={() => setOpenModal(true)}
                          >
                            배너 수정하기
                          </button>
                        )}
                      <img
                        src={`${constant.SERVER_URL}/${guild.guildBanner}`}
                        alt="Guild Banner"
                        className=" rounded-[8px] shadow-md"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-400 text-center text-[14px]">
                        배너가 없습니다.
                      </p>
                      {member &&
                        member.memberName ===
                          member.memberGuild.guildMaster && (
                          <button
                            className="px-[12px] py-[8px] text-[14px] bg-brandcolor hover:bg-opacity-80 text-white rounded-[8px] shadow"
                            onClick={() => setOpenModal(true)}
                          >
                            배너 추가하기
                          </button>
                        )}
                    </>
                  )}
                </div>
              )}

              {currentTab === "members" && (
                <div className="flex flex-col gap-[4px] max-h-[300px]">
                  <div className="flex bg-brandcolor px-[8px] dark:bg-brandgray text-white text-[12px]">
                    <div className="flex-[1]">닉네임</div>
                    <div className="flex-[2]">소환사명</div>
                    <div className="flex-[1]">티어</div>
                    <div className="flex-[1]">라인</div>
                  </div>
                  <div className="flex flex-col gap-[4px] overflow-y-auto">
                    {guild?.guildMembers.map((member) => (
                      <GuildMemberBox
                        key={member.id}
                        guildMember={member}
                        guild={guild!}
                        type={"guildMember"}
                        expulsionMember={expulsionMember}
                        transferGuildMaste={transferGuildMaste}
                        onChangeLine={handleChangeLine}
                      />
                    ))}
                  </div>
                </div>
              )}
              {currentTab === "leave" && (
                <GuildLeaveSection
                  isChecked={memberChecked}
                  onChange={handleMemberCheckboxChange}
                  onClick={leaveGuild}
                />
              )}
              {currentTab === "applicants" && (
                <div className="flex flex-col gap-[4px] max-h-[300px]">
                  <div className="grid grid-cols-4 bg-brandcolor px-[8px] dark:bg-brandgray text-white text-[12px]">
                    <p>닉네임</p>
                    <p>소환사명</p>
                    <p>티어</p>
                  </div>
                  <div className="flex flex-col gap-[12px] overflow-y-auto">
                    {inviteMembers?.map((invite) => (
                      <GuildMemberBox
                        key={invite.id}
                        guildMember={invite.member!}
                        guild={invite.guild!}
                        type={"guildInvite"}
                        acceptMember={acceptMember}
                        rejectMember={rejectMember}
                      />
                    ))}
                  </div>
                </div>
              )}
              {currentTab === "delete" && (
                <GuildDeleteSection
                  isChecked={guildChecked}
                  onChange={handleGuildCheckboxChange}
                  onClick={deleteGuild}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {openModal && (
        <GuildBannerModal
          selectedImage={selectedImage}
          previewImage={previewImage}
          onClose={() => setOpenModal(false)}
          onImageChange={handleImageChange}
          onSubmit={handleBannerSubmit}
        />
      )}
    </div>
  );
};

export default GuildManagePage;

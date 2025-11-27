"use client";

import {
  createGuildTeam,
  guildTeamUpdate,
  deleteTeamInvite,
} from "@/src/api/guild_team.api";
import { getMembersNotInTeam } from "@/src/api/guild.api";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import constant from "@/src/common/constant/constant";
import {
  CreateGuildTeamDto,
  GuildTeamDto,
  UpdateGuildTeamDto,
} from "@/src/common/DTOs/guild/guild_team/guild_team.dto";
import { CreateGuildTeamMemberDto } from "@/src/common/DTOs/guild/guild_team/guild_team_member.dto";
import { GuildTeamInviteDto } from "@/src/common/DTOs/guild/guild_team/guild_team_invite.dto";
import { MemberDto } from "@/src/common/DTOs/member/member.dto";
import { Position } from "@/src/common/types/enums/position.enum";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { getTierStyle } from "@/src/utils/string/string.util";
import { useEffect, useState } from "react";
import { useGuildTeamStore } from "@/src/common/zustand/guild_team.zustand";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import Image from "next/image";

const POSITIONS = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

interface CreateTeamModalProps {
  onClose: () => void;
  teamInvites?: GuildTeamInviteDto[];
  onInviteRemoved?: () => void;
}

export default function CreateTeamModal(props: CreateTeamModalProps) {
  const isMobile = useIsMobile();
  const { onClose, teamInvites = [], onInviteRemoved } = props;
  const { member } = useMemberStore();
  const { guildTeam, setGuildTeam } = useGuildTeamStore();
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [memberList, setMemberList] = useState<MemberDto[]>([]);
  const [assignedMembers, setAssignedMembers] = useState<
    Record<string, MemberDto | null>
  >({
    TOP: null,
    JUNGLE: null,
    MID: null,
    ADC: null,
    SUPPORT: null,
  });

  // 수정 모드 판단
  const isEditMode = !!guildTeam;
  const isLeader = guildTeam?.leader.id === member?.id;

  // 기존 팀 멤버 있을 시 assignedMembers 초기화
  useEffect(() => {
    if (guildTeam) {
      const initialAssigned: Record<string, MemberDto | null> = {
        TOP: null,
        JUNGLE: null,
        MID: null,
        ADC: null,
        SUPPORT: null,
      };
      guildTeam.members.forEach((m) => {
        initialAssigned[m.position] = m.member;
      });
      setAssignedMembers(initialAssigned);
    }
  }, [guildTeam]);

  // 팀에 속하지 않은 길드원 목록 불러오기
  useEffect(() => {
    const guildId = member?.memberGuild?.id;
    if (guildId) {
      getMembersNotInTeam(guildId)
        .then((response) => {
          setMemberList(response.data.data);
        })
        .catch((error) => {
          console.error("길드원 목록 불러오기 실패:", error);
        });
    }
  }, []);

  // 포지션에 멤버 배치
  const handleAssign = (member: MemberDto) => {
    if (!selectedPosition) return;
    setAssignedMembers({ ...assignedMembers, [selectedPosition]: member });
  };

  // 초대 중인 멤버 제거
  const handleRemoveInvite = async (memberId: string) => {
    try {
      await deleteTeamInvite(memberId);
      CustomAlert("success", "초대 취소", "초대가 취소되었습니다.");

      // 부모 컴포넌트에서 초대 목록을 다시 불러오도록 콜백 호출
      if (onInviteRemoved) {
        onInviteRemoved();
      }
    } catch (error) {
      console.error("초대 취소 실패:", error);
      CustomAlert(
        "error",
        "초대 취소 실패",
        "초대 취소 중 오류가 발생했습니다."
      );
    }
  };

  // 팀 생성 or 수정 처리 함수
  const handleSaveTeam = () => {
    if (!member) return;

    const leaderId = isEditMode ? guildTeam?.leader.id : member.id;
    const guildId = member.memberGuild?.id;

    if (!guildId) return;

    if (leaderId !== member.id) {
      CustomAlert("warning", "팀 수정", "팀 리더만 수정 가능합니다");
      return;
    }

    // 포지션에 할당된 멤버 배열로 변환
    const members: CreateGuildTeamMemberDto[] = Object.entries(assignedMembers)
      .filter(([, value]) => value !== null)
      .map(([position, value]) => ({
        member: value!.id,
        position: position as Position,
      }));

    // 적어도 리더가 포함되어 있어야 함 체크
    const leaderIncluded = members.some((m) => m.member === leaderId);
    if (!leaderIncluded) {
      CustomAlert(
        "error",
        isEditMode ? "팀 수정 실패" : "팀 생성 실패",
        "팀 생성/수정시 본인이 반드시 포함되어 있어야 합니다."
      );
      return;
    }

    if (isEditMode && guildTeam) {
      const updateGuildTeam: UpdateGuildTeamDto = {
        id: guildTeam.id,
        leader: leaderId,
        members,
      };
      guildTeamUpdate(updateGuildTeam)
        .then((response) => {
          CustomAlert("success", "팀 수정", "팀 수정이 완료되었습니다.");
          setGuildTeam(response.data.data);
          onClose();
        })
        .catch((error) => {
          const code = error.response.data.code;
          if (code === "COMMON-005") {
            CustomAlert(
              "warning",
              "팀 수정",
              "이미 초대 되어있는 길드원이 존재합니다"
            );
          }
          console.log(error);
        });
    } else {
      const guildTeam: CreateGuildTeamDto = {
        guild: guildId,
        leader: leaderId,
        members,
      };
      createGuildTeam(guildTeam)
        .then((response) => {
          CustomAlert("success", "팀 생성", "성공적으로 팀을 생성 했습니다.");
          setGuildTeam(response.data.data);
          onClose();
        })
        .catch((error) => {
          if (error.response?.data?.code === "COMMON-001") {
            CustomAlert(
              "error",
              "팀 생성",
              "팀 생성시 본인이 반드시 포함되어 있어야 합니다."
            );
          } else {
            console.error("팀 생성 실패:", error);
          }
        });
    }
  };

  const assignedNames = Object.values(assignedMembers)
    .filter((m): m is MemberDto => m !== null)
    .map((m) => m.memberName);

  const invitedMemberNames = teamInvites
    ?.filter((invite) => invite.status === "PENDING")
    .map((invite) => invite.member.memberName);

  const availableGuildMembers = memberList.filter(
    (m) =>
      !assignedNames?.includes(m.memberName) &&
      !invitedMemberNames?.includes(m.memberName)
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-[36px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white dark:bg-branddark rounded-[12px] shadow-lg flex overflow-hidden overflow-y-auto ${
          isMobile ? "flex-col h-[600px]" : " w-[900px] h-[600px] "
        }`}
      >
        {/* Left Side */}
        <div
          className={`flex flex-col p-[24px] border-r border-brandborder dark:border-branddarkborder gap-[16px] bg-brandbgcolor dark:bg-brandgray overflow-y-auto ${
            isMobile ? "w-full h-[50%]" : "w-[50%]"
          }`}
        >
          <div className="flex justify-between items-center">
            <p className="text-[18px] font-semibold text-branddark dark:text-white">
              포지션 선택
            </p>
            <button
              onClick={handleSaveTeam}
              className="px-[12px] py-[4px] bg-brandcolor text-[14px] text-white rounded-md hover:opacity-90"
            >
              {isEditMode ? "팀 수정" : "팀 생성"}
            </button>
          </div>
          <p className="text-sm text-gray-400">
            왼쪽 포지션을 선택하고 우측에서 멤버를 배치하세요
          </p>

          <div className="flex flex-col gap-[12px]">
            {POSITIONS.map((pos) => (
              <div
                key={pos}
                className={`relative flex flex-col border rounded-md gap-[4px] p-[12px] bg-white dark:bg-branddark border-brandborder dark:border-branddarkborder ${
                  selectedPosition === pos
                    ? "text-brandcolor border-brandcolor dark:border-brandborder"
                    : "text-branddark dark:text-white"
                }`}
                onClick={() => {
                  if (!assignedMembers[pos]) {
                    setSelectedPosition(pos);
                  }
                }}
              >
                <div className="flex justify-between">
                  <p
                    className={`text-[14px] font-semibold transition-colors ${
                      selectedPosition === pos
                        ? "text-brandcolor"
                        : "text-branddark dark:text-white"
                    }`}
                  >
                    {pos}
                  </p>
                  {isLeader && assignedMembers[pos] && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const removed = assignedMembers[pos]; // 제거할 멤버

                        setAssignedMembers((prev) => ({
                          ...prev,
                          [pos]: null,
                        }));

                        if (
                          removed &&
                          !memberList.some((m) => m.id === removed.id)
                        ) {
                          setMemberList((prev) => [...prev, removed]);
                        }
                      }}
                      className=" text-gray-400 hover:text-red-500 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {assignedMembers[pos] ? (
                  <div className="text-[13px] text-gray-600 dark:text-gray-300">
                    <p>이름: {assignedMembers[pos]!.memberName}</p>
                    <p>
                      게임이름: {assignedMembers[pos]!.memberGame?.gameName}
                    </p>
                    <p>
                      티어:{" "}
                      <span
                        className={getTierStyle(
                          assignedMembers[pos]!.memberGame?.gameTier
                        )}
                      >
                        {assignedMembers[pos]!.memberGame?.gameTier}
                      </span>
                    </p>
                    <div className="flex gap-[4px] items-center">
                      <p>라인: {assignedMembers[pos]!.memberGame?.line}</p>
                      <Image
                        src={`${constant.SERVER_URL}/public/ranked-positions/${
                          assignedMembers[pos]!.memberGame?.line
                        }.png`}
                        alt="line"
                        width={15}
                        height={15}
                        className="w-[15px] h-[15px]"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    {(() => {
                      const invitedMember = teamInvites?.find(
                        (invite) =>
                          invite.position === pos && invite.status === "PENDING"
                      );
                      if (invitedMember) {
                        return (
                          <div className="relative text-[13px] text-orange-600 dark:text-orange-300">
                            <p>초대 중: {invitedMember.member.memberName}</p>
                            <p>
                              게임이름:{" "}
                              {invitedMember.member.memberGame?.gameName}
                            </p>
                            <p>
                              티어:{" "}
                              <span
                                className={getTierStyle(
                                  invitedMember.member.memberGame?.gameTier
                                )}
                              >
                                {invitedMember.member.memberGame?.gameTier}
                              </span>
                            </p>
                            <div className="flex gap-[4px] items-center">
                              <p>
                                라인: {invitedMember.member.memberGame?.line}
                              </p>
                              <Image
                                src={`${constant.SERVER_URL}/public/ranked-positions/${invitedMember.member.memberGame?.line}.png`}
                                alt="line"
                                width={15}
                                height={15}
                                className="w-[15px] h-[15px]"
                              />
                            </div>
                          </div>
                        );
                      }
                      return (
                        <p className="text-[13px] text-gray-400">
                          아직 배치되지 않음
                        </p>
                      );
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div
          className={`flex flex-col p-[24px] gap-[12px] overflow-y-auto ${
            isMobile ? "w-full h-[50%]" : "w-[50%]"
          }`}
        >
          <p className="text-[18px] font-semibold text-branddark dark:text-white">
            길드원 목록
          </p>
          <p className="text-sm text-gray-400">
            Riot 계정 연동이 되어있으며 팀에 속하지 않는 길드원의 목록입니다
          </p>

          {/* 초대 중인 멤버 섹션 */}
          {teamInvites?.filter((invite) => invite.status === "PENDING").length >
            0 && (
            <div className="mb-[16px]">
              <p className="text-[16px] font-semibold text-orange-600 dark:text-orange-300 mb-[8px]">
                📨 초대 중인 멤버
              </p>
              <div className="flex flex-col gap-[8px]">
                {teamInvites
                  .filter((invite) => invite.status === "PENDING")
                  .map((invite, i) => (
                    <div
                      key={i}
                      className="relative p-[12px] rounded-lg border border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20"
                    >
                      {isLeader && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveInvite(invite.member.id);
                          }}
                          className="absolute top-[8px] right-[8px] text-gray-400 text-[14px] hover:text-red-500 rounded-full w-[20px] h-[20px] flex items-center justify-center"
                        >
                          ✕
                        </button>
                      )}
                      <p className="text-[14px] font-medium text-orange-800 dark:text-orange-200">
                        {invite.member.memberName} ({invite.position})
                      </p>
                      <p className="text-[13px] text-orange-600 dark:text-orange-300">
                        소환사 명: {invite.member.memberGame?.gameName}
                      </p>
                      <div className="flex items-center gap-[4px] text-[13px] text-orange-600 dark:text-orange-300">
                        티어:
                        <span
                          className={getTierStyle(
                            invite.member.memberGame?.gameTier
                          )}
                        >
                          {invite.member.memberGame?.gameTier}
                        </span>{" "}
                        | 라인: {invite.member.memberGame?.line}
                        <Image
                          src={`${constant.SERVER_URL}/public/ranked-positions/${invite.member.memberGame?.line}.png`}
                          alt="line"
                          width={15}
                          height={15}
                          className="w-[15px] h-[15px]"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-[12px]">
            {availableGuildMembers.length > 0 ? (
              availableGuildMembers.map((member, i) => (
                <div
                  key={i}
                  className="p-[12px] rounded-lg border border-brandborder dark:border-branddarkborder bg-white dark:bg-brandgray hover:bg-brandhover cursor-pointer"
                  onClick={() => handleAssign(member)}
                >
                  <p className="text-[14px] font-medium dark:text-white">
                    {member.memberName}
                  </p>
                  <p className="text-[13px] ">
                    소환사 명: {member.memberGame?.gameName}
                  </p>
                  <div className="flex items-center gap-[4px] text-[13px] text-gray-600 dark:text-gray-300">
                    티어:
                    <span className={getTierStyle(member.memberGame?.gameTier)}>
                      {member.memberGame?.gameTier}
                    </span>{" "}
                    | 라인: {member.memberGame?.line}
                    <Image
                      src={`${constant.SERVER_URL}/public/ranked-positions/${member.memberGame?.line}.png`}
                      alt="line"
                      width={15}
                      height={15}
                      className="w-[15px] h-[15px]"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="flex justify-center h-full text-[14px] text-gray-400">
                😓 팀에 속하지 않은 길드원이 없습니다
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { createGuildTeam } from "@/src/api/guild_team.api";
import { getMembersNotInTeam } from "@/src/api/guild.api";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import constant from "@/src/common/constant/constant";
import {
  CreateGuildTeamDto,
  GuildTeamDto,
} from "@/src/common/DTOs/guild/guild_team/guild_team.dto";
import { CreateGuildTeamMemberDto } from "@/src/common/DTOs/guild/guild_team/guild_team_member.dto";
import { MemberDto } from "@/src/common/DTOs/member/member.dto";
import { Position } from "@/src/common/types/enums/position.enum";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { getTierStyle } from "@/src/utils/string/string.util";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const POSITIONS = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

interface CreateTeamModalProps {
  onClose: () => void;
  existingTeam?: GuildTeamDto; // 기존 팀 정보가 있으면 수정 모드
}

export default function CreateTeamModal(props: CreateTeamModalProps) {
  const { onClose, existingTeam } = props;
  const { member } = useMemberStore();
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
  const isEditMode = !!existingTeam;

  // 기존 팀 멤버 있을 시 assignedMembers 초기화
  useEffect(() => {
    if (existingTeam) {
      const initialAssigned: Record<string, MemberDto | null> = {
        TOP: null,
        JUNGLE: null,
        MID: null,
        ADC: null,
        SUPPORT: null,
      };
      existingTeam.members.forEach((m) => {
        // m.member는 MemberDto 타입이라고 가정
        initialAssigned[m.position] = m.member;
      });
      setAssignedMembers(initialAssigned);
    }
  }, [existingTeam]);

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

  // 팀 생성 or 수정 처리 함수
  const handleSaveTeam = () => {
    if (!member) return;

    const leaderId = member.id;
    const guildId = member.memberGuild?.id;

    if (!guildId) return;

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

    if (isEditMode && existingTeam) {
      // @todo: 팀 수정 API 호출 필요 -> 팀 구성원 추가 및 삭제
      // updateGuildTeam(existingTeam.id, {
      //   guild: guildId,
      //   leader: leaderId,
      //   members,
      // })
      //   .then(() => {
      //     onClose();
      //   })
      //   .catch((error) => {
      //     console.error("팀 수정 실패:", error);
      //   });
      console.log("팀 수정 API 호출 예시", {
        id: existingTeam.id,
        guild: guildId,
        leader: leaderId,
        members,
      });
      onClose();
    } else {
      const guildTeam: CreateGuildTeamDto = {
        guild: guildId,
        leader: leaderId,
        members,
      };
      createGuildTeam(guildTeam)
        .then((response) => {
          CustomAlert("success", "팀 생성", "성공적으로 팀을 생성 했습니다.");
          window.location.reload();
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

  // 이미 배치된 멤버 이름 목록
  const assignedNames = Object.values(assignedMembers)
    .filter((m): m is MemberDto => m !== null)
    .map((m) => m.memberName);

  // 배치 가능한 길드원 목록 (팀에 속하지 않은 길드원 + 기존 팀 멤버(수정 모드 시))
  const availableGuildMembers = memberList
    // 팀에 속하지 않은 길드원 중 assignedNames에 없는 사람 필터링
    .filter((m) => !assignedNames.includes(m.memberName));

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-branddark rounded-[12px] w-[900px] h-[600px] shadow-lg flex overflow-hidden"
      >
        {/* Left Side */}
        <div className="flex flex-col w-[50%] p-[24px] border-r border-brandborder dark:border-branddarkborder gap-[16px] bg-brandbgcolor dark:bg-brandgray overflow-y-auto">
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
                onClick={() => setSelectedPosition(pos)}
              >
                {assignedMembers[pos] && (
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
                    className="absolute top-[8px] right-[8px] text-gray-400 hover:text-red-500 text-sm"
                  >
                    ✕
                  </button>
                )}

                <p
                  className={`text-[14px] font-semibold transition-colors ${
                    selectedPosition === pos
                      ? "text-brandcolor"
                      : "text-branddark dark:text-white"
                  }`}
                >
                  {pos}
                </p>

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
                      <img
                        src={`${constant.SERVER_URL}/public/ranked-positions/${
                          assignedMembers[pos]!.memberGame?.line
                        }.png`}
                        alt={assignedMembers[pos]!.memberGame?.line}
                        className="w-[15px] h-[15px]"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-[13px] text-gray-400">
                    아직 배치되지 않음
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col w-[50%] p-[24px] gap-[12px] overflow-y-auto">
          <p className="text-[18px] font-semibold text-branddark dark:text-white">
            길드원 목록
          </p>
          <p className="text-sm text-gray-400">
            Riot 계정 연동이 되어있으며 팀에 속하지 않는 길드원의 목록입니다
          </p>
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
                    <img
                      src={`${constant.SERVER_URL}/public/ranked-positions/${member.memberGame?.line}.png`}
                      alt={member.memberGame?.line}
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

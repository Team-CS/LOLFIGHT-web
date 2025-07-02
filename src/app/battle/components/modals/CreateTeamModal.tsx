"use client";

import constant from "@/src/common/constant/constant";
import { getTierStyle } from "@/src/utils/string/string.util";
import { useState } from "react";

const POSITIONS = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

const dummyGuildMembers = new Array(10).fill(0).map((_, i) => ({
  name: `길드원 ${i + 1}`,
  gameName: `소환사${i + 1}#KR1`,
  tier: ["GOLD", "SILVER", "BRONZE", "PLATINUM", "DIAMOND"][i % 5],
  line: POSITIONS[i % 5],
}));

type MemberType = {
  name: string;
  gameName: string;
  tier: string;
  line: string;
};

type CreateTeamModalProps = {
  onClose: () => void;
};

export default function CreateTeamModal({ onClose }: CreateTeamModalProps) {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [assignedMembers, setAssignedMembers] = useState<
    Record<string, MemberType | null>
  >({
    TOP: null,
    JUNGLE: null,
    MID: null,
    ADC: null,
    SUPPORT: null,
  });

  const handleAssign = (member: MemberType) => {
    if (!selectedPosition) return;
    setAssignedMembers({ ...assignedMembers, [selectedPosition]: member });
  };

  // 배치된 멤버 이름 리스트 생성
  const assignedNames = Object.values(assignedMembers)
    .filter((m): m is MemberType => m !== null)
    .map((m) => m.name);

  // 오른쪽 길드원 목록 필터링
  const availableGuildMembers = dummyGuildMembers.filter(
    (member) => !assignedNames.includes(member.name)
  );

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
        <div className="flex flex-col w-[50%] p-[24px] border-r border-brandborder dark:border-branddarkborder flex flex-col gap-[16px] bg-brandbgcolor dark:bg-brandgray overflow-y-auto">
          <div className="flex justify-between items-center">
            <p className="text-[18px] font-semibold text-branddark dark:text-white">
              포지션 선택
            </p>
            <button
              onClick={onClose}
              className="px-[12px] py-[4px] bg-brandcolor text-[14px] text-white rounded-md hover:opacity-90"
            >
              팀 생성
            </button>
          </div>
          <p className="text-sm text-gray-400">
            왼쪽 포지션을 선택하고 우측에서 멤버를 배치하세요
          </p>

          <div className="flex flex-col gap-[12px]">
            {POSITIONS.map((pos) => (
              <div
                key={pos}
                className={`flex flex-col border rounded-md gap-[4px] p-[12px] bg-white dark:bg-branddark border-brandborder dark:border-branddarkborder ${
                  selectedPosition === pos
                    ? "text-brandcolor border-brandcolor dark:border-brandborder"
                    : "text-branddark dark:text-white"
                }`}
                onClick={() => setSelectedPosition(pos)}
              >
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
                    <p>이름: {assignedMembers[pos]!.name}</p>
                    <p>게임이름: {assignedMembers[pos]!.gameName}</p>
                    <p>
                      티어:{" "}
                      <span
                        className={getTierStyle(assignedMembers[pos]!.tier)}
                      >
                        {assignedMembers[pos]!.tier}
                      </span>
                    </p>
                    <div className="flex gap-[4px] items-center">
                      <p>라인: {assignedMembers[pos]!.line}</p>
                      <img
                        src={`${constant.SERVER_URL}/public/ranked-positions/${
                          assignedMembers[pos]!.line
                        }.png`}
                        alt={assignedMembers[pos]!.line}
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
            팀에 속하지 않는 길드원의 목록입니다
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
                    {member.name}
                  </p>
                  <p className="text-[13px] ">소환사 명: {member.gameName}</p>
                  <div className="flex items-center gap-[4px] text-[13px] text-gray-600 dark:text-gray-300">
                    티어:
                    <span className={getTierStyle(member.tier)}>
                      {member.tier}
                    </span>{" "}
                    | 라인: {member.line}
                    <img
                      src={`${constant.SERVER_URL}/public/ranked-positions/${member.line}.png`}
                      alt={member.line}
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

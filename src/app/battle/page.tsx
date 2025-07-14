"use client";

import { useEffect, useState } from "react";
import TeamMemberCard from "./components/TeamMemberCard";
import { FaSearch } from "react-icons/fa";
import { Pagination } from "@mui/material";
import CreateTeamModal from "./components/modals/CreateTeamModal";
import constant from "@/src/common/constant/constant";
import {
  deleteGuildTeam,
  getMyGuildTeam,
  leaveGuildTeam,
} from "@/src/api/guild_team.api";
import ButtonAlert from "@/src/common/components/alert/ButtonAlert";
import { useRouter } from "next/navigation";
import { useGuildTeamStore } from "@/src/common/zustand/guild_team.zustand";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import BattleRegisterModal from "./components/modals/BattleRegisterModal";
import {
  applyScrim,
  createScrimSlot,
  getScrimSlotList,
} from "@/src/api/scrim.api";
import {
  CreateScrimSlotDto,
  ScrimSlotDto,
  ScrimSlotListDto,
} from "@/src/common/DTOs/scrim/scrim_slot.dto";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { BattleTeamCard } from "./components/BattleTeamCard";
import { BattleTeamModal } from "./components/modals/BattleTeamModal";
import { GuildTeamDto } from "@/src/common/DTOs/guild/guild_team/guild_team.dto";
import { CreateScrimApplicationDto } from "@/src/common/DTOs/scrim/scrim_application.dto";

const POSITIONS = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"] as const;

export default function Page() {
  const router = useRouter();
  const { member } = useMemberStore();
  const { guildTeam, setGuildTeam } = useGuildTeamStore();

  const [scrimSlots, setScrimSlots] = useState<ScrimSlotDto[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(10); // 총 페이지 수
  const [searchTerm, setSearchTerm] = useState<string>("");
  const scrimSlotsPerPage = 10;

  const [selectedTeam, setSelectedTeam] = useState<ScrimSlotDto | null>(null);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState<boolean>(false);
  const [isRegisterTeamOpen, setIsRegisterTeamOpen] = useState<boolean>(false);

  useEffect(() => {
    getMyGuildTeam()
      .then((response) => {
        setGuildTeam(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetchScrimSlots(currentPage);
  }, [currentPage]);

  const fetchScrimSlots = async (page: number) => {
    try {
      const response = await getScrimSlotList(
        page,
        scrimSlotsPerPage,
        searchTerm
      );
      const data = response.data.data as ScrimSlotListDto;
      if (Array.isArray(data.scrimSlotList)) {
        setScrimSlots(data.scrimSlotList);
      } else {
        setScrimSlots([]);
      }

      if (data.pagination) {
        const { totalPage } = data.pagination;
        const pages = Math.ceil(totalPage! / scrimSlotsPerPage);
        setTotalPages(Math.max(1, pages));
      }
    } catch (error) {
      console.log("스크림 대기 팀 목록 조회 실패 : ", error);
      setScrimSlots([]);
      setTotalPages(1);
    }
  };

  const handlePageClick = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };

  const handledeleteClick = () => {
    const deleteTeam = () => {
      if (guildTeam) {
        deleteGuildTeam(guildTeam?.leader.id)
          .then((response) => {
            setGuildTeam(null);
            router.refresh();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
    ButtonAlert(
      "길드 팀 삭제",
      `길드 팀을 삭제하시겠습니까? 팀은 해체되며 팀의 대기록목은 제거됩니다.`,
      "삭제",
      deleteTeam
    );
  };

  const handleLeaveClick = () => {
    const leaveTeam = () => {
      if (guildTeam) {
        leaveGuildTeam(guildTeam.id)
          .then((response) => {
            setGuildTeam(null);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
    ButtonAlert(
      "길드 팀 탈퇴",
      "길드 팀을 탈퇴하시겠습니따? 팀의 대기목록이 제거됩니다",
      "탈퇴",
      leaveTeam
    );
  };

  const handleSumbit = (datetime: string, note: string) => {
    if (guildTeam) {
      const date = new Date(datetime);
      const createScrimSlotDto: CreateScrimSlotDto = {
        hostTeam: guildTeam,
        scheduledAt: date,
        note: note,
      };
      createScrimSlot(createScrimSlotDto)
        .then((response) => {
          CustomAlert(
            "success",
            "스크림 등록",
            "스크림 등록이 완료 되었습니다! 신청을 기다려 주세요"
          );
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.code === "COMMON-005") {
            CustomAlert("warning", "스크림 등록", "이미 등록되어 있습니다.");
          } else if (error.response.data.code === "COMMON-010") {
            CustomAlert(
              "warning",
              "스크림 등록",
              "팀원 5명이 모두 구성되어야 스크림 등록이 가능합니다."
            );
          }
        });
    }
  };

  const handleApply = (scrimSlotId: string) => {
    if (guildTeam) {
      const createScrimApplicationDto: CreateScrimApplicationDto = {
        applicationTeam: guildTeam,
      };
      applyScrim(scrimSlotId, createScrimApplicationDto)
        .then((response) => {
          CustomAlert(
            "success",
            "스크림 신청",
            "스크림 신청이 완료 되었습니다! 상대팀의 응답을 기다려 주세요"
          );
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.code === "COMMON-005") {
            CustomAlert("warning", "스크림 신청", "이미 신청되어 있습니다.");
          } else if (error.response.data.code === "COMMON-010") {
            CustomAlert(
              "warning",
              "스크림 신청",
              "팀원 5명이 모두 구성되어야 스크림 신청이 가능합니다."
            );
          }
        });
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-[24px] py-[28px]">
      {guildTeam && member ? (
        // ✅ 팀이 있을 때
        <div className="flex h-[470px] p-[32px] shadow-md rounded-[12px] gap-[24px] dark:bg-branddark">
          <div className="flex flex-col w-[50%] gap-[12px]">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-[16px]">
                <img
                  src={`${constant.SERVER_URL}/${guildTeam.guild.guildIcon}`}
                  alt="logo"
                  className="w-[60px] h-[60px] rounded-[12px] object-cover"
                />
                <div className="flex flex-col">
                  <p className="text-[22px] font-semibold">
                    {guildTeam.leader.memberName}팀
                  </p>
                  <p className="text-[14px] text-gray-400">
                    리더: {guildTeam.leader.memberName} -{" "}
                    {guildTeam.leader.memberGame?.gameName}
                  </p>
                </div>
              </div>

              {guildTeam.leader.id === member.id ? (
                <div className="flex gap-[12px]">
                  <button
                    onClick={() => setIsCreateTeamOpen(true)}
                    className="px-[12px] py-[4px] bg-brandcolor text-[14px] text-white rounded-md hover:opacity-90"
                  >
                    팀 수정
                  </button>
                  <button
                    onClick={handledeleteClick}
                    className="px-[12px] py-[4px] bg-brandcolor text-[14px] text-white rounded-md hover:opacity-90"
                  >
                    팀 삭제
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLeaveClick}
                  className="px-[12px] py-[4px] bg-brandcolor text-[14px] text-white rounded-md hover:opacity-90"
                >
                  팀 탈퇴
                </button>
              )}
            </div>

            <div className="border-t border-gray-600/30" />

            {/* Member list */}
            <div className="flex flex-col gap-[6px]">
              {guildTeam &&
                POSITIONS.map((pos) => {
                  const member = guildTeam.members.find(
                    (m) => m.position === pos
                  );
                  return (
                    <TeamMemberCard
                      key={pos}
                      teamMember={member}
                      roleTag={pos}
                      onAddClick={() => setIsCreateTeamOpen(true)}
                    />
                  );
                })}
            </div>
          </div>

          {/* 내전 대기 또는 진행중 */}
          <div className="flex flex-col w-[50%] gap-[12px]">
            <p className="text-[18px] font-semibold ">
              📜 내전 일정 및 최근 기록
            </p>
            <div className="flex flex-col h-full gap-[12px] overflow-y-auto">
              {/* <MatchCard
                opponent="다리우스의형제들"
                date="2025년 7월 5일 21:00"
                status="upcoming"
                resultText="대기중"
              />
              <MatchCard
                opponent="모데카이저의철권"
                date="2025년 6월 30일"
                status="finished"
                resultText="승리"
              />
              <MatchCard
                opponent="모데카이저의철권"
                date="2025년 6월 30일"
                status="finished"
                resultText="패배"
              /> */}
            </div>
          </div>
        </div>
      ) : (
        // ✅ 팀이 없을 때
        <div className="flex flex-col items-center justify-center h-[470px] gap-[16px] py-[60px] rounded-[12px] dark:bg-branddark shadow-md">
          <p className="text-[14px] text-gray-400">
            😓 아직 팀에 가입하지 않았습니다
          </p>
          <div className="flex gap-[12px]">
            <button
              className="px-[16px] py-[8px] rounded-[8px] bg-primary text-white text-[14px] font-medium hover:opacity-90"
              onClick={() => setIsCreateTeamOpen(!isCreateTeamOpen)}
            >
              팀 생성
            </button>
          </div>
        </div>
      )}

      {/* Battle Team List */}
      <div className="flex flex-col w-full p-[32px] gap-[24px] shadow-md rounded-[12px] dark:bg-branddark">
        <div className="flex justify-between">
          <p className="text-[18px] font-semibold">🔥 스크림 대기 팀 목록</p>
          <div className="flex items-center gap-[12px]">
            <div className="flex w-[200px] border border-gray-200 rounded-md px-[12px] gap-[4px] bg-gray-100 dark:bg-black dark:border-black">
              <div className="flex flex-wrap justify-center content-center dark:bg-black">
                <FaSearch />
              </div>
              <input
                className="w-full rounded-md bg-gray-100 px-[12px] py-[4px] text-[14px] focus:outline-none dark:bg-black font-normal"
                type="text"
                placeholder="검색어 입력 (2자 이상)"
              />
            </div>
            {guildTeam && guildTeam.leader.id === member?.id && (
              <button
                onClick={() => setIsRegisterTeamOpen(true)}
                className="px-[12px] py-[4px] bg-brandcolor text-[14px] text-white rounded-md hover:opacity-90"
              >
                등록
              </button>
            )}
          </div>
        </div>

        {scrimSlots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[16px] place-items-center">
            {scrimSlots.map((team, i) => (
              <BattleTeamCard
                key={i}
                scrimSlot={team}
                onClick={() => setSelectedTeam(team)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-[16px] py-[60px] rounded-[12px] dark:bg-branddark shadow-md text-gray-400">
            <p className="text-[18px]">😓 내전을 원하는 팀이 없습니다.</p>
            <p className="text-[14px] text-center">
              새로운 팀들이 내전을 신청하면 여기서 확인할 수 있습니다.
            </p>
          </div>
        )}
        <div className="w-full flex justify-center py-[12px]">
          <Pagination
            count={totalPages}
            page={currentPage}
            shape="rounded"
            boundaryCount={2}
            onChange={(event, page) => handlePageClick(event, page)}
            sx={{
              ".dark & .Mui-selected": {
                backgroundColor: "#4C4C4C",
                color: "#CACACA",
                "&:hover": {
                  backgroundColor: "#707070",
                },
              },
              ".dark & .MuiPaginationItem-root": {
                color: "#EEEEEE",
              },
              ".dark & .MuiPaginationItem-icon": {
                color: "#EEEEEE",
              },
            }}
          />
        </div>
      </div>
      {/* 모달 렌더링 */}
      {selectedTeam && (
        <BattleTeamModal
          scrimSlot={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onApply={handleApply}
        />
      )}
      {isCreateTeamOpen && (
        <CreateTeamModal onClose={() => setIsCreateTeamOpen(false)} />
      )}

      {isRegisterTeamOpen && (
        <BattleRegisterModal
          onSubmit={handleSumbit}
          onClose={() => setIsRegisterTeamOpen(false)}
        />
      )}
    </div>
  );
}

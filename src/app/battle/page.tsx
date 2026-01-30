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
  getMyTeamInviteList,
  leaveGuildTeam,
} from "@/src/api/guild_team.api";
import { GuildTeamInviteDto } from "@/src/common/DTOs/guild/guild_team/guild_team_invite.dto";
import ButtonAlert from "@/src/common/components/alert/ButtonAlert";
import { useRouter } from "next/navigation";
import { useGuildTeamStore } from "@/src/common/zustand/guild_team.zustand";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import BattleRegisterModal from "./components/modals/BattleRegisterModal";
import {
  applyScrim,
  cancelScrim,
  createScrimSlot,
  deleteScrimSlot,
  getScrimApplicationList,
  getScrimSlot,
  getScrimSlotList,
  rematchScrim,
} from "@/src/api/scrim.api";
import {
  CreateScrimSlotDto,
  ScrimSlotDto,
  ScrimSlotListDto,
} from "@/src/common/DTOs/scrim/scrim_slot.dto";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { BattleTeamCard } from "./components/BattleTeamCard";
import { BattleTeamModal } from "./components/modals/BattleTeamModal";
import {
  CreateScrimApplicationDto,
  ScrimApplicationDto,
  ScrimApplicationRematchDto,
} from "@/src/common/DTOs/scrim/scrim_application.dto";
import MatchCard from "./components/MatchCard";
import { getCookie } from "@/src/utils/cookie/cookie";
import { getMemberData } from "@/src/api/member.api";
import { MemberDto } from "@/src/common/DTOs/member/member.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { BattleTeamCardMobile } from "./components/BattleTeamCardMobile";
import Image from "next/image";

const POSITIONS = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"] as const;

export default function Page() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { member, setMember } = useMemberStore();
  const { guildTeam, setGuildTeam } = useGuildTeamStore();

  const [myTeamSlot, setMyTeamSlot] = useState<ScrimSlotDto | null>();
  const [scrimSlots, setScrimSlots] = useState<ScrimSlotDto[]>([]);
  const [applications, setApplications] = useState<ScrimApplicationDto[]>([]);
  const [teamInvites, setTeamInvites] = useState<GuildTeamInviteDto[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(10); // 총 페이지 수
  const [searchTerm, setSearchTerm] = useState<string>("");
  const scrimSlotsPerPage = 10;

  const [selectedTeam, setSelectedTeam] = useState<ScrimSlotDto | null>(null);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState<boolean>(false);
  const [isRegisterTeamOpen, setIsRegisterTeamOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const accessToken = getCookie("lf_atk");

  useEffect(() => {
    if (accessToken) {
      getMemberData().then((response) => {
        const memberData: MemberDto = response.data.data;
        setMember(memberData);
      });
      getMyGuildTeam()
        .then((response) => {
          setGuildTeam(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
      getScrimApplicationList()
        .then((response) => {
          setApplications(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    if (!guildTeam || !member) return;
    getScrimSlot(guildTeam.id)
      .then((response) => {
        const data = response.data.data;
        if (data && data.status !== "CLOSED") setMyTeamSlot(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [guildTeam]);

  useEffect(() => {
    if (guildTeam) {
      getMyTeamInviteList(guildTeam.id)
        .then((response) => {
          setTeamInvites(response.data.data);
        })
        .catch((error) => {
          console.log("팀 초대 목록 조회 실패:", error);
        });
    }
  }, [guildTeam]);

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
      console.log(data);
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

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (trimmed.length >= 2) {
      setCurrentPage(1);
      fetchScrimSlots(1);
    } else {
      alert("검색어는 최소 2자 이상 입력해주세요.");
    }

    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
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
            const code = error?.response?.data?.code;
            if (code === "COMMON-002") {
              CustomAlert(
                "warning",
                "길드 팀 삭제",
                "대기중인 스크림이 없어야 팀 삭제가 가능합니다."
              );
            }
          });
      }
    };

    if (applications.some((application) => application.status === "ACCEPTED")) {
      CustomAlert(
        "warning",
        "길드 팀 삭제",
        "대기중인 스크림이 없어야 팀 삭제가 가능합니다."
      );
      return;
    }

    ButtonAlert(
      "길드 팀 삭제",
      `길드 팀을 삭제하시겠습니까? 팀은 해체되며 팀의 대기록목은 제거됩니다.`,
      "삭제",
      "닫기",
      deleteTeam
    );
  };

  const handleUpdateClick = () => {
    if (applications.some((application) => application.status === "ACCEPTED")) {
      CustomAlert(
        "warning",
        "길드 팀 수정",
        "대기중인 스크림이 없어야 팀 수정이 가능합니다."
      );
      return;
    }
    setIsCreateTeamOpen(true);
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
      "길드 팀을 탈퇴하시겠습니까?\n 팀의 대기목록과 대기중인 스크림이 제거됩니다",
      "탈퇴",
      "닫기",
      leaveTeam
    );
  };

  const handleSumbit = (datetime: string, note: string, count: number) => {
    if (guildTeam) {
      const date = new Date(datetime);
      const createScrimSlotDto: CreateScrimSlotDto = {
        hostTeam: guildTeam,
        scheduledAt: date,
        note: note,
        totalGameCount: count,
      };
      createScrimSlot(createScrimSlotDto)
        .then((response) => {
          const newSlot = response.data.data as ScrimSlotDto;

          setScrimSlots((prevSlots) => [newSlot, ...prevSlots]);

          setMyTeamSlot(newSlot);

          CustomAlert(
            "success",
            "스크림 등록",
            "스크림 등록이 완료 되었습니다! 신청을 기다려 주세요"
          );
        })
        .catch((error) => {
          console.log(error);
          const code = error.response.data.code;
          if (code === "COMMON-005") {
            CustomAlert("warning", "스크림 등록", "이미 등록되어 있습니다.");
          } else if (code === "COMMON-010") {
            CustomAlert(
              "warning",
              "스크림 등록",
              "팀원 5명이 모두 구성되어야 스크림 등록이 가능합니다."
            );
          } else if (code === "COMMON-002") {
            CustomAlert(
              "warning",
              "스크림 등록",
              "신청한 스크림이 존재합니다. 진행중인 스크림을 종료하고 다시 시도해주세요."
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
          const code = error?.response?.data?.code;
          if (code === "COMMON-005") {
            CustomAlert("warning", "스크림 신청", "이미 신청되어 있습니다.");
          } else if (code === "COMMON-010") {
            CustomAlert(
              "warning",
              "스크림 신청",
              "팀원 5명이 모두 구성되어야 스크림 신청이 가능합니다."
            );
          } else if (code === "COMMON-003") {
            CustomAlert("warning", "스크림 신청", "삭제된 스크림 입니다.");
          } else if (code === "COMMON-002") {
            CustomAlert(
              "warning",
              "스크림 신청",
              "해당 팀은 이미 스크림을 등록한 상태이거나,\n 대기중인 스크림이 존재합니다. \n 다른 팀에 신청할 수 없습니다."
            );
          }
        });
    }
  };

  const handledeleteSlotClick = () => {
    const onConfirmDelete = () => {
      if (myTeamSlot) {
        deleteScrimSlot(myTeamSlot.id)
          .then((res) => {
            setScrimSlots((prevSlots) =>
              prevSlots.filter((slot) => slot.id !== myTeamSlot.id)
            );

            setMyTeamSlot(undefined);

            CustomAlert(
              "success",
              "스크림 등록 취소",
              "등록된 스크림이 삭제되었습니다."
            );
          })
          .catch((error) => {
            console.log(error);
            const code = error?.response?.data?.code;
            if (code === "COMMON-002") {
              CustomAlert(
                "error",
                "삭제 불가",
                "이미 매치가 확정된 스크림은 삭제할 수 없습니다."
              );
            } else if (code === "COMMON-006") {
              CustomAlert(
                "error",
                "권한 없음",
                "스크림을 삭제할 권한이 없습니다."
              );
            } else {
              CustomAlert(
                "error",
                "삭제 실패",
                "스크림 삭제 중 오류가 발생했습니다."
              );
            }
          });
      }
    };

    ButtonAlert(
      "스크림 등록 취소",
      "등록된 스크림을 삭제하시겠습니까? \n 대기 중인 신청도 모두 취소됩니다.",
      "삭제",
      "닫기",
      onConfirmDelete
    );
  };

  const handleCancelScrim = (scrimSlotId: string) => {
    const onConfirmCancel = () => {
      if (guildTeam) {
        cancelScrim(scrimSlotId, guildTeam?.id)
          .then((response) => {
            setApplications((prev) =>
              prev.filter((app) => app.scrimSlot.id !== scrimSlotId)
            );
          })
          .catch((error) => {
            console.log(error);
            const code = error?.response?.data?.code;
            if (code === "COMMON-003") {
              CustomAlert("error", "취소 실패", "존재하지 않는 스크림 입니다.");
            }
          });
      }
    };

    ButtonAlert(
      "스크림 취소",
      "진행중인 스크림을 취소하시겠습니까? \n 대기중인 스크림을 취소하면 래더점수가 하락합니다.",
      "취소",
      "닫기",
      onConfirmCancel
    );
  };

  const handleRegisterScrim = () => {
    if (applications.some((application) => application.status === "ACCEPTED")) {
      CustomAlert(
        "warning",
        "스크림 등록",
        "대기중인 스크림이 없어야 등록이 가능합니다."
      );
      return;
    }
    setIsRegisterTeamOpen(true);
  };

  const handleInviteRemoved = () => {
    // 초대 목록을 다시 불러오기
    if (guildTeam) {
      getMyTeamInviteList(guildTeam.id)
        .then((response) => {
          setTeamInvites(response.data.data);
        })
        .catch((error) => {
          console.log("팀 초대 목록 조회 실패:", error);
        });
    }
  };

  return (
    <div className={`max-w-[1200px] mx-auto flex flex-col gap-[24px] ${
      isMobile ? "px-[16px] py-[20px]" : "py-[28px]"
    }`}>
      {guildTeam && member ? (
        // ✅ 팀이 있을 때
        <div
          className={`flex bg-white dark:bg-dark rounded-[16px] shadow-lg border border-gray-100 dark:border-branddarkborder gap-[24px] overflow-hidden ${
            isMobile ? "flex-col p-[20px]" : "p-[28px]"
          }`}
        >
          <div
            className={`flex flex-col gap-[16px] ${
              isMobile ? "w-full" : "w-[50%]"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-[14px]">
                <div className="relative">
                  {guildTeam.guild?.guildIcon ? (
                    <Image
                      src={`${constant.SERVER_URL}/${guildTeam.guild.guildIcon}`}
                      alt="logo"
                      width={60}
                      height={60}
                      className={`rounded-[14px] object-cover shadow-md ${
                        isMobile ? "w-[50px] h-[50px]" : "w-[60px] h-[60px]"
                      }`}
                      quality={100}
                    />
                  ) : (
                    <div
                      className={`rounded-[14px] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-[28px] shadow-md ${
                        isMobile ? "w-[50px] h-[50px]" : "w-[60px] h-[60px]"
                      }`}
                    >
                      🏛️
                    </div>
                  )}
                  <div className="absolute -bottom-[4px] -right-[4px] w-[18px] h-[18px] bg-green-500 rounded-full border-[3px] border-white dark:border-dark" />
                </div>
                <div className="flex flex-col gap-[2px]">
                  <p
                    className={`font-bold ${
                      isMobile ? "text-[16px]" : "text-[20px]"
                    }`}
                  >
                    {guildTeam.leader.memberName}팀
                  </p>
                  <p
                    className={`text-gray-400 ${
                      isMobile ? "text-[11px]" : "text-[13px]"
                    }`}
                  >
                    리더: {guildTeam.leader.memberName} · {guildTeam.leader.memberGame?.gameName}
                  </p>
                </div>
              </div>

              {guildTeam.leader.id === member.id ? (
                myTeamSlot ? (
                  <button
                    onClick={handledeleteSlotClick}
                    className={`bg-gradient-to-r from-red-500 to-red-600 text-white rounded-[8px] hover:opacity-90 transition-opacity shadow-sm font-medium ${
                      isMobile
                        ? "px-[10px] py-[6px] text-[11px]"
                        : "px-[14px] py-[6px] text-[13px]"
                    }`}
                  >
                    등록 취소
                  </button>
                ) : (
                  <div
                    className={`flex ${
                      isMobile ? "flex-col gap-[6px]" : "gap-[8px]"
                    }`}
                  >
                    <button
                      onClick={handleUpdateClick}
                      className={`bg-gradient-to-r from-brandcolor to-blue-500 text-white rounded-[8px] hover:opacity-90 transition-opacity shadow-sm font-medium ${
                        isMobile
                          ? "px-[10px] py-[6px] text-[11px]"
                          : "px-[14px] py-[6px] text-[13px]"
                      }`}
                    >
                      팀 수정
                    </button>
                    <button
                      onClick={handledeleteClick}
                      className={`border border-gray-200 dark:border-branddarkborder text-gray-600 dark:text-gray-300 rounded-[8px] hover:bg-gray-50 dark:hover:bg-branddarkborder transition-colors font-medium ${
                        isMobile
                          ? "px-[10px] py-[6px] text-[11px]"
                          : "px-[14px] py-[6px] text-[13px]"
                      }`}
                    >
                      팀 삭제
                    </button>
                  </div>
                )
              ) : (
                <button
                  onClick={handleLeaveClick}
                  className={`border border-gray-200 dark:border-branddarkborder text-gray-600 dark:text-gray-300 rounded-[8px] hover:bg-gray-50 dark:hover:bg-branddarkborder transition-colors font-medium ${
                    isMobile
                      ? "px-[10px] py-[6px] text-[11px]"
                      : "px-[14px] py-[6px] text-[13px]"
                  }`}
                >
                  팀 탈퇴
                </button>
              )}
            </div>

            <div className="border-t border-gray-100 dark:border-branddarkborder" />

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
                      invitedMember={
                        teamInvites?.find(
                          (invite) =>
                            invite.position === pos &&
                            invite.status === "PENDING"
                        )?.member
                      }
                    />
                  );
                })}
            </div>
          </div>

          {/* 내전 대기 또는 진행중 */}
          <div
            className={`flex flex-col gap-[14px] ${
              isMobile ? "w-full" : "w-[50%]"
            }`}
          >
            <div className="flex items-center gap-[10px]">
              <div className="w-[4px] h-[20px] bg-gradient-to-b from-brandcolor to-blue-400 rounded-full" />
              <p className={`font-bold ${isMobile ? "text-[15px]" : "text-[17px]"}`}>
                스크림 일정 및 최근 기록
              </p>
            </div>
            <div
              className={`flex flex-col gap-[10px] overflow-y-auto pr-[4px] ${
                isMobile ? "max-h-[400px]" : "max-h-[350px]"
              }`}
            >
              {applications
                .filter((data) => {
                  const myTeamId = guildTeam?.id;
                  const isRecipient = myTeamId === data.applicationTeam?.id;

                  if (data.status === "PENDING" && !isRecipient) {
                    return false;
                  }

                  return ["PENDING", "ACCEPTED", "CLOSED"].includes(
                    data.status
                  );
                })
                .map((data) => (
                  <MatchCard
                    key={data.id}
                    scrim={data}
                    onCancel={handleCancelScrim}
                  />
                ))}
            </div>
          </div>
        </div>
      ) : member?.memberGuild ? (
        // member.memberGuild는 있지만 guildTeam이 없을 때
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-[20px] py-[60px] bg-white dark:bg-dark rounded-[16px] shadow-lg border border-gray-100 dark:border-branddarkborder">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-[48px] h-[48px] text-gray-300 dark:text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
            />
          </svg>
          <p className={`text-gray-400 ${isMobile ? "text-[13px]" : "text-[15px]"}`}>
            아직 팀에 가입하지 않았습니다
          </p>
          <button
            className={`bg-gradient-to-r from-brandcolor to-blue-500 text-white rounded-[10px] hover:opacity-90 transition-opacity shadow-md font-medium ${
              isMobile ? "px-[20px] py-[10px] text-[13px]" : "px-[24px] py-[12px] text-[14px]"
            }`}
            onClick={() => setIsCreateTeamOpen(!isCreateTeamOpen)}
          >
            팀 생성하기
          </button>
        </div>
      ) : (
        // member.memberGuild도 없을 때 (완전 없는 상태)
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-[20px] py-[60px] bg-white dark:bg-dark rounded-[16px] shadow-lg border border-gray-100 dark:border-branddarkborder">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-[48px] h-[48px] text-gray-300 dark:text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <p className={`text-gray-400 ${isMobile ? "text-[13px]" : "text-[15px]"}`}>
            아직 속한 길드가 없습니다
          </p>
          <p className={`text-gray-300 dark:text-gray-500 ${isMobile ? "text-[11px]" : "text-[13px]"}`}>
            길드에 가입하면 스크림에 참여할 수 있습니다
          </p>
        </div>
      )}

      {/* Battle Team List */}
      <div className={`flex flex-col w-full gap-[20px] bg-white dark:bg-dark rounded-[16px] shadow-lg border border-gray-100 dark:border-branddarkborder ${
        isMobile ? "p-[20px]" : "p-[28px]"
      }`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[10px]">
            <div className="w-[4px] h-[20px] bg-gradient-to-b from-brandcolor to-blue-400 rounded-full" />
            <p className={`font-bold ${isMobile ? "text-[15px]" : "text-[18px]"}`}>
              스크림 대기 팀 목록
            </p>
          </div>
          <div className="flex items-center gap-[10px]">
            {isMobile ? (
              <>
                {/* 검색 아이콘 */}
                <div
                  onClick={() => setIsSearchOpen(true)}
                  className="p-[8px] rounded-[8px] bg-gray-100 dark:bg-branddark cursor-pointer hover:bg-gray-200 dark:hover:bg-branddarkborder transition-colors"
                >
                  <FaSearch className="w-[14px] h-[14px] text-gray-500" />
                </div>

                {/* 검색 팝업 */}
                {isSearchOpen && (
                  <div
                    className="fixed inset-0 z-50 flex items-start justify-center bg-black/40"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <div
                      className="mt-[60px] w-[90%] max-w-md rounded-[16px] bg-white dark:bg-dark border border-gray-100 dark:border-branddarkborder shadow-xl p-[16px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-[10px]">
                        <div className="flex flex-1 items-center gap-[8px] bg-gray-50 dark:bg-branddark rounded-[10px] px-[12px] py-[10px] border border-gray-100 dark:border-branddarkborder">
                          <FaSearch className="w-[14px] h-[14px] text-gray-400" />
                          <input
                            autoFocus
                            className="w-full bg-transparent text-[13px] focus:outline-none"
                            type="text"
                            placeholder="길드명 입력 (2자 이상)"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                          />
                        </div>
                        <button
                          onClick={handleSearch}
                          className="px-[16px] py-[10px] bg-gradient-to-r from-brandcolor to-blue-500 text-white text-[13px] font-medium rounded-[10px] hover:opacity-90 transition-opacity"
                        >
                          검색
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-[8px] bg-gray-50 dark:bg-branddark rounded-[10px] px-[14px] py-[8px] border border-gray-100 dark:border-branddarkborder">
                <FaSearch
                  className="w-[14px] h-[14px] text-gray-400 cursor-pointer"
                  onClick={handleSearch}
                />
                <input
                  className="w-[180px] bg-transparent text-[13px] focus:outline-none placeholder:text-gray-400"
                  type="text"
                  placeholder="길드명 입력 (2자 이상)"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}

            {guildTeam && guildTeam.leader.id === member?.id && (
              <button
                onClick={handleRegisterScrim}
                className={`bg-gradient-to-r from-brandcolor to-blue-500 text-white rounded-[8px] hover:opacity-90 transition-opacity shadow-sm font-medium ${
                  isMobile ? "px-[12px] py-[8px] text-[12px]" : "px-[16px] py-[8px] text-[13px]"
                }`}
              >
                등록
              </button>
            )}
          </div>
        </div>

        {scrimSlots.length > 0 ? (
          <div
            className={`gap-[16px] ${
              isMobile
                ? "flex flex-col items-center"
                : "grid grid-cols-5 place-items-center"
            }`}
          >
            {scrimSlots.map((team, i) =>
              isMobile ? (
                <BattleTeamCardMobile
                  key={i}
                  scrimSlot={team}
                  onClick={() => setSelectedTeam(team)}
                />
              ) : (
                <BattleTeamCard
                  key={i}
                  scrimSlot={team}
                  onClick={() => setSelectedTeam(team)}
                />
              )
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-[16px] py-[50px] rounded-[12px] bg-gray-50 dark:bg-branddark border border-gray-100 dark:border-branddarkborder">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-[40px] h-[40px] text-gray-300 dark:text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
            <p className={`text-gray-400 ${isMobile ? "text-[13px]" : "text-[15px]"}`}>
              스크림 대기 팀이 없습니다
            </p>
            <p className={`text-gray-300 dark:text-gray-500 text-center ${isMobile ? "text-[11px]" : "text-[13px]"}`}>
              새로운 팀들이 스크림을 등록하면 여기서 확인할 수 있습니다
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
              // 다크 모드 선택된 아이템
              ".dark & .Mui-selected": {
                backgroundColor: "#4C4C4C",
                color: "#CACACA",
                "&:hover": {
                  backgroundColor: "#707070",
                },
              },
              // 다크 모드 일반 아이템
              ".dark & .MuiPaginationItem-root": {
                color: "#EEEEEE",
              },
              ".dark & .MuiPaginationItem-icon": {
                color: "#EEEEEE",
              },
              // 모바일 / PC 반응형
              "& .MuiPaginationItem-root": {
                fontSize: isMobile ? "10px" : "14px", // 폰트 크기
                minWidth: isMobile ? "24px" : "36px", // 버튼 최소 너비
                height: isMobile ? "24px" : "36px", // 버튼 높이
              },
            }}
          />
        </div>
      </div>

      {/* 모달 렌더링 */}
      {selectedTeam && (
        <BattleTeamModal
          team={selectedTeam.hostTeam}
          scheduledAt={selectedTeam.scheduledAt}
          note={selectedTeam.note}
          totalGameCount={selectedTeam.totalGameCount}
          scrimSlotId={selectedTeam.id}
          mode="apply"
          onClose={() => setSelectedTeam(null)}
          onApply={handleApply}
        />
      )}
      {isCreateTeamOpen && (
        <CreateTeamModal
          onClose={() => setIsCreateTeamOpen(false)}
          teamInvites={teamInvites}
          onInviteRemoved={handleInviteRemoved}
        />
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

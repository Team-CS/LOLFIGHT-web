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

  const handleRematchScrim = (
    scrimSlotId: string,
    applicationTeamId: string
  ) => {
    const onConfirmRematch = () => {
      if (guildTeam) {
        const scrimApplicationRematchDto: ScrimApplicationRematchDto = {
          scrimSlotId: scrimSlotId,
          applicationTeamId: applicationTeamId,
        };
        rematchScrim(scrimApplicationRematchDto)
          .then((response) => {
            setApplications((prev) =>
              prev.map((app) =>
                app.scrimSlot.id === scrimSlotId
                  ? { ...app, status: "PENDING" }
                  : app
              )
            );
            CustomAlert(
              "success",
              "재경기 요청 완료",
              "재경기 요청을 보냈습니다."
            );
          })
          .catch((error) => {
            const code = error?.response?.data?.code;
            if (code === "COMMON-003") {
              CustomAlert(
                "error",
                "재경기 요청 실패",
                "존재하지 않는 스크림입니다."
              );
            } else if (code === "COMMON-002") {
              CustomAlert(
                "error",
                "권한 없음",
                "재경기를 요청할 권한이 없습니다."
              );
            } else if (code === "COMMON-005") {
              CustomAlert(
                "error",
                "재경기 요청 실패",
                "이미 재경기 요청이 진행 중입니다."
              );
            } else {
              CustomAlert("error", "요청 실패", "잠시 후 다시 시도해주세요.");
            }
          });
      }
    };

    ButtonAlert(
      "재경기 요청",
      "재경기를 요청하시겠습니까?\n 상대팀의 응답을 기다려 주세요",
      "요청",
      "닫기",
      onConfirmRematch
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
    <div className="max-w-[1200px] mx-auto flex flex-col gap-[24px] py-[28px]">
      {guildTeam && member ? (
        // ✅ 팀이 있을 때
        <div
          className={`flex p-[32px] shadow-md rounded-[12px] gap-[24px] dark:bg-dark ${
            isMobile ? "flex-col h-[940px]" : "h-[470px]"
          }`}
        >
          <div
            className={`flex flex-col w-[50%] gap-[12px] ${
              isMobile ? "w-full" : "w-[50%]"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-[16px]">
                <img
                  src={`${constant.SERVER_URL}/${guildTeam.guild.guildIcon}`}
                  alt="logo"
                  className={`rounded-[12px] object-cover ${
                    isMobile ? "w-[50px] h-[50px]" : "w-[60px] h-[60px]"
                  }`}
                />
                <div className="flex flex-col">
                  <p
                    className={`font-semibold ${
                      isMobile ? "text-[16px]" : "text-[22px]"
                    }`}
                  >
                    {guildTeam.leader.memberName}팀
                  </p>
                  <p
                    className={`text-gray-400 ${
                      isMobile ? "text-[12px]" : "text-[14px]"
                    }`}
                  >
                    리더: {guildTeam.leader.memberName} -{" "}
                    {guildTeam.leader.memberGame?.gameName}
                  </p>
                </div>
              </div>

              {guildTeam.leader.id === member.id ? (
                myTeamSlot ? (
                  <button
                    onClick={handledeleteSlotClick}
                    className={`bg-brandcolor text-white rounded-md hover:opacity-90 ${
                      isMobile
                        ? "min-w-[100px] px-[8px] py-[4px] text-[12px]"
                        : "px-[12px] py-[4px] text-[14px]"
                    }`}
                  >
                    스크림 등록 취소
                  </button>
                ) : (
                  <div className="flex gap-[12px]">
                    <button
                      onClick={handleUpdateClick}
                      className={`bg-brandcolor text-white rounded-md hover:opacity-90 ${
                        isMobile
                          ? "min-w-[60px] px-[8px] py-[4px] text-[12px]"
                          : "px-[12px] py-[4px] text-[14px]"
                      }`}
                    >
                      팀 수정
                    </button>
                    <button
                      onClick={handledeleteClick}
                      className={`bg-brandcolor text-white rounded-md hover:opacity-90 ${
                        isMobile
                          ? "min-w-[60px] px-[8px] py-[4px] text-[12px]"
                          : "px-[12px] py-[4px] text-[14px]"
                      }`}
                    >
                      팀 삭제
                    </button>
                  </div>
                )
              ) : (
                <button
                  onClick={handleLeaveClick}
                  className={`bg-brandcolor text-white rounded-md hover:opacity-90 ${
                    isMobile
                      ? "min-w-[60px] px-[8px] py-[4px] text-[12px]"
                      : "px-[12px] py-[4px] text-[14px]"
                  }`}
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
            className={`flex flex-col gap-[12px] ${
              isMobile ? "w-full" : "w-[50%]"
            }`}
          >
            <p className="text-[18px] font-semibold ">
              📜 스크림 일정 및 최근 기록
            </p>
            <div
              className={`flex flex-col gap-[12px] overflow-y-auto ${
                isMobile ? "h-[470px]" : "h-full"
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
                    onRematch={handleRematchScrim}
                  />
                ))}
            </div>
          </div>
        </div>
      ) : member?.memberGuild ? (
        // member.memberGuild는 있지만 guildTeam이 없을 때
        <div className="flex flex-col items-center justify-center h-[470px] gap-[16px] py-[60px] rounded-[12px] dark:bg-dark shadow-md">
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
      ) : (
        // member.memberGuild도 없을 때 (완전 없는 상태)
        <div className="flex flex-col items-center justify-center h-[470px] gap-[16px] py-[60px] rounded-[12px] dark:bg-dark shadow-md">
          <p className="text-[14px] text-gray-400">
            ❌ 아직 속한 길드가 없습니다.
          </p>
        </div>
      )}

      {/* Battle Team List */}
      <div className="flex flex-col w-full p-[32px] gap-[24px] shadow-md rounded-[12px] dark:bg-dark">
        <div className="flex justify-between">
          <p
            className={`${
              isMobile ? "text-[14px]" : "text-[18px]"
            } font-semibold`}
          >
            🔥 스크림 대기 팀 목록
          </p>
          <div className="flex items-center gap-[12px]">
            {isMobile ? (
              <>
                {/* 검색 아이콘 */}
                <div
                  onClick={() => setIsSearchOpen(true)}
                  className="cursor-pointer"
                >
                  <FaSearch />
                </div>

                {/* 검색 팝업 */}
                {isSearchOpen && (
                  <div
                    className="fixed inset-0 z-50 flex items-start justify-center bg-black/30"
                    onClick={() => setIsSearchOpen(false)} // overlay 클릭 닫기
                  >
                    {/* 팝업 박스 */}
                    <div
                      className="mt-[40px] w-[90%] max-w-md rounded-xl border border-gray-300 bg-white dark:bg-black dark:border-gray-700 shadow-lg p-[12px]"
                      onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫히지 않게
                    >
                      <div className="flex items-center gap-[8px]">
                        <div className="flex flex-1 border border-gray-200 rounded-md px-[8px] gap-[4px] bg-gray-100 dark:bg-black dark:border-black">
                          <div
                            className="flex flex-wrap justify-center content-center cursor-pointer"
                            onClick={handleSearch}
                          >
                            <FaSearch />
                          </div>
                          <input
                            autoFocus
                            className="w-full rounded-md bg-gray-100 px-[8px] py-[4px] text-[12px] focus:outline-none dark:bg-black font-normal"
                            type="text"
                            placeholder="길드명 입력 (2자 이상)"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div
                className={`flex border border-gray-200 rounded-md px-[12px] gap-[12px] bg-gray-100 dark:bg-black dark:border-black`}
              >
                <div
                  className="flex flex-wrap justify-center content-center dark:bg-black"
                  onClick={handleSearch}
                >
                  <FaSearch
                    className={`${
                      isMobile ? "w-[10px] h-[10px]" : "w-[15px] h-[15px]"
                    }`}
                  />
                </div>
                <input
                  className={`"w-full rounded-md bg-gray-100 focus:outline-none dark:bg-black font-normal ${
                    isMobile
                      ? "px-[12px] py-[4px] text-[12px] w-[100px]"
                      : "px-[12px] py-[8px] text-[14px] w-[200px]"
                  }`}
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
                className="px-[12px] py-[4px] bg-brandcolor text-[14px] text-white rounded-md hover:opacity-90"
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
                : "grid grid-cols-5 place-items-center "
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
          <div className="flex flex-col items-center justify-center gap-[16px] py-[60px] rounded-[12px] dark:bg-branddark shadow-md text-gray-400">
            <p className={`${isMobile ? "text-[14px]" : "text-[18px]"}`}>
              😓 스크림 대기 팀이 없습니다.
            </p>
            <p
              className={`${
                isMobile ? "text-[12px]" : "text-[14px]"
              } text-center`}
            >
              새로운 팀들이 스크림을 등록하면 여기서 확인할 수 있습니다.
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

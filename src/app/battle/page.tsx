"use client";

import { useEffect, useState } from "react";
import TeamMemberCard from "./components/TeamMemberCard";
import BattleTeamCard from "./components/BattleTeamCard";
import { FaSearch } from "react-icons/fa";
import { Pagination } from "@mui/material";
import BattleTeamModal from "./components/modals/BattleTeamModal";
import CreateTeamModal from "./components/modals/CreateTeamModal";
import MatchCard from "./components/MatchCard";
import constant from "@/src/common/constant/constant";
import { deleteGuildTeam, getMyGuildTeam } from "@/src/api/guild_team.api";
import { GuildTeamDto } from "@/src/common/DTOs/guild/guild_team/guild_team.dto";
import ButtonAlert from "@/src/common/components/alert/ButtonAlert";
import { useRouter } from "next/navigation";
type BattleTeamCardProps = {
  guildLogo: string;
  guildName: string;
  leaderName: string;
  members: string[];
  matchTime: string;
  ladderPoint: number;
  rank: number;
  tier: string;
  onClick?: () => void;
};

const POSITIONS = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"] as const;

export default function Page() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(10); // 총 페이지 수

  const [selectedTeam, setSelectedTeam] = useState<null | BattleTeamCardProps>(
    null
  );
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState<boolean>(false);
  const [team, setTeam] = useState<GuildTeamDto>();

  useEffect(() => {
    getMyGuildTeam()
      .then((response) => {
        setTeam(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlePageClick = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };

  const handledeleteClick = () => {
    const deleteTeam = () => {
      if (team) {
        deleteGuildTeam(team?.leader.id)
          .then((response) => {
            setTeam(undefined);
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

  const dummyTeams = new Array(10).fill(0).map((_, i) => ({
    guildLogo: "/LOLFIGHT_NONE_TEXT.png",
    guildName: `팀 ${i + 1}`,
    leaderName: "이렐리아",
    members: ["멤버1", "멤버2", "멤버3", "멤버4", "멤버5"],
    matchTime: "2025년 02월 05일 15:00시",
    ladderPoint: 1000 + i * 50, // 예: 1000, 1050, 1100...
    rank: i + 1, // 예: 1위 ~ 10위
    tier: ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"][i % 5],
  }));

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-[24px] py-[28px]">
      {team ? (
        // ✅ 팀이 있을 때
        <div className="flex h-[470px] p-[32px] shadow-md rounded-[12px] gap-[24px] dark:bg-branddark">
          <div className="flex flex-col w-[50%] gap-[12px]">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-[16px]">
                <img
                  src={`${constant.SERVER_URL}/${team.guild.guildIcon}`}
                  alt="logo"
                  className="w-[60px] h-[60px] rounded-[12px] object-cover"
                />
                <div className="flex flex-col">
                  <p className="text-[22px] font-semibold">
                    {team.leader.memberName}팀
                  </p>
                  <p className="text-[14px] text-gray-400">
                    리더: {team.leader.memberName} -{" "}
                    {team.leader.memberGame?.gameName}
                  </p>
                </div>
              </div>
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
            </div>

            <div className="border-t border-gray-600/30" />

            {/* Member list */}
            <div className="flex flex-col gap-[6px]">
              {POSITIONS.map((pos) => {
                const member = team.members.find((m) => m.position === pos);
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
        </div>

        {dummyTeams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[16px] place-items-center">
            {dummyTeams.map((team, i) => (
              <BattleTeamCard
                key={i}
                {...team}
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
                backgroundColor: "#4C4C4C", // 원하는 색상으로 변경
                color: "#CACACA", // 텍스트 색상
                "&:hover": {
                  backgroundColor: "#707070", // 호버 시 색상
                },
              },
              ".dark & .MuiPaginationItem-root": {
                color: "#EEEEEE", // 선택되지 않은 아이템의 기본 텍스트 색상
              },
              ".dark & .MuiPaginationItem-icon": {
                color: "#EEEEEE", // 텍스트 색상
              },
            }}
          />
        </div>
      </div>
      {/* 모달 렌더링 */}
      {selectedTeam && (
        <BattleTeamModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
        />
      )}
      {isCreateTeamOpen && (
        <CreateTeamModal
          onClose={() => setIsCreateTeamOpen(false)}
          existingTeam={team}
        />
      )}
    </div>
  );
}

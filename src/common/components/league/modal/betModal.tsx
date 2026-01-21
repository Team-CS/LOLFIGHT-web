"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ProMatchStatus } from "@/src/common/types/enums/bet.enum";
import { ProMatchDto } from "@/src/common/DTOs/bet/bet.dto";
import { getMatch } from "@/src/api/bet.api";
import { getCookie } from "@/src/utils/cookie/cookie";

interface BetModalProps {
  riotMatchId: string;
  onClose: () => void;
  onSumbit: (id: string, teamCode: string) => void;
}

export const BetModal = (props: BetModalProps) => {
  const { riotMatchId, onClose, onSumbit } = props;
  const [matchData, setMatchData] = useState<ProMatchDto>();
  const [selectedTeam, setSelectedTeam] = useState<"teamA" | "teamB" | null>(
    null
  );
  const [loadingState, setLoadingState] = useState<
    "loading" | "error" | "not_found" | "success"
  >("loading");
  const accessToken = getCookie("lf_atk");
  const isLoggedIn = Boolean(accessToken);

  useEffect(() => {
    let isMounted = true;

    const fetchMatch = async () => {
      try {
        const res = await getMatch(riotMatchId);
        if (!isMounted) return;

        if (res.data.data) {
          setMatchData(res.data.data);
          setLoadingState("success");
        } else {
          setLoadingState("not_found");
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setLoadingState("error");
        }
      }
    };

    fetchMatch();

    return () => {
      isMounted = false;
    };
  }, [riotMatchId]);

  // 로딩 중
  if (loadingState === "loading") {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // 에러 또는 데이터 없음
  if (loadingState === "error" || loadingState === "not_found" || !matchData) {
    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl bg-white dark:bg-gray-900 shadow-2xl p-6 space-y-4 text-center"
        >
          <div className="text-4xl">😢</div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {loadingState === "error"
              ? "경기 정보를 불러올 수 없습니다"
              : "아직 등록된 경기가 없습니다"}
          </h2>
          <p className="text-sm text-gray-500">
            {loadingState === "error"
              ? "잠시 후 다시 시도해 주세요."
              : "곧 새로운 경기가 등록될 예정입니다."}
          </p>
          <button
            onClick={onClose}
            className="w-full rounded-xl py-3 font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            닫기
          </button>
        </motion.div>
      </div>
    );
  }

  // 날짜 및 시간 가공 (ISO String: "2026-01-14T08:00:00.000Z")
  const startDate = new Date(matchData.startTime);
  const formattedDate = startDate
    .toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })
    .replace(/\s/g, "");
  const dayOfWeek = startDate.toLocaleDateString("ko-KR", { weekday: "short" });
  const formattedTime = startDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const totalCount = matchData.totalVoteCount || 1; // 0나누기 방지
  const teamARatio = (matchData.teamAVoteCount / totalCount) * 100;

  const statusLabel = {
    [ProMatchStatus.UPCOMING]: "경기 예정",
    [ProMatchStatus.LIVE]: "진행 중",
    [ProMatchStatus.COMPLETED]: "종료",
    [ProMatchStatus.CANCELLED]: "경기 취소",
  };

  const statusColor = {
    [ProMatchStatus.UPCOMING]: "text-green-500",
    [ProMatchStatus.LIVE]: "text-red-500 animate-pulse",
    [ProMatchStatus.COMPLETED]: "text-gray-500",
    [ProMatchStatus.CANCELLED]: "text-red-700",
  };

  const isBetDisabled = !selectedTeam;
  //===========================================================================//

  const TeamCard = ({
    teamKey, // "teamA" 또는 "teamB"
    teamName,
    teamCode,
    teamLogo,
    isWinner,
  }: any) => {
    return (
      <motion.button
        whileHover={matchData.status === "upcoming" ? { scale: 1.03 } : {}}
        whileTap={matchData.status === "upcoming" ? { scale: 0.97 } : {}}
        onClick={() =>
          matchData.status === "upcoming" && setSelectedTeam(teamKey)
        }
        disabled={matchData.status !== "upcoming"}
        className={`relative flex-1 rounded-2xl p-4 border transition overflow-hidden ${
          selectedTeam === teamKey
            ? "border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.3)]"
            : isWinner
            ? "border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10"
            : "border-gray-200 dark:border-gray-700"
        }`}
      >
        {isWinner && <div className="absolute top-1 right-2 text-lg">👑</div>}

        <div className="relative flex flex-col items-center gap-2">
          <div className="relative w-[60px] h-[60px]">
            <Image
              src={teamLogo || "/images/default-team.png"} // 로고가 null일 경우 대비
              alt={teamName}
              fill
              className="object-contain p-[4px] rounded-[12px] bg-gray-800"
            />
          </div>
          <span className="text-xs font-bold text-center leading-tight h-8 flex items-center">
            {teamName}
          </span>
        </div>
      </motion.button>
    );
  };

  //===========================================================================//

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white dark:bg-gray-900 shadow-2xl p-6 space-y-5"
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-[2px] px-[6px] py-[2px] rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[12px] font-bold">
            {matchData.leagueName} · {matchData.blockName} · 승부 예측
          </div>
          <h2 className="text-lg font-extrabold">
            {formattedDate} ({dayOfWeek}) {formattedTime}
          </h2>
          <p className="text-xs text-gray-400">
            <span className={statusColor[matchData.status]}>
              {statusLabel[matchData.status]}
            </span>
          </p>
        </div>

        {/* 예측 현황 그래프 */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold text-gray-500 px-1">
            <span>
              {matchData.teamACode} (
              {matchData.totalVoteCount === 0 ? 50 : teamARatio.toFixed(1)}%)
            </span>
            <span>
              총 투표수 : {matchData.totalVoteCount.toLocaleString()}{" "}
            </span>
            <span>
              {matchData.teamBCode} (
              {matchData.totalVoteCount === 0
                ? 50
                : (100 - teamARatio).toFixed(1)}
              %)
            </span>
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
            <div
              style={{
                width: `${matchData.totalVoteCount === 0 ? 50 : teamARatio}%`,
              }}
              className="h-full bg-blue-500 transition-all"
            />
            <div
              style={{
                width: `${
                  matchData.totalVoteCount === 0 ? 50 : 100 - teamARatio
                }%`,
              }}
              className="h-full bg-purple-500 transition-all"
            />
          </div>
        </div>

        {/* Teams */}
        <div className="flex items-center gap-3">
          <TeamCard
            teamKey="teamA"
            teamName={matchData.teamAName}
            teamCode={matchData.teamACode}
            teamLogo={matchData.teamAImage}
            // odds={matchData.teamAOdds}
            isWinner={matchData.winnerTeamCode === matchData.teamACode}
          />
          <span className="text-xs font-black text-gray-400">VS</span>
          <TeamCard
            teamKey="teamB"
            teamName={matchData.teamBName}
            teamCode={matchData.teamBCode}
            teamLogo={matchData.teamBImage}
            // odds={matchData.teamBOdds}
            isWinner={matchData.winnerTeamCode === matchData.teamBCode}
          />
        </div>

        {/* Balance & Input */}
        {matchData.status === "upcoming" ? (
          isLoggedIn ? (
            <div className="space-y-3">
              {/* 여기에 팀 선택 및 예측 제출 버튼 컴포넌트가 들어갈 자리입니다 */}
              <p className="text-xs text-center text-blue-500 font-medium animate-pulse">
                승리 팀을 예측하고 아이템 포인트를 획득하세요!
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center border border-blue-100 dark:border-blue-800">
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                승부 예측 이벤트 참여하기
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                로그인 후 참여 시 보상 포인트 획득이 가능합니다.
              </p>
            </div>
          )
        ) : (
          <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-xl text-center">
            <p className="text-sm font-bold text-gray-400">
              {matchData.status === "live"
                ? "경기가 진행 중입니다"
                : "예측이 마감된 경기입니다"}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              {matchData.status === "live"
                ? "경기 종료 후 결과가 발표됩니다."
                : "다음 경기를 기대해 주세요!"}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-4 font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            닫기
          </button>
          {matchData.status === "upcoming" && isLoggedIn && (
            <button
              disabled={isBetDisabled}
              className={`flex-[1.5] rounded-xl py-4 font-bold text-white 
                ${
                  isBetDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30"
                }`}
              onClick={() => {
                const teamCode =
                  selectedTeam === "teamA"
                    ? matchData.teamACode
                    : matchData.teamBCode;

                onSumbit(riotMatchId, teamCode);
              }}
            >
              예측 완료
            </button>
          )}

          {matchData.status === "upcoming" && !isLoggedIn && (
            <button
              onClick={() => {
                window.location.href = "/login";
              }}
              className="flex-[1.5] rounded-xl py-4 font-bold text-white bg-gradient-to-r from-gray-700 to-gray-900"
            >
              로그인
            </button>
          )}
        </div>

        <p className="text-[10px] text-gray-400 text-center leading-relaxed opacity-80">
          본 이벤트는 팀 승부 예측 성공 시, 롤파이트 내 아이템을 구매할 수 있는
          고정 포인트를 지급합니다. <br />
          승리 팀을 맞히고 포인트 혜택을 받아보세요!
        </p>
      </motion.div>
    </div>
  );
};

export default BetModal;

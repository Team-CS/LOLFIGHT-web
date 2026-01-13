"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ProMatchStatus } from "@/src/common/types/enums/bet.enum";
import { ProMatchDto } from "@/src/common/DTOs/bet/bet.dto";
import { getMatch } from "@/src/api/bet.api";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { getCookie } from "@/src/utils/cookie/cookie";

interface BetModalProps {
  riotMatchId: string;
  onClose: () => void;
  onSumbit: (id: string, teamCode: string, betAmount: number) => void;
}

export const BetModal = (props: BetModalProps) => {
  const { riotMatchId, onClose, onSumbit } = props;
  const [matchData, setMatchData] = useState<ProMatchDto>(); // 실제Dto 타입에 맞춰 수정 가능
  const [selectedTeam, setSelectedTeam] = useState<"teamA" | "teamB" | null>(
    null
  );
  const [betAmount, setBetAmount] = useState("");
  const { member } = useMemberStore();
  const accessToken = getCookie("lf_atk");
  const isLoggedIn = Boolean(accessToken);

  useEffect(() => {
    getMatch(riotMatchId)
      .then((res) => {
        setMatchData(res.data.data);
      })
      .catch((error) => console.error(error));
  }, [riotMatchId]);

  // Hooks 선언 이후에 Early Return
  if (!matchData) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
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

  const totalAmount = matchData.totalBetAmount || 1; // 0나누기 방지
  const teamARatio = (matchData.teamABetAmount / totalAmount) * 100;

  const myCoins = member?.memberWallet.point;

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

  const isBetDisabled =
    !selectedTeam || Number(betAmount) <= 0 || Number(betAmount) > myCoins!;

  const calculateOdds = (teamBet: number, total: number) => {
    if (teamBet === 0 || total === 0) return 2.0;
    const odds = (total * 0.9) / teamBet;
    return Math.max(1.1, Math.min(100, Number(odds.toFixed(2))));
  };

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const numericValue = Number(value);
    if (numericValue < 0) return;
    if (myCoins !== undefined && numericValue > myCoins) {
      value = myCoins.toString();
    }
    setBetAmount(value);
  };

  //===========================================================================//

  const TeamCard = ({
    teamKey, // "teamA" 또는 "teamB"
    teamName,
    teamCode,
    teamLogo,
    odds, // 서버에서 온 odds (null 가능성 있음)
    isWinner,
  }: any) => {
    // 1. 서버 배당률이 null이면 직접 계산한 배당률 사용
    const displayOdds =
      odds ??
      (teamKey === "teamA"
        ? calculateOdds(matchData.teamABetAmount, matchData.totalBetAmount)
        : calculateOdds(matchData.teamBBetAmount, matchData.totalBetAmount));

    // 2. 키 접근을 안전하게 처리
    const teamBetAmount =
      teamKey === "teamA" ? matchData.teamABetAmount : matchData.teamBBetAmount;

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
          <div className="flex flex-col items-center">
            <span className="text-xl font-black text-blue-600">
              {displayOdds}x
            </span>
            <span className="text-[10px] text-gray-400">
              {teamBetAmount.toLocaleString()}
            </span>
          </div>
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
            {matchData.leagueName} · {matchData.blockName}
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

        {/* 배팅 현황 그래프 */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold text-gray-500 px-1">
            <span>
              {matchData.teamACode} (
              {matchData.totalBetAmount === 0 ? 50 : teamARatio.toFixed(1)}%)
            </span>
            <span>총 {matchData.totalBetAmount.toLocaleString()} </span>
            <span>
              {matchData.teamBCode} (
              {matchData.totalBetAmount === 0
                ? 50
                : (100 - teamARatio).toFixed(1)}
              %)
            </span>
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
            <div
              style={{
                width: `${matchData.totalBetAmount === 0 ? 50 : teamARatio}%`,
              }}
              className="h-full bg-blue-500 transition-all"
            />
            <div
              style={{
                width: `${
                  matchData.totalBetAmount === 0 ? 50 : 100 - teamARatio
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
            odds={matchData.teamAOdds}
            isWinner={matchData.winnerTeamCode === matchData.teamACode}
          />
          <span className="text-xs font-black text-gray-400">VS</span>
          <TeamCard
            teamKey="teamB"
            teamName={matchData.teamBName}
            teamCode={matchData.teamBCode}
            teamLogo={matchData.teamBImage}
            odds={matchData.teamBOdds}
            isWinner={matchData.winnerTeamCode === matchData.teamBCode}
          />
        </div>

        {/* Balance & Input */}
        {matchData.status === "upcoming" && isLoggedIn ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">내 보유 코인</span>
              <span className="flex items-center gap-1 font-bold">
                <Image
                  src="/images/point.png"
                  alt="포인트"
                  width={15}
                  height={15}
                />
                {myCoins?.toLocaleString()}
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={betAmount}
                onChange={handleBetAmountChange}
                placeholder="베팅 금액"
                className="w-full rounded-xl bg-gray-50 dark:bg-gray-800 p-4 pr-16 text-base font-bold outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() => {
                  if (!myCoins) return;
                  setBetAmount(myCoins.toString());
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600"
              >
                MAX
              </button>
            </div>
          </div>
        ) : matchData.status === "upcoming" && !isLoggedIn ? (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-center">
            <p className="text-sm font-bold text-gray-500">
              배팅하려면 로그인이 필요합니다.
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-center">
            <p className="text-sm font-bold text-gray-500">
              배팅이 마감된 경기입니다.
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

                onSumbit(riotMatchId, teamCode, Number(betAmount));
              }}
            >
              배팅 완료
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
          본 시스템은 마진 10%를 제외한 총 배팅금을 승리 팀에게 배분합니다. 최종
          배당률은 경기 종료 시점의 총 배팅 금액에 따라 결정됩니다.
        </p>
      </motion.div>
    </div>
  );
};

export default BetModal;

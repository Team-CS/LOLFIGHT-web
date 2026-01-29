"use client";
import { useEffect, useState } from "react";
import {
  deleteMemberSummonerInfo,
  removeIcon,
  updateMemberIcon,
  createMemberSummonerInfo,
  updateNickname,
  refreshMemberSummonerInfo,
  updateMemberGameLine,
} from "@/src/api/member.api";
import { checkAttendance } from "@/src/api/wallet.api";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import constant from "@/src/common/constant/constant";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { ProfileIconModal } from "./modals/ProfileIconModal";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { MemberGameDto } from "@/src/common/DTOs/member/member_game.dto";
import {
  getTierStyle,
  formatElapsedTime,
} from "@/src/utils/string/string.util";
import LineSelector from "./context-menu/LineSelector";
import { getMyItems, toggleActiveItems } from "@/src/api/member_item.api";
import { MemberItemDto } from "@/src/common/DTOs/member/member_item.dto";
import Image from "next/image";
import { BetDto, BetListResponseDto } from "@/src/common/DTOs/bet/bet.dto";
import { cancelBet, getMyBets } from "@/src/api/bet.api";
import BetHistoryItem from "./BetHistoryItem";
import ButtonAlert from "@/src/common/components/alert/ButtonAlert";
import { Pagination } from "@mui/material";
import localFont from "next/font/local";

const rixi = localFont({
  src: "../../../fonts/RixInooAriDuriRegular.ttf",
  display: "swap",
  variable: "--font-rixi",
});

export default function ProfileInfoPage() {
  const isMobile = useIsMobile();
  const { member, setMember, updateMember } = useMemberStore();
  const [myItems, setMyItems] = useState<MemberItemDto[] | null>(null);
  const [bets, setBets] = useState<BetDto[]>([]);
  const [openModal, setOpenModal] = useState<"profileIcon" | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [summonerName, setSummonerName] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [hasCheckedToday, setHasCheckedToday] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const [searchTerm, setSearchTerm] = useState<string>(""); // 검색어
  const betsPerPage = 6;
  const FIVE_MINUTES = 5 * 60 * 1000;
  const updatedAt = member?.memberGame?.updatedAt;

  const typeToImageMap: Record<string, string> = {
    google: "Google_Original",
    kakao: "Kakao_Original",
    naver: "Naver_Original",
  };
  const imageName = typeToImageMap[member?.type || ""] || "default.png";

  useEffect(() => {
    if (member) {
      setNickname(member.memberName);
      setSummonerName(member.memberGame?.gameName || "");

      getMyItems().then((response) => {
        setMyItems(response.data.data);
      });
    }
  }, [member]);

  useEffect(() => {
    fetchBets(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (!updatedAt) return;
    const diff = Date.now() - new Date(updatedAt).getTime();
    setIsDisabled(diff < FIVE_MINUTES);
  }, [updatedAt]);

  useEffect(() => {
    if (!member?.memberWallet?.lastAttendance) return;
    const last = new Date(member.memberWallet.lastAttendance);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    last.setHours(0, 0, 0, 0);
    setHasCheckedToday(last.getTime() === today.getTime());
  }, [member?.memberWallet?.lastAttendance]);

  // --- 배팅 관련 ---
  const fetchBets = async (page: number) => {
    try {
      const response = await getMyBets(page, betsPerPage, searchTerm);
      const data = response.data.data as BetListResponseDto;
      if (Array.isArray(data.betList)) {
        setBets(data.betList);
      } else {
        setBets([]);
      }

      if (data.pagination) {
        const { totalPage } = data.pagination;
        const pages = Math.ceil(totalPage! / betsPerPage);
        setTotalPages(Math.max(1, pages));
      }
    } catch (error) {
      console.error("목록 조회 실패 :", error);
      setBets([]);
      setTotalPages(1);
    }
  };

  const handleCancelBet = (betId: string) => {
    const deleteBet = () => {
      cancelBet(betId)
        .then((response) => {
          const targetBet = bets.find((bet) => bet.id === betId);
          if (member && targetBet) {
            setBets((prevBets) => prevBets.filter((bet) => bet.id !== betId));
          }
        })
        .catch((error) => {
          const code = error.response.data.code;
          if (code === "COMMON-002") {
            CustomAlert(
              "warning",
              "예측취소",
              "이미 경기가 진행중 이거나, 종료된 경기입니다.",
            );
          }
        });
    };
    ButtonAlert(
      "예측취소",
      "취소하시겠습니까? \n 진행중인 경기는 취소가 불가능합니다.",
      "예측취소",
      "아니오",
      deleteBet,
    );
  };

  const handlePageClick = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number,
  ) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBets(1);
  };

  // --- 프로필 아이콘 관련 ---
  const handleIconSubmit = () => {
    if (!selectedImage)
      return CustomAlert(
        "warning",
        "프로필 사진 변경",
        "이미지를 등록해주세요",
      );
    updateMemberIcon(selectedImage)
      .then((res) => {
        setMember(res.data.data);
        CustomAlert("success", "프로필 사진 변경", "완료되었습니다");
        setOpenModal(null);
        setSelectedImage(null);
      })
      .catch(() => CustomAlert("error", "프로필 사진 변경", "실패했습니다"));
  };

  const handleRemoveIcon = () => {
    removeIcon()
      .then((res) => {
        setMember(res.data.data);
        CustomAlert("success", "프로필 사진 삭제", "삭제되었습니다");
      })
      .catch(() =>
        CustomAlert("error", "삭제 실패", "잠시 후 다시 시도해주세요"),
      );
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

  // --- 닉네임 변경 ---
  const handleNicknameSubmit = () => {
    if (nickname.length < 2 || nickname.length > 7)
      return CustomAlert("warning", "닉네임 변경", "2~7자로 입력해주세요");
    updateNickname(nickname)
      .then((res) => {
        setMember(res.data.data);
        CustomAlert("success", "닉네임 변경", "완료되었습니다");
      })
      .catch((error) => {
        const code = error.response.data.code;
        if (code === "USER-001") {
          CustomAlert("error", "닉네임 변경", "존재하지 않는 멤버 입니다");
        } else if (code === "COMMON-005") {
          CustomAlert("error", "닉네임 변경", "이미 존재하는 닉네임 입니다");
        } else if (code === "COMMON-018") {
          CustomAlert(
            "error",
            "닉네임 변경",
            "부적절한 단어가 포함되어 있습니다.",
          );
        }
        setNickname(member!.memberName);
      });
  };

  // --- Riot 계정 ---
  const handleCreateOrEditSummoner = () => {
    if (!summonerName)
      return CustomAlert("warning", "Riot 계정", "소환사명을 입력해주세요");

    const dto: MemberGameDto = { gameName: summonerName };
    createMemberSummonerInfo(dto)
      .then((res) => {
        setMember(res.data.data);
        CustomAlert("success", "Riot 계정 등록", "성공적으로 등록되었습니다");
      })
      .catch((error) => {
        const code = error.response.data.code;

        if (code === "RIOT-001") {
          CustomAlert(
            "error",
            "Riot 계정 정보",
            "존재하지 않는 소환사명 입니다.",
          );
        } else if (code === "COMMON-005") {
          CustomAlert(
            "error",
            "Riot 계정 정보",
            "이미 등록되어있는 소환사명 입니다.",
          );
        }
      });
  };

  const handleDeleteSummoner = () => {
    deleteMemberSummonerInfo()
      .then((res) => {
        setMember(res.data.data);
        CustomAlert("success", "Riot 계정 삭제", "등록이 해제되었습니다");
      })
      .catch(() => CustomAlert("error", "Riot 계정 삭제", "실패했습니다"));
  };

  const handleRefreshSummoner = () => {
    if (!member) return;

    refreshMemberSummonerInfo(member.memberGame?.gameName!)
      .then((res) => {
        const updatedMember = {
          ...member,
          memberGame: res.data.data.memberGame,
        };
        setMember(updatedMember);
      })
      .catch(() =>
        CustomAlert("error", "소환사 정보", "새로고침에 실패했습니다."),
      );
  };

  const handleChangeLine = (line: string) => {
    if (!member) return;
    updateMemberGameLine(member.id, line)
      .then((res) => setMember(res.data.data))
      .catch(console.error);
  };

  // --- 출석체크 ---
  const handleAttendanceCheck = () => {
    checkAttendance()
      .then((res) => setMember({ ...member!, memberWallet: res.data.data }))
      .catch(() =>
        CustomAlert("warning", "출석체크", "오늘 이미 완료했습니다."),
      );
  };

  // --- 아이템 ---
  const handleActivateItem = async (clickedItem: MemberItemDto) => {
    if (!myItems) return;

    const updatedItems = myItems.map((item) => {
      if (item.shop.category === clickedItem.shop.category) {
        if (item.id === clickedItem.id) {
          return { ...item, isActive: !item.isActive };
        }
        return { ...item, isActive: false };
      }
      return item;
    });

    setMyItems(updatedItems);

    const isNowActive = !clickedItem.isActive;

    await toggleActiveItems(clickedItem.shop.id)
      .then((response) => {
        setMember({
          ...member!,
          memberItem: response.data.data,
        });
        CustomAlert(
          "success",
          "아이템 상태 변경",
          `${clickedItem.shop.name}이(가) ${
            isNowActive ? "활성화" : "비활성화"
          }되었습니다!`,
        );
      })
      .catch((error) => {
        CustomAlert(
          "error",
          "아이템 상태 변경 실패",
          "잠시 후 다시 시도해주세요.",
        );
        setMyItems(myItems);
      });
  };

  if (!member) return <div>Loading...</div>;

  return (
    <>
      <div className="w-full flex flex-col gap-[20px] p-[20px]">
        {/* 프로필 상단 카드 */}
        <div className="relative w-full rounded-[16px] overflow-hidden bg-white dark:bg-branddark border dark:border-branddarkborder shadow-lg">
          {/* 배너 */}
          <div className="w-full h-[180px] relative">
            <Image
              src={`${
                member.memberItem?.banner
                  ? `${constant.SERVER_URL}/${member.memberItem.banner}`
                  : `${constant.SERVER_URL}/public/default-banner.png`
              }`}
              alt="banner"
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* 프로필 정보 */}
          <div className="relative p-[20px]">
            <div className="flex flex-col sm:flex-row gap-[20px]">
              {/* 프로필 이미지 영역 */}
              <div className="flex flex-col items-center gap-[12px] sm:items-start">
                <div className={`${member.memberItem?.border} relative`}>
                  <Image
                    src={`${constant.SERVER_URL}/${member.memberIcon}`}
                    alt="profile"
                    width={120}
                    height={120}
                    className="w-[120px] h-[120px] rounded-[12px] object-cover border-[4px] border-white dark:border-branddark shadow-lg"
                    priority
                  />
                </div>
                <div className="flex w-full justify-center gap-[8px]">
                  <button
                    onClick={() => setOpenModal("profileIcon")}
                    className="bg-brandcolor hover:bg-brandhover text-white rounded-[8px] px-[12px] py-[6px] text-[12px] font-medium transition-colors"
                  >
                    변경
                  </button>
                  {member.memberIcon !== "public/default.png" && (
                    <button
                      onClick={handleRemoveIcon}
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-[8px] px-[12px] py-[6px] text-[12px] font-medium transition-colors"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>

              {/* 유저 정보 영역 */}
              <div className="flex flex-col flex-1 gap-[12px]">
                <div
                  className={`flex items-center gap-[10px] ${isMobile ? "flex-col" : ""}`}
                >
                  <p className="text-[24px] font-bold text-gray-900 dark:text-white">
                    <span className={`${member.memberItem?.effect}`}>
                      {member.memberName}
                    </span>
                  </p>
                  <button
                    onClick={() => setIsEditingNickname(!isEditingNickname)}
                    className="text-brandcolor hover:text-brandhover text-[13px] font-medium transition-colors"
                  >
                    닉네임 변경
                  </button>
                </div>

                {isEditingNickname && (
                  <div className="flex gap-[8px]">
                    <input
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="flex-1 max-w-[200px] px-[12px] py-[8px] text-[14px] border rounded-[8px] dark:bg-brandgray dark:border-branddarkborder focus:outline-none focus:ring-[2px] focus:ring-brandcolor/30"
                    />
                    <button
                      onClick={() => {
                        handleNicknameSubmit();
                        setIsEditingNickname(false);
                      }}
                      className="bg-brandcolor hover:bg-brandhover text-white rounded-[8px] px-[16px] py-[8px] text-[13px] font-medium transition-colors"
                    >
                      저장
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-[6px] text-[14px] text-gray-500 dark:text-gray-400">
                  <Image
                    src={`${constant.SERVER_URL}/public/${imageName}.png`}
                    alt={member?.type}
                    width={18}
                    height={18}
                  />
                  <span>{member!.memberId}</span>
                </div>

                <p className="text-[13px] text-gray-400 dark:text-gray-500">
                  가입일: {member.createdAt?.toString().split("T")[0]}
                </p>

                <div className="flex items-center gap-[12px]">
                  <div className="flex items-center gap-[6px] bg-gray-100 dark:bg-gray-800 px-[12px] py-[6px] rounded-[8px]">
                    <span className="text-[14px] font-semibold text-gray-700 dark:text-gray-200">
                      {member.memberWallet.point}P
                    </span>
                    <Image
                      src="/images/point.png"
                      alt="point"
                      width={16}
                      height={16}
                      className="w-[16px] h-[16px]"
                    />
                  </div>
                  <button
                    disabled={hasCheckedToday}
                    onClick={handleAttendanceCheck}
                    className={`rounded-[8px] px-[14px] py-[6px] text-[13px] font-medium transition-colors ${
                      hasCheckedToday
                        ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400"
                        : "bg-brandcolor text-white hover:bg-brandhover"
                    }`}
                  >
                    {hasCheckedToday ? "출석완료" : "출석체크"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Riot 계정 */}
        <div className="w-full rounded-[16px] bg-white dark:bg-branddark border dark:border-branddarkborder shadow-lg overflow-hidden">
          <div className="flex items-center gap-[8px] px-[20px] py-[14px] bg-gray-50 dark:bg-gray-800/50 border-b dark:border-branddarkborder">
            <span className="text-[15px] font-bold text-gray-800 dark:text-white">
              Riot 계정
            </span>
          </div>

          <div className="p-[20px]">
            {member.memberGame ? (
              <div className="flex flex-col gap-[16px]">
                <div className="flex items-center gap-[16px]">
                  <Image
                    src={`${constant.SERVER_URL}/public/rank/${
                      member.memberGame.gameTier!.split(" ")[0]
                    }.png`}
                    alt="tier"
                    width={80}
                    height={80}
                    className="w-[80px] h-[80px] object-contain"
                  />
                  <div className="flex flex-col gap-[6px]">
                    <p
                      className={`${getTierStyle(
                        member.memberGame.gameTier!.split(" ")[0],
                      )} font-bold text-[18px]`}
                    >
                      {member.memberGame.gameTier}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-[14px] font-medium">
                      {member.memberGame.gameName}
                    </p>
                    <LineSelector
                      currentLine={member.memberGame.line}
                      onChangeLine={handleChangeLine}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-[12px] border-t dark:border-branddarkborder">
                  <p className="text-[12px] text-gray-400">
                    {member.memberGame.updatedAt
                      ? formatElapsedTime(member.memberGame.updatedAt)
                      : "-"}
                  </p>
                  <div className="flex gap-[8px]">
                    <button
                      disabled={isDisabled}
                      onClick={handleRefreshSummoner}
                      className={`rounded-[8px] px-[14px] py-[8px] text-[13px] font-medium transition-colors ${
                        isDisabled
                          ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-400"
                          : "bg-brandcolor hover:bg-brandhover text-white"
                      }`}
                    >
                      새로고침
                    </button>
                    <button
                      onClick={handleDeleteSummoner}
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-[8px] px-[14px] py-[8px] text-[13px] font-medium transition-colors"
                    >
                      등록 해제
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-[12px]">
                <p className="text-[14px] text-gray-500 dark:text-gray-400">
                  Riot 계정을 등록하고 티어와 라인 정보를 표시하세요.
                </p>
                <div className="flex gap-[10px]">
                  <input
                    value={summonerName}
                    onChange={(e) => setSummonerName(e.target.value)}
                    placeholder="LOLFIGHT#롤파이트"
                    className="flex-1 max-w-[280px] border rounded-[8px] px-[14px] py-[10px] text-[14px] dark:bg-brandgray dark:border-branddarkborder focus:outline-none focus:ring-[2px] focus:ring-brandcolor/30"
                  />
                  <button
                    onClick={handleCreateOrEditSummoner}
                    className="bg-brandcolor hover:bg-brandhover text-white rounded-[8px] px-[20px] py-[10px] text-[14px] font-medium transition-colors"
                  >
                    등록하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 배지 구역 */}
        <div className="w-full rounded-[16px] bg-white dark:bg-branddark border dark:border-branddarkborder shadow-lg overflow-hidden">
          <div className="flex items-center gap-[8px] px-[20px] py-[14px] bg-gray-50 dark:bg-gray-800/50 border-b dark:border-branddarkborder">
            <span className="text-[15px] font-bold text-gray-800 dark:text-white">
              획득한 배지
            </span>
            {member.memberBadge && member.memberBadge.length > 0 && (
              <span className="text-[13px] text-gray-400 dark:text-gray-500">
                {member.memberBadge.length}개
              </span>
            )}
          </div>

          <div className="p-[20px]">
            {member.memberBadge && member.memberBadge.length > 0 ? (
              <div className="flex flex-wrap gap-[10px]">
                {member.memberBadge.map((badge) => (
                  <div
                    key={badge.id}
                    className="relative group flex items-center"
                  >
                    <div
                      className="flex items-center text-white px-[10px] py-[4px] rounded-[6px] text-[13px] font-semibold cursor-default whitespace-nowrap shadow-sm"
                      style={{ background: badge.badge.color }}
                    >
                      {badge.badge.name}
                    </div>

                    <div
                      className="absolute left-1/2 -translate-x-1/2 bottom-full hidden group-hover:flex flex-col items-center z-50 pointer-events-none"
                      style={{ marginBottom: "8px" }}
                    >
                      <div className="bg-gray-900/95 backdrop-blur-sm text-white text-[12px] rounded-[8px] py-[6px] px-[12px] whitespace-nowrap shadow-xl">
                        {badge.badge.description}
                      </div>
                      <div className="w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-gray-900/95"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-[20px] text-gray-400 dark:text-gray-500">
                <p className="text-[14px]">아직 획득한 배지가 없습니다.</p>
                <p className="text-[12px]">활동을 통해 배지를 획득해보세요!</p>
              </div>
            )}
          </div>
        </div>

        {/* 보유 아이템 */}
        <div className="w-full rounded-[16px] bg-white dark:bg-branddark border dark:border-branddarkborder shadow-lg overflow-hidden">
          <div className="flex items-center gap-[8px] px-[20px] py-[14px] bg-gray-50 dark:bg-gray-800/50 border-b dark:border-branddarkborder">
            <span className="text-[15px] font-bold text-gray-800 dark:text-white">
              보유 아이템
            </span>
            {myItems && myItems.length > 0 && (
              <span className="text-[13px] text-gray-400 dark:text-gray-500">
                {myItems.length}개
              </span>
            )}
          </div>

          <div className="p-[20px]">
            {!myItems || myItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-[20px] text-gray-400 dark:text-gray-500">
                <p className="text-[14px]">아직 구매한 아이템이 없습니다.</p>
                <p className="text-[12px]">상점에서 아이템을 구매해보세요!</p>
              </div>
            ) : (
              <div
                className={`grid ${
                  isMobile ? "grid-cols-2" : "grid-cols-4 lg:grid-cols-6"
                } gap-[16px]`}
              >
                {myItems?.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col items-center justify-between p-[16px] gap-[4px] rounded-[12px] bg-gray-50 dark:bg-gray-800/50 border-[2px] cursor-pointer transition-all duration-200 hover:shadow-md ${
                      item.isActive
                        ? "border-brandcolor shadow-sm"
                        : "border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                    }`}
                    onClick={() => handleActivateItem(item)}
                  >
                    <div className="flex items-center justify-center w-full h-[70px]">
                      {item.shop.category === "BORDER" && (
                        <div
                          className={`relative w-[60px] h-[60px] rounded-[12px] ${item.shop.cssClass}`}
                        >
                          <Image
                            src={`${constant.SERVER_URL}/${member.memberIcon}`}
                            alt={item.shop.name}
                            width={50}
                            height={50}
                            className="object-cover w-full h-full rounded-[12px]"
                          />
                        </div>
                      )}

                      {item.shop.category === "EFFECT" && (
                        <div className="flex items-center justify-center">
                          <span
                            className={`${item.shop.cssClass} text-[13px] font-bold`}
                          >
                            {member.memberName}
                          </span>
                        </div>
                      )}

                      {item.shop.category === "BANNER" && (
                        <img
                          src={`${constant.SERVER_URL}/${item.shop.imageUrl}`}
                          alt={item.shop.name}
                          className="w-[60px] h-[60px] rounded-[8px] object-contain"
                          onError={(e) => {
                            e.currentTarget.src = `${constant.SERVER_URL}/public/default-banner.png`;
                          }}
                        />
                      )}
                    </div>

                    <p className="text-[13px] font-medium text-center truncate w-full text-gray-700 dark:text-gray-200">
                      {item.shop.name}
                    </p>

                    <div className="flex items-center justify-center">
                      {item.isActive ? (
                        <span className="text-[12px] text-brandcolor font-semibold bg-brandcolor/10 px-[10px] py-[2px] rounded-[4px]">
                          사용 중
                        </span>
                      ) : (
                        <span className="text-[12px] text-gray-400">
                          클릭하여 적용
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 예측 내역 */}
        <div className="w-full rounded-[16px] bg-white dark:bg-branddark border dark:border-branddarkborder shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-[20px] py-[14px] bg-gray-50 dark:bg-gray-800/50 border-b dark:border-branddarkborder">
            <span className="text-[15px] font-bold text-gray-800 dark:text-white">
              예측 내역
            </span>
          </div>

          <div className="flex flex-col p-[20px] gap-[16px]">
            {/* 검색 영역 */}
            <div
              className={`flex w-full gap-[10px] ${isMobile ? "flex-col" : "flex-row"}`}
            >
              <div className="flex flex-1 gap-[10px]">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="팀 코드 검색 (예: KT)"
                  className={`w-full border rounded-[8px] dark:bg-brandgray dark:border-branddarkborder focus:outline-none focus:ring-[2px] focus:ring-brandcolor/30 ${
                    isMobile
                      ? "px-[8px] py-[10px] text-[13px]"
                      : "px-[12px] py-[10px] text-[14px] max-w-[300px]"
                  }`}
                />
                <button
                  onClick={handleSearch}
                  className={`bg-brandcolor hover:bg-brandhover text-white rounded-[8px] font-medium transition-colors shrink-0 ${
                    isMobile
                      ? "px-[16px] py-[10px] text-[13px]"
                      : "px-[20px] py-[10px] text-[14px]"
                  }`}
                >
                  검색
                </button>
              </div>
            </div>

            {bets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-[30px] text-gray-400 dark:text-gray-500">
                <p className="text-[14px]">예측 내역이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                {bets.map((bet) => (
                  <BetHistoryItem
                    key={bet.id}
                    bet={bet}
                    onCancel={handleCancelBet}
                  />
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            <div className="flex justify-center pt-[12px]">
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
                  "& .MuiPaginationItem-root": {
                    fontSize: isMobile ? "10px" : "14px",
                    minWidth: isMobile ? "24px" : "36px",
                    height: isMobile ? "24px" : "36px",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {openModal === "profileIcon" && (
        <ProfileIconModal
          selectedImage={selectedImage}
          previewImage={previewImage}
          onClose={() => {
            setOpenModal(null);
            setSelectedImage(null);
          }}
          onImageChange={handleImageChange}
          onSubmit={handleIconSubmit}
        />
      )}
    </>
  );
}

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
              "이미 경기가 진행중 이거나, 종료된 경기입니다."
            );
          }
        });
    };
    ButtonAlert(
      "예측취소",
      "취소하시겠습니까? \n 진행중인 경기는 취소가 불가능합니다.",
      "예측취소",
      "아니오",
      deleteBet
    );
  };

  const handlePageClick = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
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
        "이미지를 등록해주세요"
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
        CustomAlert("error", "삭제 실패", "잠시 후 다시 시도해주세요")
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
            "부적절한 단어가 포함되어 있습니다."
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
            "존재하지 않는 소환사명 입니다."
          );
        } else if (code === "COMMON-005") {
          CustomAlert(
            "error",
            "Riot 계정 정보",
            "이미 등록되어있는 소환사명 입니다."
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
        CustomAlert("error", "소환사 정보", "새로고침에 실패했습니다.")
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
        CustomAlert("warning", "출석체크", "오늘 이미 완료했습니다.")
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
          }되었습니다!`
        );
      })
      .catch((error) => {
        CustomAlert(
          "error",
          "아이템 상태 변경 실패",
          "잠시 후 다시 시도해주세요."
        );
        setMyItems(myItems);
      });
  };

  if (!member) return <div>Loading...</div>;

  return (
    <>
      <div className="w-full flex flex-col items-center gap-[16px] p-[16px] border rounded-[12px] shadow-md bg-white dark:bg-dark dark:border-branddarkborder relative overflow-hidden">
        {/* 배너 */}
        <div className="w-full h-[240px] relative">
          <Image
            src={`${
              member.memberItem?.banner
                ? `${constant.SERVER_URL}/${member.memberItem.banner}`
                : `${constant.SERVER_URL}/public/default-banner.png`
            }`}
            alt="banner"
            width={1000}
            height={1000}
            className="w-full h-full object-cover rounded-[12px] opacity-80"
          />
        </div>

        {/* 프로필 카드 */}
        <div className="flex flex-col sm:flex-row w-full items-center  justify-between gap-[16px] p-[16px] rounded-[12px] mt-[-60px] relative z-10 bg-white/90 dark:bg-dark shadow-md backdrop-blur-sm border dark:border-branddarkborder">
          <div className="flex flex-col gap-[12px]">
            <div className={member.memberItem?.border}>
              <Image
                src={`${constant.SERVER_URL}/${member.memberIcon}`}
                alt="profile"
                width={130}
                height={130}
                className="w-[130px] h-[130px] rounded-[12px] object-cover"
              />
            </div>
            <div className="flex justify-center gap-[8px]">
              <button
                onClick={() => setOpenModal("profileIcon")}
                className="bg-brandcolor hover:bg-brandhover text-white rounded-[8px] px-[10px] py-[6px] text-[12px]"
              >
                아이콘 변경
              </button>
              {member.memberIcon !== "public/default.png" && (
                <button
                  onClick={handleRemoveIcon}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-[8px] px-[10px] py-[6px] text-[12px]"
                >
                  삭제
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-[8px]">
            <div
              className={`flex items-center gap-[6px] ${
                isMobile && "flex-col"
              }`}
            >
              <p
                className={`text-[22px] font-bold text-gray-900 dark:text-gray-100 `}
              >
                <span className={`${member.memberItem?.effect}`}>
                  {member.memberName}
                </span>
              </p>
              <button
                onClick={() => setIsEditingNickname(!isEditingNickname)}
                className="bg-brandcolor hover:bg-brandhover text-white rounded-[8px] px-[10px] py-[6px] text-[12px]"
              >
                닉네임 변경
              </button>
            </div>
            {isEditingNickname && (
              <div className="flex gap-[8px]">
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className={`${
                    isMobile
                      ? "min-w-[50px] p-[4px] text-[12px]"
                      : "px-[8px] py-[6px] text-[14px]"
                  } border rounded-[8px] dark:bg-brandgray dark:border-branddarkborder`}
                />
                <button
                  onClick={() => {
                    handleNicknameSubmit();
                    setIsEditingNickname(false);
                  }}
                  className="bg-brandcolor hover:bg-brandhover text-white rounded-[8px] px-[10px] py-[6px] text-[12px]"
                >
                  저장
                </button>
              </div>
            )}

            <div
              className={`flex items-center gap-[4px] text-[14px] text-gray-500`}
            >
              <Image
                src={`${constant.SERVER_URL}/public/${imageName}.png`}
                alt={member?.type}
                width={15}
                height={15}
              />
              {member!.memberId}
            </div>

            <p className="text-[12px] text-gray-500">
              가입일: {member.createdAt?.toString().split("T")[0]}
            </p>

            <div className="flex gap-[8px]">
              <div className="text-[13px] text-gray-700 dark:text-gray-300 flex items-center gap-[4px]">
                {member.memberWallet.point}P
                <Image
                  src="/images/point.png"
                  alt="point"
                  width={14}
                  height={14}
                  className="w-[14px] h-[14px]"
                />
              </div>
              <button
                disabled={hasCheckedToday}
                onClick={handleAttendanceCheck}
                className={`rounded-[8px] px-[10px] py-[6px] text-[12px] ${
                  hasCheckedToday
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-brandcolor text-white hover:bg-brandhover"
                }`}
              >
                출석체크
              </button>
            </div>
          </div>
        </div>

        {/* Riot 계정 */}
        <div className="w-full flex flex-col gap-[10px] p-[16px] rounded-[12px] bg-gray-50 dark:bg-branddark border dark:border-branddarkborder shadow-sm">
          <p className="text-[14px] font-semibold text-gray-700 dark:text-gray-200">
            Riot 계정
          </p>

          {member.memberGame ? (
            <>
              <div className="flex items-center gap-[12px]">
                <Image
                  src={`${constant.SERVER_URL}/public/rank/${
                    member.memberGame.gameTier!.split(" ")[0]
                  }.png`}
                  alt="tier"
                  width={70}
                  height={70}
                  className="w-[70px] h-[70px] object-contain"
                />
                <div className="flex flex-col gap-[4px]">
                  <p
                    className={`${getTierStyle(
                      member.memberGame.gameTier!.split(" ")[0]
                    )} font-semibold`}
                  >
                    {member.memberGame.gameTier}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-[13px]">
                    {member.memberGame.gameName}
                  </p>
                  <LineSelector
                    currentLine={member.memberGame.line}
                    onChangeLine={handleChangeLine}
                  />
                </div>
              </div>

              <div className="flex gap-[8px] mt-[6px]">
                <button
                  disabled={isDisabled}
                  onClick={handleRefreshSummoner}
                  className={`text-white rounded-[8px] px-[10px] py-[6px] text-[12px] ${
                    isDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-brandcolor hover:bg-brandhover"
                  }`}
                >
                  새로고침
                </button>
                <button
                  onClick={handleDeleteSummoner}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-[8px] px-[10px] py-[6px] text-[12px]"
                >
                  등록 해제
                </button>
              </div>

              <p className="text-[11px] text-gray-500">
                {member.memberGame.updatedAt
                  ? formatElapsedTime(member.memberGame.updatedAt)
                  : "-"}
              </p>
            </>
          ) : (
            <div className="flex items-center gap-[8px]">
              <input
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                placeholder="LOLFIGHT#롤파이트"
                className=" border rounded-[8px] px-[8px] py-[6px] text-[13px] dark:bg-brandgray dark:border-branddarkborder"
              />
              <button
                onClick={handleCreateOrEditSummoner}
                className={`bg-brandcolor hover:bg-brandhover text-white rounded-[8px]  px-[10px] py-[6px] text-[12px]`}
              >
                등록하기
              </button>
            </div>
          )}
        </div>

        {/* 배지 구역 */}
        <div className="w-full flex flex-col items-center justify-center p-[16px] border border-dashed border-gray-300 dark:border-branddarkborder rounded-[12px] text-gray-500 dark:text-gray-400 bg-transparent">
          <p className="text-center text-[14px]">
            🏅 아직 획득한 배지가 없습니다.
          </p>
        </div>

        <div className="w-full flex flex-col gap-[16px] p-[16px] border rounded-[12px] shadow-md bg-white dark:bg-dark dark:border-branddarkborder overflow-hidden">
          <p className="text-[14px] font-semibold text-gray-700 dark:text-gray-200">
            보유중인 아이템
          </p>

          {(!myItems || myItems.length === 0) && (
            <p className="text-gray-500 text-sm">
              아직 구매한 아이템이 없습니다.
            </p>
          )}

          <div
            className={`grid items-center justify-center ${
              isMobile ? "grid-cols-2" : "grid-cols-6"
            } gap-[12px]`}
          >
            {myItems?.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col w-full items-center justify-between p-[10px] aspect-square border rounded-[10px] bg-gray-50 dark:bg-branddark dark:border-branddarkborder transition-transform duration-200 hover:scale-[1.03] ${
                  item.isActive ? "border-2 border-brandcolor" : ""
                } ${isMobile ? "h-[150px]" : "h-[180px]"}`}
                onClick={() => handleActivateItem(item)}
              >
                <div className="flex items-center justify-center w-full h-[70%]">
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
                    <div className="flex items-center justify-center w-[60px] h-[60px]">
                      <span
                        className={`${item.shop.cssClass} text-xs font-bold`}
                      >
                        {member.memberName}
                      </span>
                    </div>
                  )}

                  {item.shop.category === "BANNER" && (
                    <Image
                      src={`${constant.SERVER_URL}/${item.shop.imageUrl}`}
                      alt={item.shop.name}
                      width={60}
                      height={60}
                      className="w-[60px] h-[60px] rounded-md object-cover"
                    />
                  )}
                </div>

                <p className="text-[12px] font-semibold text-center truncate w-full h-[18px] leading-[18px]">
                  {item.shop.name}
                </p>

                <div className="h-[20px] flex items-end justify-center">
                  {item.isActive ? (
                    <span className="text-[12px] text-brandcolor font-medium">
                      활성화됨
                    </span>
                  ) : (
                    <span className="text-[12px] text-gray-400">비활성</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col gap-[16px] p-[16px] border rounded-[12px] shadow-md bg-white dark:bg-dark dark:border-branddarkborder overflow-hidden">
          <p className="text-[14px] font-semibold text-gray-700 dark:text-gray-200">
            예측 내역
          </p>
          <div className="flex items-center gap-[8px]">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="팀 코드 검색 (예: KT)"
              className="flex-1 px-[10px] py-[6px] text-[13px] border rounded-[8px] dark:bg-brandgray dark:border-branddarkborder"
            />
            <button
              onClick={handleSearch}
              className="bg-brandcolor hover:bg-brandhover text-white rounded-[8px] px-[12px] py-[6px] text-[12px]"
            >
              검색
            </button>
          </div>

          {bets.length === 0 && (
            <p className="text-sm text-gray-500">내역이 없습니다.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px]">
            {bets.map((bet) => (
              <BetHistoryItem
                key={bet.id}
                bet={bet}
                onCancel={handleCancelBet}
              />
            ))}
          </div>
        </div>
        <div className="w-full flex justify-center mt-1 p-3">
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

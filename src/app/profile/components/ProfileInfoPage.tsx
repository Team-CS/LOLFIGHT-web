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

export default function ProfileInfoPage() {
  const isMobile = useIsMobile();
  const { member, setMember } = useMemberStore();
  const [openModal, setOpenModal] = useState<"profileIcon" | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [summonerName, setSummonerName] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [hasCheckedToday, setHasCheckedToday] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);

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
    }
  }, [member]);

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
    if (!isEdit) return setIsEdit(true);
    if (!summonerName)
      return CustomAlert("warning", "Riot 계정", "소환사명을 입력해주세요");

    const dto: MemberGameDto = { gameName: summonerName };
    createMemberSummonerInfo(dto)
      .then((res) => {
        setMember(res.data.data);
        setIsEdit(false);
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
    refreshMemberSummonerInfo(member.id)
      .then((res) => setMember(res.data.data))
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

  if (!member) return <div>Loading...</div>;

  return (
    <>
      <div className="w-full flex flex-col items-center gap-[16px] p-[16px] border rounded-[12px] shadow-md bg-white dark:bg-dark dark:border-branddarkborder relative overflow-hidden">
        {/* 배너 */}
        <div className="w-full h-[240px] relative">
          <img
            src={`${constant.SERVER_URL}/public/default-banner.png`}
            alt="banner"
            className="w-full h-full object-cover rounded-[12px] opacity-80"
          />
        </div>

        {/* 프로필 카드 */}
        <div className="flex flex-col sm:flex-row w-full items-center  justify-between gap-[16px] p-[16px] rounded-[12px] mt-[-60px] relative z-10 bg-white/90 dark:bg-dark shadow-md backdrop-blur-sm border dark:border-branddarkborder">
          <div className="flex flex-col gap-[12px]">
            <img
              src={`${constant.SERVER_URL}/${member.memberIcon}`}
              alt="profile"
              className="w-[130px] h-[130px] rounded-[12px] object-cover"
            />
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
              <p className="text-[22px] font-bold text-gray-900 dark:text-gray-100">
                {member.memberName}
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
              <img
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
                <img
                  src="/images/point.png"
                  alt="point"
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
                <img
                  src={`${constant.SERVER_URL}/public/rank/${
                    member.memberGame.gameTier!.split(" ")[0]
                  }.png`}
                  alt="tier"
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
      </div>

      {openModal === "profileIcon" && (
        <ProfileIconModal
          selectedImage={selectedImage}
          previewImage={previewImage}
          onClose={() => setOpenModal(null)}
          onImageChange={handleImageChange}
          onSubmit={handleIconSubmit}
        />
      )}
    </>
  );
}

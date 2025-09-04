import { useEffect, useState } from "react";
import {
  removeIcon,
  updateMemberIcon,
  updateMemberSummonerInfo,
  updateNickname,
} from "@/src/api/member.api";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import constant from "@/src/common/constant/constant";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { ProfileIconModal } from "./modals/ProfileIconModal";
import ButtonAlert from "@/src/common/components/alert/ButtonAlert";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { MemberGameDto } from "@/src/common/DTOs/member/member_game.dto";

const ProfileInfoPage = () => {
  const isMobile = useIsMobile();
  const { member, setMember } = useMemberStore();
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [summonerName, setSummonerName] = useState<string>("");
  const [summonerTierMain, setSummonerTierMain] = useState<string>(
    member?.memberGame?.gameTier?.split(" ")[0] ?? "BRONZE"
  );
  const [summonerTierSub, setSummonerTierSub] = useState<string>(
    member?.memberGame?.gameTier?.split(" ")[1] ?? "I"
  );
  const tierOptions = [
    "BRONZE",
    "SILVER",
    "GOLD",
    "PLATINUM",
    "EMERALD",
    "DIAMOND",
    "MASTER",
    "GRANDMASTER",
    "CHALLENGER",
  ];

  const subTierOptions = ["I", "II", "III", "IV"];

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const typeToImageMap: Record<string, string> = {
    google: "Google_Original",
    kakao: "Kakao_Original",
    naver: "Naver_Original",
  };
  const imageName = typeToImageMap[member?.type || ""] || "default.png";
  type ModalType = "profileIcon" | "profilePassword" | null;

  useEffect(() => {
    if (member) {
      setNickname(member.memberName);
      setSummonerName(member.memberGame?.gameName || "등록되지 않음");
    }
  }, [member]);

  const handleOpenModal = (modal: ModalType) => {
    setOpenModal(modal);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
    setSelectedImage(null);
    setPreviewImage("");
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

  const handleIconSubmit = () => {
    if (selectedImage) {
      updateMemberIcon(selectedImage)
        .then((response) => {
          CustomAlert("success", "프로필 사진 변경", "변경이 완료되었습니다");
          setMember(response.data.data);
          setSelectedImage(null);
          setPreviewImage("");
        })
        .catch((error) => {
          CustomAlert("error", "프로필 사진 변경", "변경 실패");
        });
      setOpenModal(null);
    } else {
      CustomAlert(
        "warning",
        "프로필 사진 변경",
        "프로필 이미지를 등록해주세요"
      );
    }
  };

  const handleNicknameSubmit = () => {
    if (nickname.length < 2 || nickname.length > 7) {
      CustomAlert(
        "warning",
        "닉네임 변경",
        "닉네임은 2자 이상 7자 이하로 설정해주세요"
      );
      return;
    }

    if (/\s/.test(nickname)) {
      CustomAlert(
        "warning",
        "닉네임 변경",
        "닉네임에는 공백을 포함할 수 없습니다"
      );
      return;
    }

    updateNickname(nickname)
      .then((response) => {
        setMember(response.data.data);
        CustomAlert("success", "닉네임 변경", "닉네임 변경이 완료되었습니다");
      })
      .catch((error) => {
        CustomAlert("error", "닉네임 변경", "이미 존재하는 닉네임 입니다");
      });
  };

  const hanldeIconRemove = () => {
    const removeProfileIcon = () => {
      removeIcon()
        .then((response) => {
          setMember(response.data.data);
        })
        .catch((error) => {
          const code = error.response.data.code;

          if (code === "USER-001") {
            CustomAlert(
              "error",
              "프로필 아이콘 삭제",
              "존재하지 않는 멤버 입니다"
            );
          } else if (code === "COMMON-002") {
            CustomAlert(
              "error",
              "프로필 아이콘 삭제",
              "기본 프로필 아이콘은 삭제할 수 없습니다"
            );
          }
        });
    };

    ButtonAlert(
      "프로필 아이콘 삭제",
      "아이콘을 삭제 하시겠습니까?",
      "삭제",
      "닫기",
      removeProfileIcon
    );
  };

  const handleUpdateSummonerInfo = () => {
    if (!isEdit) {
      setIsEdit(true);
      if (summonerName === "등록되지 않음") {
        setSummonerName("");
      }
      return;
    }

    if (summonerName.length < 3 || summonerName.length > 22) {
      CustomAlert(
        "warning",
        "인게임 닉네임 오류",
        "닉네임은 3~22자 사이로 작성해주세요"
      );
      return;
    }

    const combineTier =
      ["MASTER", "GRANDMASTER", "CHALLENGER"].includes(summonerTierMain) ||
      !summonerTierSub
        ? summonerTierMain
        : `${summonerTierMain} ${summonerTierSub}`;

    const memberGameDto: MemberGameDto = {
      ...(member?.memberGame?.id && { id: member.memberGame.id }),
      gameName: summonerName,
      gameTier: combineTier,
    };

    updateMemberSummonerInfo(memberGameDto)
      .then((response) => {
        setMember(response.data.data);
        setIsEdit(false);
      })
      .catch((error) => {
        const code = error.response.data.code;

        if (code === "USER-001") {
          CustomAlert(
            "error",
            "Riot 계정 정보 업데이트",
            "존재하지 않는 멤버 입니다"
          );
        }
      });
  };

  return (
    <div className="flex flex-col p-[16px] gap-[24px]">
      <div className="flex justify-between items-center pb-5 border-b border-gray-200 dark:border-branddarkborder">
        <p className={`font-bold ${isMobile ? "text-[20px]" : "text-[24px]"}`}>
          내 정보
        </p>
        <div className="flex gap-[12px] h-full items-center">
          {member?.memberIcon !== "public/default.png" && (
            <button
              className={`bg-red-500 text-white rounded hover:bg-red-400 ${
                isMobile
                  ? "text-[12px] px-[8px] py-[4px]"
                  : "text-[14px] px-[12px] py-[8px] "
              }`}
              onClick={hanldeIconRemove}
            >
              프로필 사진 삭제
            </button>
          )}
          <button
            className={`bg-brandcolor text-white rounded hover:bg-brandhover dark:bg-branddark dark:hover:bg-brandgray ${
              isMobile
                ? "text-[12px] px-[8px] py-[4px]"
                : "text-[14px] px-[12px] py-[8px]"
            }`}
            onClick={() => handleOpenModal("profileIcon")}
          >
            프로필 사진 변경
          </button>
        </div>
      </div>

      <div className="flex gap-[24px] items-center">
        <div
          className={`shrink-0 ${
            isMobile ? "w-[100px] h-[100px]" : "w-[150px] h-[150px]"
          }`}
        >
          <img
            className="w-full h-full rounded-[12px] object-cover object-center block"
            src={`${constant.SERVER_URL}/${member!.memberIcon}`}
            alt="memberIcon"
          />
        </div>
        <div className="flex flex-col w-full gap-[8px]">
          <div className="flex flex-col gap-[4px]">
            <label className={`${isMobile ? "text-[10px]" : "text-[14px]"}`}>
              이메일
            </label>
            <div
              className={`flex items-center gap-[4px] bg-[#EFEFEF] dark:bg-brandgray border border-[#CDCDCD] rounded w-full cursor-not-allowed dark:border-branddarkborder ${
                isMobile
                  ? "text-[12px] p-[4px]"
                  : "text-[14px] px-[12px] py-[8px]"
              }`}
            >
              <img
                src={`${constant.SERVER_URL}/public/${imageName}.png`}
                alt={member?.type}
                width={15}
                height={15}
              />
              {member!.memberId}
            </div>
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className={`${isMobile ? "text-[10px]" : "text-[14px]"}`}>
              닉네임
            </label>
            <div className="flex gap-[12px]">
              <input
                type="text"
                placeholder="10글자 이내로 작성해주세요"
                maxLength={10}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className={`border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-branddarkborder ${
                  isMobile
                    ? "text-[12px] p-[4px]"
                    : "text-[14px] px-[12px] py-[8px]"
                }`}
              />
              {member?.memberName !== nickname && (
                <button
                  className={`bg-brandcolor rounded text-white hover:bg-brandhover dark:bg-branddark dark:hover:bg-brandgray ${
                    isMobile
                      ? "min-w-[50px] text-[12px]"
                      : "min-w-[100px] text-[14px] px-[14px] py-[8px] "
                  }`}
                  onClick={handleNicknameSubmit}
                >
                  확인
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[4px]">
            <label className={`${isMobile ? "text-[10px]" : "text-[14px]"}`}>
              가입일
            </label>
            <div
              className={`bg-[#EFEFEF] dark:bg-brandgray border border-[#CDCDCD] rounded cursor-not-allowed dark:border-branddarkborder ${
                isMobile
                  ? "text-[12px] p-[4px]"
                  : "text-[14px] px-[12px] py-[8px]"
              }`}
            >
              {member!.createdAt?.toString().split("T")[0]}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pb-5 border-b border-gray-200 dark:border-branddarkborder">
        <p className={`font-bold ${isMobile ? "text-[20px]" : "text-[24px]"}`}>
          Riot 계정 정보
        </p>
      </div>

      <div className="flex flex-col gap-[8px]">
        <div className="flex flex-col gap-[4px]">
          <label className={`${isMobile ? "text-[10px]" : "text-[14px]"}`}>
            인게임 닉네임
          </label>
          <input
            type="text"
            value={summonerName ?? "등록되지 않음"}
            disabled={!isEdit}
            placeholder="태양같은사나이#KR1"
            onChange={(e) => setSummonerName(e.target.value)}
            className={`border border-[#CDCDCD] rounded dark:border-branddarkborder ${
              isMobile
                ? "text-[12px] p-[4px]"
                : "text-[14px] px-[12px] py-[8px]"
            } ${
              isEdit ? "" : "dark:bg-brandgray bg-[#EFEFEF] cursor-not-allowed"
            }`}
          />
        </div>

        <div className="flex flex-col gap-[8px]">
          <label className={`${isMobile ? "text-[10px]" : "text-[14px]"}`}>
            티어
          </label>

          {isEdit ? (
            <div className="flex gap-[8px]">
              <select
                value={summonerTierMain}
                onChange={(e) => {
                  setSummonerTierMain(e.target.value);
                  if (
                    ["MASTER", "GRANDMASTER", "CHALLENGER"].includes(
                      e.target.value
                    )
                  ) {
                    setSummonerTierSub("");
                  } else if (!summonerTierSub) {
                    setSummonerTierSub("I"); // 기본값
                  }
                }}
                className={`border border-[#CDCDCD] rounded dark:border-branddarkborder ${
                  isMobile
                    ? "text-[12px] p-[4px]"
                    : "text-[14px] px-[12px] py-[8px]"
                }`}
              >
                {tierOptions.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>

              {/* 서브 티어 선택 */}
              <select
                value={summonerTierSub}
                onChange={(e) => setSummonerTierSub(e.target.value)}
                disabled={["MASTER", "GRANDMASTER", "CHALLENGER"].includes(
                  summonerTierMain
                )}
                className={`border border-[#CDCDCD] rounded dark:border-branddarkborder ${
                  isMobile
                    ? "text-[12px] p-[4px]"
                    : "text-[14px] px-[12px] py-[8px]"
                }`}
              >
                {subTierOptions.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div
              className={`flex items-center bg-[#EFEFEF] dark:bg-brandgray border border-[#CDCDCD] rounded cursor-not-allowed dark:border-branddarkborder ${
                isMobile
                  ? "text-[12px] p-[4px] gap-[4px]"
                  : "text-[14px] px-[12px] py-[8px] gap-[12px]"
              }`}
            >
              {member?.memberGame?.gameTier &&
                member.memberGame.gameTier !== "등록되지 않음" && (
                  <img
                    src={`${constant.SERVER_URL}/public/rank/${
                      member.memberGame.gameTier.split(" ")[0]
                    }.png`}
                    alt="Tier"
                    width={isMobile ? 20 : 25}
                    height={isMobile ? 20 : 25}
                  />
                )}
              {member?.memberGame?.gameTier || "등록되지 않음"}
            </div>
          )}
        </div>

        <button
          className={`bg-brandcolor rounded text-white hover:bg-brandhover dark:bg-branddark dark:hover:bg-brandgray ${
            isMobile
              ? "min-w-[50px] text-[12px] px-[12px] py-[4px]"
              : "min-w-[100px] text-[14px] px-[14px] py-[8px]"
          }`}
          onClick={handleUpdateSummonerInfo}
        >
          <p>{isEdit ? "확인" : "수정하기"}</p>
        </button>
      </div>

      {openModal === "profileIcon" && (
        <ProfileIconModal
          selectedImage={selectedImage}
          previewImage={previewImage}
          onClose={handleCloseModal}
          onImageChange={handleImageChange}
          onSubmit={handleIconSubmit}
        />
      )}
      {/* {openModal === "profilePassword" && (
        <ProfilePasswordModal
          onClose={handleCloseModal}
          onSubmit={handlePasswordSubmit}
        />
      )} */}
    </div>
  );
};

export default ProfileInfoPage;

import { useEffect, useState } from "react";
import {
  updateMemberIcon,
  updateNickname,
  updatePassword,
} from "@/src/api/member.api";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import constant from "@/src/common/constant/constant";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { ProfileIconModal } from "./modals/ProfileIconModal";
import { ProfilePasswordModal } from "./modals/profilePasswordModal";
import { removeCookie } from "@/src/utils/cookie/cookie";
import { useRouter } from "next/navigation";

const ProfileInfoPage = () => {
  const router = useRouter();
  const { member, setMember } = useMemberStore();
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");

  type ModalType = "profileIcon" | "profilePassword" | null;

  useEffect(() => {
    if (member) {
      setNickname(member.memberName);
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

  const handlePasswordSubmit = (
    currentPassword: string,
    newPassword: string
  ) => {
    updatePassword(currentPassword, newPassword)
      .then((response) => {
        CustomAlert(
          "success",
          "비밀번호 변경",
          "비밀번호 변경이 완료되었습니다"
        );
        setMember(null);
        removeCookie("accessToken");
        removeCookie("refreshToken");

        router.replace("/register");
      })
      .catch((error) => {
        CustomAlert("error", "비밀번호 변경", "비밀번호를 확인해주세요");
      });
  };

  const handleNicknameSubmit = () => {
    updateNickname(nickname)
      .then((response) => {
        setMember(response.data.data);
        CustomAlert("success", "닉네임 변경", "닉네임 변경이 완료되었습니다");
      })
      .catch((error) => {
        CustomAlert("error", "닉네임 변경", "이미 존재하는 닉네임 입니다");
      });
  };

  return (
    <div className="flex flex-col p-[16px] gap-[24px]">
      <div className="flex justify-between items-center pb-5 border-b border-gray-200">
        <p className="text-[24px] font-bold">내 정보</p>
        <div className="flex gap-[12px]">
          <button
            className="bg-brandcolor text-white px-4 py-2 rounded hover:bg-brandhover dark:bg-branddark dark:hover:bg-brandgray"
            onClick={() => handleOpenModal("profileIcon")}
          >
            프로필 사진 변경
          </button>
          <button
            className="bg-brandcolor text-white px-4 py-2 rounded hover:bg-brandhover dark:bg-branddark dark:hover:bg-brandgray"
            onClick={() => handleOpenModal("profilePassword")}
          >
            비밀번호 변경
          </button>
        </div>
      </div>

      <div className="flex gap-[24px] items-center">
        <div className="w-[150px] h-[150px] shrink-0">
          <img
            className="w-full h-full rounded-[12px] object-cover object-center block"
            src={`${constant.SERVER_URL}/${member!.memberIcon}`}
            alt="memberIcon"
          />
        </div>
        <div className="flex flex-col w-full gap-[8px]">
          <div className="flex flex-col gap-[4px]">
            <label>이메일</label>
            <div className="bg-[#EFEFEF] dark:bg-brandgray border border-[#CDCDCD] rounded px-[12px] py-[8px] w-full cursor-not-allowed">
              {member!.memberId}
            </div>
          </div>

          <div className="flex flex-col gap-[4px]">
            <label>닉네임</label>
            <div className="flex gap-[12px]">
              <input
                type="text"
                placeholder="10글자 이내로 작성해주세요"
                maxLength={10}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {member?.memberName !== nickname && (
                <button
                  className="min-w-[100px] bg-brandcolor rounded text-white px-[14px] py-[8px] hover:bg-brandhover dark:bg-branddark dark:hover:bg-brandgray"
                  onClick={handleNicknameSubmit}
                >
                  확인
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[4px]">
            <label>가입일</label>
            <div className="bg-[#EFEFEF] dark:bg-brandgray border border-[#CDCDCD] rounded px-[12px] py-[8px] cursor-not-allowed">
              {member!.createdAt?.toString().split("T")[0]}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pb-5 border-b border-gray-200">
        <p className="text-[24px] font-bold">Riot 계정 정보</p>
      </div>

      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[4px]">
          <label>인게임 닉네임</label>
          <div className="bg-[#EFEFEF] dark:bg-brandgray border border-[#CDCDCD] rounded px-[12px] py-[8px] cursor-not-allowed">
            {member!.memberGame?.gameName ?? "등록되지 않음"}
          </div>
        </div>
        <div className="flex flex-col gap-[4px]">
          <label>티어</label>
          <div className="flex items-center bg-[#EFEFEF] dark:bg-brandgray border border-[#CDCDCD] rounded px-[12px] py-[8px] gap-[12px] cursor-not-allowed">
            {member?.memberGame?.gameTier ? (
              <>
                <img
                  src={`${constant.SERVER_URL}/public/rank/${
                    member.memberGame.gameTier.split(" ")[0]
                  }.png`}
                  alt="Tier"
                  width={25}
                  height={25}
                />
                {member.memberGame.gameTier}
              </>
            ) : (
              <span>등록되지 않음</span>
            )}
          </div>
        </div>
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
      {openModal === "profilePassword" && (
        <ProfilePasswordModal
          onClose={handleCloseModal}
          onSubmit={handlePasswordSubmit}
        />
      )}
    </div>
  );
};

export default ProfileInfoPage;

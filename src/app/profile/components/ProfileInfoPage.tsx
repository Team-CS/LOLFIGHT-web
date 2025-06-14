import { useEffect, useState } from "react";
import Image from "next/image";
import { MemberDTO } from "@/src/common/DTOs/member/member.dto";
import { updateMemberIcon } from "@/src/api/member.api";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import constant from "@/src/common/constant/constant";
import { useMemberStore } from "@/src/common/zustand/member.zustand";

const ProfileInfoPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const { member } = useMemberStore();

  const handleChangeIconClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  const handleSubmit = () => {
    if (selectedImage) {
      updateMemberIcon(member!, selectedImage)
        .then((response) => {
          CustomAlert("success", "프로필 사진 변경", "변경이 완료되었습니다");
          setSelectedImage(null);
          setPreviewImage("");
        })
        .catch((error) => {
          CustomAlert("error", "프로필 사진 변경", "변경 실패");
        });
      setIsModalOpen(false);
    } else {
      CustomAlert(
        "warning",
        "프로필 사진 변경",
        "프로필 이미지를 등록해주세요"
      );
    }
  };

  return (
    <div className="w-1200px h-full mx-auto pt-4">
      <div className="flex justify-between items-center pb-5 border-b border-gray-200">
        <p className="text-xl font-normal">내 정보</p>
        <button
          className="bg-brandcolor text-white px-4 py-2 rounded hover:bg-brandhover"
          onClick={handleChangeIconClick}
        >
          프로필 사진 변경
        </button>
      </div>

      <div className="flex mt-4">
        <div className="w-[128px] h-[128px] my-auto">
          <Image
            className="w-full h-full rounded-full mr-[20px]"
            width={70}
            height={70}
            src={`${constant.SERVER_URL}/${member!.memberIcon}`}
            alt={"memberIcon"}
            unoptimized
          />
        </div>
        <div className="info-container flex-col ml-8">
          <div className="flex items-center">
            <p className="font-bold py-2 pr-8">이메일</p>
            <p>{member!.memberId}</p>
          </div>
          <div className="flex items-center">
            <p className="font-bold py-2 pr-8">닉네임</p>
            {member!.memberName}
          </div>
          <div className="flex items-center">
            <p className="font-bold py-2 pr-8">가입일</p>
            {member!.createdAt?.toString().split("T")[0]}
          </div>
        </div>
      </div>

      <p className="pb-5 text-xl font-normal border-b border-gray-200 mt-8">
        계정 정보
      </p>
      <div className="flex pt-4 pb-16">
        <div className="flex flex-col">
          <div className="flex items-center">
            <p className="font-bold py-2 pr-8">인게임 닉네임</p>
            {member!.memberGame?.gameName}
          </div>
          <div className="flex items-center">
            <p className="font-bold py-2 pr-24">티어</p>
            {member!.memberGame?.gameTier}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 dark:text-black">
            <h2 className="text-lg font-bold mb-4">프로필 사진 변경</h2>
            <div className="flex justify-center mb-4">
              {selectedImage === null ? (
                <img src="http://via.placeholder.com/50x50" alt="" />
              ) : (
                <img src={previewImage} alt="프로필 사진 미리보기" width={50} />
              )}
            </div>

            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="mb-4"
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                onClick={handleCloseModal}
              >
                취소
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfoPage;

"use client";
import React, { useEffect, useState } from "react";
import CutsomAlert from "../../../../common/components/alert/CustomAlert";
import { createGuild } from "@/src/api/guild.api";
import { CreateGuildDto } from "@/src/common/DTOs/guild/guild.dto";
import { useRouter } from "next/navigation";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

export default function Page() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { member } = useMemberStore();
  const [guildImage, setGuildImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [guildName, setGuildName] = useState<string>();
  const [guildDescription, setGuildDescription] = useState<string>();
  const [guildIcon, setGuildIcon] = useState<string>();

  useEffect(() => {
    if (!member) {
      alert("로그인 후 이용가능합니다.");
      router.replace("/");
      return;
    }

    if (member.memberGuild) {
      alert("이미 길드에 속해있습니다.");
      router.replace("/");
      return;
    }
  }, [member, router]);

  //====================================================================//
  // Valid Check
  //====================================================================//
  const isGuildNameValid = (guildName: string) => {
    if (guildName.length < 2 || guildName.length > 12) {
      CutsomAlert(
        "warning",
        "길드생성",
        "길드명은 2자 이상, 12자 이내로 작성해주세요."
      );
      return false;
    }
    return true;
  };

  const isGuildImageValid = (guildImage: File) => {
    if (!guildImage) {
      CutsomAlert(
        "warning",
        "길드생성",
        "50x50 사이즈의 길드이미지를 등록해주세요."
      );
      return false;
    }
    return true;
  };

  const isGuildDescriptionValid = (guildDescription: string) => {
    if (guildDescription.length > 160) {
      CutsomAlert(
        "warning",
        "길드생성",
        "길드 소개글은 160글자 이내로 작성해주세요."
      );
      return false;
    }
    return true;
  };
  //====================================================================//

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setGuildImage(e.target.files[0]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCreateGuild = () => {
    if (
      guildName &&
      guildDescription &&
      isGuildNameValid(guildName) &&
      isGuildImageValid(guildImage!) &&
      isGuildDescriptionValid(guildDescription)
    ) {
      const guildData: CreateGuildDto = {
        // guildMaster: member!.memberName,
        guildName,
        guildDescription,
        guildIcon: guildIcon || "",
      };

      createGuild(guildData, guildImage)
        .then(() => {
          CutsomAlert("success", "길드생성", "길드생성이 완료되었습니다.");
          router.push("/");
        })
        .catch((error) => {
          const code = error.response.data.code;
          if (code === "COMMON-005") {
            CutsomAlert(
              "warning",
              "길드생성",
              "동일한 길드명이 존재하거나, 길드에 속해있습니다."
            );
          } else if (code === "COMMON-018") {
            CutsomAlert(
              "warning",
              "길드생성",
              "부적절한 단어가 포함되어 있습니다."
            );
          }
        });
    }
  };

  return (
    <div className="flex justify-center w-full bg-gray-50 dark:bg-gray-900 p-[32px]">
      <div className="flex flex-col w-full max-w-[1000px] border rounded-[24px] shadow-lg p-[32px] bg-white dark:bg-dark dark:border-gray-700 gap-[16px]">
        {/* 길드 이미지 */}
        <div className="flex flex-col gap-[8px]">
          <p
            className={`font-bold ${isMobile ? "text-[16px]" : "text-[20px]"}`}
          >
            길드 이미지
          </p>
          <div className="flex flex-col items-center gap-[8px]">
            <div className="relative w-[100px] h-[100px] border-2 border-dashed border-brandcolor rounded-[16px] flex items-center justify-center overflow-hidden hover:border-brandcolor/70 transition-colors duration-200">
              {guildImage ? (
                <img
                  src={previewImage}
                  alt="Guild Icon"
                  className="w-full h-full object-cover rounded-[16px]"
                />
              ) : (
                <img
                  src="https://placehold.co/50x50"
                  alt="placeholder"
                  className="w-[50px] h-[50px]"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImgUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-gray-500 text-[12px] dark:text-gray-400 text-center">
              50x50 사이즈 권장
              <br />
              클릭하여 이미지 선택
            </span>
          </div>
        </div>

        {/* 길드 명 */}
        <div className="flex flex-col gap-[8px]">
          <p
            className={`font-bold ${isMobile ? "text-[16px]" : "text-[20px]"}`}
          >
            길드 명
          </p>
          <input
            type="text"
            placeholder="길드명 (최대 12글자)"
            className="w-full h-[50px] px-[12px] rounded-[16px] border border-brandcolor bg-gray-50 dark:bg-black dark:text-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brandcolor"
            onChange={(e) => setGuildName(e.target.value)}
          />
        </div>

        {/* 길드 소개글 */}
        <div className="flex flex-col gap-[8px]">
          <p
            className={`font-bold ${isMobile ? "text-[16px]" : "text-[20px]"}`}
          >
            길드 소개글
          </p>
          <textarea
            placeholder="길드 소개글을 입력해주세요 (최대 160글자)"
            className="w-full h-[150px] px-[12px] py-[8px] rounded-[16px] border border-brandcolor bg-gray-50 dark:bg-black dark:text-gray-100 dark:border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-brandcolor"
            onChange={(e) => {
              const val = e.target.value.slice(0, 160); // 최대 160자 제한
              setGuildDescription(val);
            }}
            value={guildDescription || ""}
          />
          {/* 글자 수 표시 */}
          <span className="text-gray-500 text-[12px] dark:text-gray-400 text-right">
            {guildDescription ? guildDescription.length : 0} / 160 글자
          </span>
        </div>

        {/* 길드 생성 버튼 */}
        <button
          className="w-full py-[12px] bg-brandcolor text-white font-bold rounded-[16px] hover:bg-brandcolor/90 transition-colors duration-200"
          onClick={handleCreateGuild}
        >
          길드생성
        </button>
      </div>
    </div>
  );
}

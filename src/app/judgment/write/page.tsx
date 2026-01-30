"use client";
import constant from "@/src/common/constant/constant";
import React, { useRef, useState } from "react";

import championData from "../../../common/constant/champion_id_name_map.json";
import { useRouter } from "next/navigation";
import { createJudgment } from "@/src/api/judgment.api";
import { JudgmentCreateDto } from "@/src/common/DTOs/judgment/judgment.dto";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { Summoner } from "@/src/common/types/judgment.type";
import SummonerInputBox from "../components/SummonerInputBox";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import Image from "next/image";

interface ChampionsMap {
  [key: string]: string;
}

export default function Page() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { member } = useMemberStore();

  const [judgment, setJudgment] = useState<JudgmentCreateDto>({
    id: 0,
    judgmentTitle: "",
    judgmentDesc: "",
    judgmentView: 0,
    judgmentLeftChampion: "1",
    judgmentLeftName: "",
    judgmentLeftTier: "",
    judgmentLeftLine: "",
    judgmentRightChampion: "2",
    judgmentRightName: "",
    judgmentRightTier: "",
    judgmentRightLine: "",
    judgmentVideo: "",
    votes: [],
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [champions] = useState<ChampionsMap>(championData);

  const [leftShowImages, setLeftShowImages] = useState<boolean>(false);
  const [rightShowImages, setRightShowImages] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [selectedLeftChampion, setSelectedLeftChampion] = useState<string>("1");
  const [selectedRightChampion, setSelectedRightChampion] =
    useState<string>("2");

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const filteredChampions = Object.entries(champions).filter(([id, name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJudgment((prevJudgment) => ({
      ...prevJudgment,
      judgmentTitle: e.target.value,
    }));
  };
  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJudgment((prevJudgment) => ({
      ...prevJudgment,
      judgmentDesc: e.target.value,
    }));
  };
  const handleSummonerChange = (
    side: "left" | "right",
    field: keyof Summoner,
    value: string
  ) => {
    if (side === "left") {
      // setLeftSummoner((prev) => ({ ...prev, [field]: value }));
      setJudgment((prevJudgment) => ({
        ...prevJudgment,
        judgmentLeftName:
          side === "left" && field === "name"
            ? value
            : prevJudgment.judgmentLeftName,
        judgmentLeftLine:
          side === "left" && field === "line"
            ? value
            : prevJudgment.judgmentLeftLine,
        judgmentLeftTier:
          side === "left" && field === "tier"
            ? value
            : prevJudgment.judgmentLeftTier,
      }));
    } else {
      // setRightSummoner((prev) => ({ ...prev, [field]: value }));
      setJudgment((prevJudgment) => ({
        ...prevJudgment,
        judgmentRightName:
          side === "right" && field === "name"
            ? value
            : prevJudgment.judgmentRightName,
        judgmentRightLine:
          side === "right" && field === "line"
            ? value
            : prevJudgment.judgmentRightLine,
        judgmentRightTier:
          side === "right" && field === "tier"
            ? value
            : prevJudgment.judgmentRightTier,
      }));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoRemove = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // 이 줄이 중요!
    }
  };

  const handleSaveClick = () => {
    if (member) {
      setJudgment((prevJudgment) => ({
        ...prevJudgment,
        judgmentWriter: member.memberName,
      }));
    }

    if (!judgment.judgmentTitle || !judgment.judgmentDesc) {
      CustomAlert(
        "warning",
        "롤로세움",
        "해당 논쟁의 제목과 부가 설명을 작성해주세요"
      );
    } else if (
      !judgment.judgmentLeftName ||
      !judgment.judgmentLeftTier ||
      !judgment.judgmentLeftLine ||
      !judgment.judgmentRightName ||
      !judgment.judgmentRightTier ||
      !judgment.judgmentRightLine
    ) {
      CustomAlert(
        "warning",
        "롤로세움",
        "양쪽 소환사의 정보가 모두 입력되어야 합니다."
      );
    } else if (!videoFile) {
      CustomAlert(
        "warning",
        "롤로세움",
        "해당 논쟁의 영상을 업로드 해주세요 (최대 5분)"
      );
    } else {
      createJudgment(judgment, videoFile)
        .then((response) => {
          CustomAlert(
            "success",
            "롤로세움",
            "롤로세움 투기장 작성이 완료되었습니다"
          );
          router.replace("/judgment");
        })
        .catch((error) => {
          const code = error.response.data.code;
          if (code === "COMMON-018") {
            CustomAlert(
              "error",
              "롤로세움",
              "부적절한 단어가 포함되어 있습니다."
            );
          }
        });
    }
  };

  const handleCancelClick = () => {
    router.push("/");
  };

  // 왼쪽 이미지 클릭 핸들러
  const handleLeftImageClick = () => {
    setLeftShowImages(!leftShowImages);
    setRightShowImages(false);
    setSearchTerm("");
  };

  // 오른쪽 이미지 클릭 핸들러
  const handleRightImageClick = () => {
    setRightShowImages(!rightShowImages);
    setLeftShowImages(false);
    setSearchTerm("");
  };

  const handleChampionSelect = (id: string, isLeft: boolean) => {
    if (isLeft) {
      setJudgment((prevJudgment) => ({
        ...prevJudgment,
        judgmentLeftChampion: id,
      }));
      setSelectedLeftChampion(id);
    } else {
      setJudgment((prevJudgment) => ({
        ...prevJudgment,
        judgmentRightChampion: id,
      }));
      setSelectedRightChampion(id);
    }
    setLeftShowImages(false);
    setRightShowImages(false);
  };

  return (
    <div className="flex max-w-[1200px] h-full mx-auto w-full py-[32px] px-[12px] md:px-0">
      <div className="w-full bg-white rounded-[16px] p-[16px] md:p-[24px] shadow-lg border border-gray-100 dark:border-branddarkborder dark:bg-dark">
        <div className="flex flex-col h-full px-[12px] md:px-[20px] py-[20px] gap-[20px]">
          <div className="flex items-center gap-[10px]">
            <div className="w-[4px] h-[28px] bg-gradient-to-b from-red-500 to-orange-400 rounded-full" />
            <p className={`font-bold ${isMobile ? "text-[20px]" : "text-[26px]"}`}>롤로세움 글쓰기</p>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">제목</label>
            <input
              className="w-full h-[46px] px-[14px] border border-gray-200 dark:border-branddarkborder rounded-[10px] text-[14px] bg-gray-50 dark:bg-branddark dark:text-white focus:outline-none focus:border-red-400 transition-colors"
              type="text"
              placeholder="제목을 입력하세요"
              onChange={handleTitleChange}
            />
          </div>

          <div
            className={`flex w-full items-center justify-between ${
              isMobile ? "gap-[8px]" : "gap-[16px]"
            }`}
          >
            {/* left */}
            <SummonerInputBox
              side="left"
              selectedChampionId={selectedLeftChampion}
              onChampionClick={handleLeftImageClick}
              onChange={(field, value) =>
                handleSummonerChange("left", field, value)
              }
            />
            {/* center */}
            <div className={`font-extrabold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent ${isMobile ? "text-[16px]" : "text-[22px]"}`}>VS</div>

            {/* right */}
            <SummonerInputBox
              side="right"
              selectedChampionId={selectedRightChampion}
              onChampionClick={handleRightImageClick}
              onChange={(field, value) =>
                handleSummonerChange("right", field, value)
              }
            />
          </div>

          {/* 이미지 선택창 */}
          {(leftShowImages || rightShowImages) && (
            <div className="flex flex-col w-full h-auto p-[14px] bg-white dark:bg-branddark border border-gray-200 dark:border-branddarkborder rounded-[14px] gap-[14px] shadow-md">
              <input
                className="w-full h-[42px] border border-gray-200 dark:border-branddarkborder rounded-[10px] px-[12px] bg-gray-50 dark:bg-dark focus:outline-none focus:border-red-400"
                type="text"
                placeholder="챔피언 검색"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div
                className={`grid gap-[8px] max-h-[300px] overflow-y-auto ${
                  isMobile ? "grid-cols-5" : "grid-cols-10"
                }`}
              >
                {filteredChampions.map(([id, name]) => (
                  <div
                    key={id}
                    className="flex flex-col justify-center items-center gap-[4px] cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleChampionSelect(id, leftShowImages)}
                  >
                    <Image
                      src={`${constant.SERVER_URL}/public/champions/${id}.png`}
                      alt={name}
                      width={60}
                      height={60}
                      className={`${
                        isMobile ? "w-[45px] h-[45px]" : "w-[60px] h-[60px]"
                      } rounded-[10px] border-2 border-transparent hover:border-red-400 transition-colors`}
                    />
                    <p className={`font-medium text-center truncate w-full ${isMobile ? "text-[9px]" : "text-[11px]"}`}>{name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">상황 설명</label>
            <textarea
              className="w-full h-[120px] border border-gray-200 dark:border-branddarkborder rounded-[10px] p-[14px] text-[14px] bg-gray-50 dark:bg-branddark focus:outline-none focus:border-red-400 transition-colors resize-none"
              placeholder="상황에 대한 설명을 작성해주세요"
              onChange={handleDescChange}
            />
          </div>

          {/* 영상 업로드 부분 */}
          <div className="flex flex-col w-full gap-[8px]">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400">영상 업로드</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="border border-gray-200 dark:border-branddarkborder rounded-[10px] px-[12px] py-[10px] bg-gray-50 dark:bg-branddark text-[14px] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100 dark:file:bg-red-900/30 dark:file:text-red-400"
            />
            {videoPreview && (
              <div className="relative w-full h-full mt-[8px]">
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-full rounded-[12px] shadow-md"
                />
                <button
                  onClick={handleVideoRemove}
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-[8px] px-[12px] py-[6px] text-[12px] font-medium shadow-md transition-colors"
                >
                  제거
                </button>
              </div>
            )}
          </div>

          <div className="w-full flex justify-between pt-[12px] border-t border-gray-100 dark:border-branddarkborder">
            <button
              className="px-[20px] h-[44px] flex font-medium border border-gray-300 dark:border-branddarkborder items-center justify-center rounded-[10px] cursor-pointer hover:bg-gray-100 dark:hover:bg-branddark transition-colors text-[14px]"
              onClick={handleCancelClick}
            >
              취소
            </button>
            <button
              className="px-[24px] h-[44px] flex font-semibold bg-gradient-to-r from-red-500 to-orange-500 text-white items-center justify-center rounded-[10px] cursor-pointer hover:opacity-90 transition-opacity shadow-md text-[14px]"
              onClick={handleSaveClick}
            >
              작성하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

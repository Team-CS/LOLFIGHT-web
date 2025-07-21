"use client";
import constant from "@/src/common/constant/constant";
import React, { useRef, useState } from "react";

import championData from "../../../common/constant/champion_id_name_map.json";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createJudgment } from "@/src/api/judgment.api";
import {
  JudgmentCreateDto,
  JudgmentDto,
} from "@/src/common/DTOs/judgment/judgment.dto";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { Summoner } from "@/src/common/types/judgment.type";
import SummonerInputBox from "../../board/components/write/components/SummonerInputBox";

interface ChampionsMap {
  [key: string]: string;
}

export default function Page() {
  const router = useRouter();
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
          console.log(error);
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
    <div className="flex max-w-[1200px] h-full mx-auto w-full py-[28px]">
      <div className="w-full bg-white rounded-[12px] p-[24px] shadow-md dark:bg-dark">
        <div className="flex flex-col h-full px-[20px] py-[24px] gap-[24px]">
          <p className="text-[24px] font-extrabold">롤로세움</p>
          <input
            className="w-full h-[40px] px-[12px] border border-brandborder rounded-md text-[14px] bg-brandbgcolor dark:bg-branddark dark:border-branddarkborder dark:text-white"
            type="text"
            placeholder="제목을 입력하세요"
            onChange={handleTitleChange}
          />
          <div className="flex w-full items-center justify-between">
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
            <div className="px-10 text-lg font-bold">VS</div>

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
            <div className="flex flex-col w-full h-auto p-[12px] bg-white dark:bg-gray-900 border rounded-md gap-[12px]">
              <input
                className="w-full h-[40px] border rounded-md px-2 bg-gray-100 dark:bg-black dark:border-gray-700"
                type="text"
                placeholder="챔피언 검색"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="grid grid-cols-12 gap-[4px]">
                {filteredChampions.map(([id, name]) => (
                  <div className="flex flex-col justify-center items-center">
                    <img
                      key={id}
                      src={`${constant.SERVER_URL}/public/champions/${id}.png`}
                      alt={name}
                      className="cursor-pointer w-[70px] h-[70px] rounded-[12px]"
                      onClick={() => handleChampionSelect(id, leftShowImages)}
                    />
                    <p className="font-light text-[10px]">{name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <textarea
            className="w-full h-[100px] border rounded-md p-[12px] text-[14px] bg-brandbgcolor dark:bg-branddark dark:border-gray-700"
            placeholder="상황에 대한 설명을 작성해주세요"
            onChange={handleDescChange}
          />

          {/* 영상 업로드 부분 */}
          <div className="flex flex-col w-full gap-[4px] ">
            <label className="font-medium text-[14px]">영상 업로드</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="border rounded-md px-[8px] py-[4px] bg-brandbgcolor dark:bg-branddark dark:border-gray-700"
            />
            {videoPreview && (
              <div className="relative w-full h-full">
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-full rounded-md"
                />
                <button
                  onClick={handleVideoRemove}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-md px-2"
                >
                  제거
                </button>
              </div>
            )}
          </div>

          <div className="w-full flex justify-between">
            <button
              className="w-[60px] h-[40px] flex font-medium border items-center justify-center rounded-md cursor-pointer dark:border-gray-700"
              onClick={handleCancelClick}
            >
              취소
            </button>
            <button
              className="w-[120px] h-[40px] flex font-medium bg-brandcolor text-white items-center justify-center rounded-md cursor-pointer"
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

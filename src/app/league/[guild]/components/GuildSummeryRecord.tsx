import { useIsMobile } from "@/src/hooks/useMediaQuery";
import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Props {
  guildVictory: number | undefined;
  guildDefeat: number | undefined;
}

const GuildSummeryRecord = (props: Props) => {
  const isMobile = useIsMobile();
  return (
    <div className="h-full w-full flex flex-col p-[12px] rounded bg-white dark:bg-dark border dark:bg-dark dark:border-gray-700">
      <p className="font-extrabold">매치 통계</p>

      <div className="flex py-[8px] px-[12px] items-center">
        <div className="flex w-[400px] items-center gap-[24px]">
          <div
            style={{
              width: isMobile ? "80px" : "140px",
              height: isMobile ? "80px" : "140px",
            }}
          >
            <CircularProgressbar
              value={
                isNaN(
                  (props.guildVictory! /
                    (props.guildDefeat! + props.guildVictory!)) *
                    100
                )
                  ? 0
                  : (props.guildVictory! /
                      (props.guildDefeat! + props.guildVictory!)) *
                    100
              }
              strokeWidth={8}
              text={
                isNaN(
                  (props.guildVictory! /
                    (props.guildDefeat! + props.guildVictory!)) *
                    100
                )
                  ? "기록없음"
                  : (
                      (props.guildVictory! /
                        (props.guildDefeat! + props.guildVictory!)) *
                      100
                    ).toFixed(2) + "%"
              }
              styles={{
                path: {
                  stroke: "#007fff",
                },
                text: {
                  fill: "currentcolor",
                  fontSize: "16px",
                  fontWeight: "500",
                },
              }}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className={`${isMobile ? "text-[12px]" : "text-[22px]"}`}>
              {props.guildVictory! + props.guildDefeat!}전 {props.guildVictory}
              승 {props.guildDefeat}패
            </p>
            <p
              className={`text-red-500 ${
                isMobile ? "text-[12px]" : "text-[22px]"
              }`}
            >
              {isNaN(
                (props.guildVictory! /
                  (props.guildDefeat! + props.guildVictory!)) *
                  100
              )
                ? "기록없음"
                : `(${(
                    (props.guildVictory! /
                      (props.guildDefeat! + props.guildVictory!)) *
                    100
                  ).toFixed(2)}%)`}
            </p>
          </div>
        </div>
        <div className="flex flex-col w-[400px] items-center justify-center">
          <p className="font-light text-[14px] text-gray-500">준비중입니다</p>
        </div>
      </div>
    </div>
  );
};

export default GuildSummeryRecord;

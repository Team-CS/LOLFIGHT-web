"use client";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { useRouter } from "next/navigation";

export const GuildCreateIntro = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <div
      className={`flex w-full py-[24px] gap-[24px] ${
        isMobile ? "flex-col" : "grid grid-cols-2"
      }`}
    >
      {/* 왼쪽 카드: 환영 + 길드 만들기 */}
      <div
        className={`flex flex-col w-full border rounded-[16px] p-[24px] shadow-md bg-white dark:bg-dark dark:border-gray-700 gap-[24px] ${
          isMobile ? "items-center" : "justify-between"
        }`}
      >
        <div className="flex flex-col gap-[24px]">
          <p
            className={`font-extrabold leading-[1.2] ${
              isMobile ? "text-[24px]" : "text-[36px]"
            }`}
          >
            롤파이트에 오신것을 <br />
            환영합니다
          </p>
          <p
            className={`font-extrabold text-brandcolor leading-[1.2] ${
              isMobile ? "text-[20px]" : "text-[32px]"
            }`}
          >
            길드를 생성하고 <br /> 나만의 길드를 운영해보세요.
          </p>
        </div>

        <button
          className={`flex py-[12px] px-[16px] rounded-[12px] w-full items-center justify-center bg-brandcolor hover:bg-brandhover transition-colors duration-200`}
          onClick={() => {
            router.push("/league/guild/create");
          }}
        >
          <p
            className={`text-white font-bold ${
              isMobile ? "text-[14px]" : "text-[20px]"
            }`}
          >
            길드 만들기
          </p>
        </button>
      </div>

      {/* 오른쪽 카드: 안내 텍스트 */}
      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-col w-full gap-[8px] p-[16px] border rounded-[12px] shadow-sm bg-white dark:bg-dark dark:border-gray-700">
          <p
            className={`font-extrabold text-brandcolor ${
              isMobile ? "text-[20px]" : "text-[24px]"
            }`}
          >
            롤파이트 길드란?
          </p>
          <p className={`${isMobile ? "text-[14px]" : "text-[16px]"}`}>
            롤파이트 유저가 자신만의 길드를 만들어 원하는 다른 길드들과 함께
            롤파이트 전적시스템을 이용할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col w-full gap-[8px] p-[16px] border rounded-[12px] shadow-sm bg-white dark:bg-dark dark:border-gray-700">
          <p
            className={`font-extrabold text-brandcolor ${
              isMobile ? "text-[20px]" : "text-[24px]"
            }`}
          >
            어떻게 참여하나요?
          </p>
          <p className={`${isMobile ? "text-[14px]" : "text-[16px]"}`}>
            길드 생성을 하면 자동으로 롤파이트 공식 리그에 참여하여 참여 중인
            다른 길드들과 경쟁할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col w-full gap-[8px] p-[16px] border rounded-[12px] shadow-sm bg-white dark:bg-dark dark:border-gray-700">
          <p
            className={`font-extrabold text-brandcolor ${
              isMobile ? "text-[20px]" : "text-[24px]"
            }`}
          >
            길드전은 어떻게 하나요?
          </p>
          <p className={`${isMobile ? "text-[14px]" : "text-[16px]"}`}>
            롤 길드전은 Riot 계정 인증을 완료한 길드원들끼리 팀을 구성하여
            진행할 수 있으며, 팀을 꾸린 뒤 커뮤니티 기반 예약제 스크림을 통해
            길드전을 치르게 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

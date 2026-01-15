import Image from "next/image";

interface ProfileProps {
  isMobile: boolean;
}

export const profileToc = [
  { id: "overview", title: "멤버 프로필 설정법" },
  { id: "setting", title: "1. 멤버 정보 관리" },
  { id: "item-manage", title: "2. 아이템 관리" },
];

export default function ProfileGuide({ isMobile }: ProfileProps) {
  return (
    <>
      <section id="overview" className="scroll-mt-[80px]">
        <h3
          className={`font-bold mb-[12px] ${
            isMobile ? "text-[16px]" : "text-[18px]"
          } text-gray-800 dark:text-gray-200`}
        >
          {profileToc[0].title}
        </h3>

        <div className="p-[16px] rounded-[8px] bg-gray-50 dark:bg-black border border-gray-100 dark:border-branddarkborder">
          <p
            className={`leading-relaxed ${
              isMobile ? "text-[13px]" : "text-[15px]"
            } text-gray-700 dark:text-gray-400`}
          >
            멤버의 아이콘, 닉네임 및 소환사 계정을 연동할 수 있으며, 아이템
            관리가 가능합니다. 로그인 후{" "}
            <span className="font-bold">내정보</span>
            버튼을 누른후 프로필 페이지에서 관리 가능합니다.
          </p>
        </div>
      </section>

      <section id="setting" className="scroll-mt-[80px]">
        <h3
          className={`font-bold mb-[12px] ${
            isMobile ? "text-[16px]" : "text-[18px]"
          } text-gray-800 dark:text-gray-200`}
        >
          {profileToc[1].title}
        </h3>

        <div
          className={`p-[16px] rounded-[8px] bg-gray-50 dark:bg-black border border-gray-100 dark:border-branddarkborder flex flex-col gap-[12px] ${
            isMobile ? "text-[13px]" : "text-[15px]"
          } text-gray-700 dark:text-gray-400`}
        >
          <Image
            src="/guide/profile/profile-setting.png"
            alt="길드 생성"
            width={600}
            height={600}
          />
          <p className="font-bold">닉네임 변경</p>

          <ul className="list-disc pl-[18px] flex flex-col gap-[6px] text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px]">
            <li>
              프로필에서 닉네임 변경 버튼을 눌러 닉네임을 변경할 수 있습니다.
            </li>
            <li>중복된 닉네임은 사용할 수 없습니다.</li>
            <li>부적절한 닉네임은 제제대상이 될 수 있습니다.</li>
          </ul>

          <p className="font-bold">아이콘 변경</p>

          <ul className="list-disc pl-[18px] flex flex-col gap-[6px] text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px]">
            <li>
              프로필에서 아이콘 변경 버튼을 눌러 아이콘을 변경할 수 있습니다.
            </li>
            <li>삭제 버튼을 눌러 적용된 아이콘을 삭제 할 수 있습니다.</li>
            <li>부적절한 아이콘은 제제대상이 될 수 있습니다.</li>
          </ul>

          <p className="font-bold">출석 체크</p>

          <ul className="list-disc pl-[18px] flex flex-col gap-[6px] text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px]">
            <li>
              1일 1회 출석 체크 버튼을 눌러 롤파이트 포인트를 획득할 수
              있습니다. <br /> 해당 포인트는 롤파이트 치장 상점에 사용됩니다.
            </li>
            <li>연속 출석시 보너스 포인트가 지급 됩니다.</li>
          </ul>

          <p className="font-bold">Riot 소환사 연동</p>
          <Image
            src="/guide/profile/profile-riot-2.png"
            alt="계정 연동전"
            width={600}
            height={600}
          />
          <Image
            src="/guide/profile/profile-riot-1.png"
            alt="계정 연동후"
            width={600}
            height={600}
          />
          <ul className="list-disc pl-[18px] flex flex-col gap-[6px] text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px]">
            <li>본인 명의의 소환사 명을 등록할 수 있습니다.</li>
            <li>타인의 소환사 명을 도용시 제제대상이 될 수 있습니다.</li>
            <li>중복된 소환사 계정은 등록될 수 없습니다.</li>
            <li>등록 해제 버튼을 누를시 등록된 소환사 계정을 삭제합니다.</li>
            <li>
              라인 아이콘을 눌러 본인의 주 라인포지션으로 변경 할 수
              있습니다(TOP/JUNGLE/MID/ADC/SUPPORT).
            </li>
          </ul>
        </div>
      </section>

      <section id="item-manage" className="scroll-mt-[80px]">
        <h3
          className={`font-bold mb-[12px] ${
            isMobile ? "text-[16px]" : "text-[18px]"
          } text-gray-800 dark:text-gray-200`}
        >
          {profileToc[2].title}
        </h3>

        <div
          className={`p-[16px] rounded-[8px] bg-gray-50 dark:bg-black border border-gray-100 dark:border-branddarkborder flex flex-col gap-[12px] ${
            isMobile ? "text-[13px]" : "text-[15px]"
          } text-gray-700 dark:text-gray-400`}
        >
          <p className="font-bold">아이템 관리 방법</p>

          <p className="text-gray-700 dark:text-gray-400 text-[13px] md:text-[14px]">
            상점에서 구매한 롤파이트 프로필 치장 아이템을 관리 할 수 있습니다.{" "}
            <br />
            사용을 원하는 아이템을 클릭시 적용되며 적용된 아이템을 클릭시
            비할성화 됩니다.
          </p>
          <Image
            src="/guide/profile/profile-item.png"
            alt="아이템 관리"
            width={600}
            height={600}
          />
        </div>
      </section>
    </>
  );
}

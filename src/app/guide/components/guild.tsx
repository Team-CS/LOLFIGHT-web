import Image from "next/image";

interface GuildGuideProps {
  isMobile: boolean;
}

export const guildToc = [
  { id: "overview", title: "길드란?" },
  { id: "create", title: "1. 길드 생성" },
  { id: "join", title: "2. 길드 가입" },
  { id: "manage", title: "3. 길드 관리" },
  { id: "leave", title: "4. 길드 탈퇴 및 해체" },
];

export default function GuildGuide({ isMobile }: GuildGuideProps) {
  return (
    <>
      {/* 길드란? */}
      <section id="overview" className="scroll-mt-[80px]">
        <h3
          className={`font-bold mb-[12px] ${
            isMobile ? "text-[16px]" : "text-[18px]"
          } text-gray-800 dark:text-gray-200`}
        >
          {guildToc[0].title}
        </h3>

        <div className="p-[16px] rounded-[8px] bg-gray-50 dark:bg-black border border-gray-100 dark:border-branddarkborder">
          <p
            className={`leading-relaxed ${
              isMobile ? "text-[13px]" : "text-[15px]"
            } text-gray-700 dark:text-gray-400`}
          >
            길드는 유저 간의 협업과 경쟁을 위한 커뮤니티 시스템입니다. 길드에
            가입하면 다른 길드와의 스크림을 진행할수 있습니다.
          </p>
        </div>
      </section>

      {/* 길드 생성 */}
      <section id="create" className="scroll-mt-[80px]">
        <h3
          className={`font-bold mb-[12px] ${
            isMobile ? "text-[16px]" : "text-[18px]"
          } text-gray-800 dark:text-gray-200`}
        >
          {guildToc[1].title}
        </h3>

        <div
          className={`p-[16px] rounded-[8px] bg-gray-50 dark:bg-black border border-gray-100 dark:border-branddarkborder flex flex-col gap-[12px] ${
            isMobile ? "text-[13px]" : "text-[15px]"
          } text-gray-700 dark:text-gray-400`}
        >
          <p>
            길드는 로그인 후 <span className="font-bold">내정보-길드</span>
            탭에서 생성 가능합니다.
          </p>
          <Image
            src="/guide/guild/guild-create.png"
            alt="길드 생성"
            width={600}
            height={600}
          />
          <ul className="list-disc pl-[18px] flex flex-col gap-[6px] text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px]">
            <li>부적절한 길드명과 길드 이미지는 제재 대상이 될 수 있습니다.</li>
            <li>길드 이미지와 길드 명은 변경할 수 없습니다.</li>
          </ul>
        </div>
      </section>

      {/* 길드 가입 */}
      <section id="join" className="scroll-mt-[80px]">
        <h3
          className={`font-bold mb-[12px] ${
            isMobile ? "text-[16px]" : "text-[18px]"
          } text-gray-800 dark:text-gray-200`}
        >
          {guildToc[2].title}
        </h3>

        <div
          className={`p-[16px] rounded-[8px] bg-gray-50 dark:bg-black border border-gray-100 dark:border-branddarkborder flex flex-col gap-[12px] ${
            isMobile ? "text-[13px]" : "text-[15px]"
          } text-gray-700 dark:text-gray-400`}
        >
          <p className="font-bold">가입 신청 방법</p>
          <p className="text-gray-700 dark:text-gray-400 text-[13px] md:text-[14px]">
            이미 존재하는 길드에 가입 신청을 할 수 있으며, 길드장의 승인 후
            가입이 완료됩니다. <br />
          </p>

          <ul className="list-decimal pl-[18px] text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px] flex flex-col gap-[6px]">
            <li>
              상단의 <span className="font-bold">리그</span> 버튼을 클릭후
              목록에서 가입할 길드를 선택합니다.
            </li>
            <li>가입 신청 버튼을 클릭합니다.</li>
            <li>길드장이 승인하면 가입 완료됩니다.</li>
          </ul>

          <p className="font-bold">가입 수락 방법</p>
          <p className="text-gray-700 dark:text-gray-400 text-[13px] md:text-[14px]">
            <span className="font-bold">내정보-길드</span> 탭으로 이동후{" "}
            <span className="font-bold">가입신청자</span> 탭에서 신청한 멤버의
            목록을 확인할 수 있습니다.
          </p>
          <Image
            src="/guide/guild/guild-accept.png"
            alt="길드 신청"
            width={600}
            height={600}
          />

          <ul className="list-decimal pl-[18px] text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px] flex flex-col gap-[6px]">
            <li>가입 신청할 멤버를 클릭합니다.</li>
            <li>신청서를 확인후 수락 또는 거절하면 가입절차가 종료됩니다.</li>
          </ul>
        </div>
      </section>

      {/* 길드 관리 */}
      <section id="manage" className="scroll-mt-[80px]">
        <h3
          className={`font-bold mb-[12px] ${
            isMobile ? "text-[16px]" : "text-[18px]"
          } text-gray-800 dark:text-gray-200`}
        >
          {guildToc[3].title}
        </h3>

        <div
          className={`p-[16px] rounded-[8px] bg-gray-50 dark:bg-black border border-gray-100 dark:border-branddarkborder flex flex-col gap-[12px] ${
            isMobile ? "text-[13px]" : "text-[15px]"
          } text-gray-700 dark:text-gray-400`}
        >
          <p className="text-gray-700 dark:text-gray-400 text-[13px] md:text-[15px]">
            길드장은 길드원 관리, 가입 승인, 길드 설정 변경 등의 권한을
            가집니다.
          </p>

          <p className="font-bold">길드 배너 및 소개 변경</p>
          <p className="text-gray-700 dark:text-gray-400 text-[13px] md:text-[14px]">
            <span className="font-bold">내정보-길드</span> 탭으로 이동후{" "}
            <span className="font-bold">길드 배너</span> 탭에서 길드 배너와
            소개를 수정할 수 있습니다.
          </p>

          <p className="font-bold">길드원 관리</p>
          <p className="text-gray-700 dark:text-gray-400 text-[13px] md:text-[14px]">
            <span className="font-bold">내정보-길드</span> 탭으로 이동후{" "}
            <span className="font-bold">길드원</span> 탭에서 길드원 목록을
            확인하고 관리할 수 있습니다.
          </p>

          <ul className="list-decimal pl-[18px] text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px] flex flex-col gap-[6px]">
            <li>길드원 목록에서 관리할 길드원을 마우스 오른쪽 클릭합니다.</li>
            <li>
              추방 또는 길드마스터 변경버튼을 눌러 해당 작업을 수행합니다.
            </li>
          </ul>
        </div>
      </section>

      {/* 길드 탈퇴 */}
      <section id="leave" className="scroll-mt-[80px]">
        <h3
          className={`font-bold mb-[12px] ${
            isMobile ? "text-[16px]" : "text-[18px]"
          } text-gray-800 dark:text-gray-200`}
        >
          {guildToc[4].title}
        </h3>

        <div
          className={`p-[16px] rounded-[8px] bg-gray-50 dark:bg-black border border-gray-100 dark:border-branddarkborder flex flex-col gap-[12px] ${
            isMobile ? "text-[13px]" : "text-[15px]"
          } text-gray-700 dark:text-gray-400`}
        >
          <p className="font-bold">길드 탈퇴</p>
          <p className="text-gray-700 dark:text-gray-400 text-[13px] md:text-[14px]">
            <span className="font-bold">내정보-길드</span> 탭으로 이동후{" "}
            <span className="font-bold">길드 탈퇴</span> 버튼을 클릭하면 길드를
            탈퇴할 수 있습니다.
          </p>

          <p className="font-bold">길드 해체</p>
          <p className="text-gray-700 dark:text-gray-400 text-[13px] md:text-[14px]">
            <span className="font-bold">내정보-길드</span> 탭으로 이동후{" "}
            <span className="font-bold">길드 해체</span> 버튼을 클릭하면 길드를
            해체할 수 있습니다.
          </p>

          {/* 주의 박스 */}
          <div className="p-[12px] rounded-[6px] bg-red-50 dark:bg-[#1a0000] border border-red-200 dark:border-red-800">
            <p className="text-[12px] text-red-600 dark:text-red-400">
              ⚠️ 길드의 스크림 팀에 속해있을 경우 탈퇴 또는 해체가 불가능합니다.
              스크림 팀을 해체 또는 탈퇴 후 길드 탈퇴를 진행해주세요.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

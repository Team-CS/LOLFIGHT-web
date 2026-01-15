import Image from "next/image";

interface ScrimGuideProps {
  isMobile: boolean;
}

export const scrimToc = [
  { id: "overview", title: "롤파이트 스크림 / 길드전" },
  { id: "create", title: "1. 길드 팀 생성 / 가입 / 탈퇴 " },
  { id: "slot", title: "2. 스크림 대기팀 등록" },
  { id: "application", title: "3. 스크림 신청" },
  { id: "process", title: "4. 스크림 진행 방식" },
];

export default function ScrimGuide({ isMobile }: ScrimGuideProps) {
  return (
    <>
      {/* 길드란? */}
      <section id="overview" className="scroll-mt-[80px]">
        <h3
          className={`font-bold mb-[12px] ${
            isMobile ? "text-[16px]" : "text-[18px]"
          } text-gray-800 dark:text-gray-200`}
        >
          {scrimToc[0].title}
        </h3>

        <div className="p-[16px] rounded-[8px] bg-gray-50 dark:bg-black border border-gray-100 dark:border-branddarkborder flex flex-col gap-[12px]">
          <p
            className={`leading-relaxed ${
              isMobile ? "text-[13px]" : "text-[15px]"
            } text-gray-700 dark:text-gray-400`}
          >
            롤파이트 스크림은 길드에 소속된 멤버들이 팀을 구성하여, 다른 길드의
            팀과 정해진 규칙 아래에서 대전을 진행하는
            <span className="font-bold"> 길드 대항전 시스템</span>입니다.
          </p>

          <p
            className={`leading-relaxed ${
              isMobile ? "text-[13px]" : "text-[15px]"
            } text-gray-700 dark:text-gray-400`}
          >
            스크림은 다음과 같은 흐름으로 진행됩니다.
          </p>

          <ol className="list-decimal pl-[18px] flex flex-col gap-[6px] text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px]">
            <li>
              길드원이 길드 내에서 스크림 팀을 생성하거나 기존 팀에 참여합니다.
            </li>
            <li>
              팀이 구성되면 다른 길드의 스크림 팀과 대전을 신청하거나 신청을
              수락합니다.
            </li>
            <li>매칭이 성사되면 지정된 시간에 대전이 진행됩니다.</li>
            <li>
              대전 결과에 따라 승패가 기록되며, 길드 및 팀의 전적에 반영됩니다.
            </li>
          </ol>

          <p
            className={`leading-relaxed ${
              isMobile ? "text-[13px]" : "text-[15px]"
            } text-gray-700 dark:text-gray-400`}
          >
            이를 통해 길드원들은 단순한 개인 플레이가 아닌, 팀 단위의 전략과
            협업을 통해 다른 길드와 실력을 겨루게 됩니다.
          </p>

          <div className="mb-3 p-[12px] rounded-[6px] bg-blue-50 dark:bg-[#000d1a] border border-blue-200 dark:border-blue-900">
            <div className="flex flex-col gap-1">
              <p className="text-[13px] font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                ℹ️ 스크림 관련 안내사항
              </p>
              <ul className="list-disc list-inside text-[12px] text-blue-600 dark:text-blue-400 space-y-0.5 ml-1">
                <li>
                  롤파이트 사이트 알림 설정이 꺼져 있다면 스크림 수락/거절에
                  대한 알림을 받지 못합니다.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="create" className="scroll-mt-[80px]">
        <h3
          className={`font-bold mb-[12px] ${
            isMobile ? "text-[16px]" : "text-[18px]"
          } text-gray-800 dark:text-gray-200`}
        >
          {scrimToc[1].title}
        </h3>

        <div
          className={`p-[16px] rounded-[8px] bg-gray-50 dark:bg-black border border-gray-100 dark:border-branddarkborder flex flex-col gap-[12px] ${
            isMobile ? "text-[13px]" : "text-[15px]"
          } text-gray-700 dark:text-gray-400`}
        >
          <p>
            길드 팀은 로그인 후 상단의 <span className="font-bold">스크림</span>
            페이지로 이동 후 생성 가능합니다.
          </p>

          <p className="font-bold">길드 팀 생성 방법</p>
          <p>
            길드원이라면 누구든지 길드 팀을 생성할 수 있습니다. <br /> 길드 팀을
            생성할때는 꼭 5명이 아니더라도 생성할 수 있으며, 이후 팀 수정에서
            추가적인 길드팀 관리가 가능합니다.
          </p>
          <Image
            src="/guide/scrim/scrim-team-create.png"
            alt="길드 팀 생성"
            width={600}
            height={600}
          />
          <ul className="list-decimal pl-[18px] text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px] flex flex-col gap-[6px]">
            <li>
              좌측의 포지션을 클릭한 후 목록에서 우측의 길드원 목록에서 멤버를
              클릭합니다.
            </li>
            <li>팀 생성을 눌러 팀을 생성합니다.</li>
            <li>초대를 받은 멤버가 수락을 하면 팀에 합류하게 됩니다.</li>
          </ul>

          <p className="font-bold">길드 팀 수정 방법</p>
          <p>
            생성된 길드 팀에서 팀 멤버를 수정 할 수 있습니다. <br /> X 버튼을
            눌러 기존 팀 멤버를 제외할 수 있으며, 초대중인 멤버를 취소할수
            있습니다. <br /> 새롭게 수정된 팀 멤버에게 초대장이 발송되며, 수락을
            하면 팀에 합류하게 됩니다.
          </p>
          <Image
            src="/guide/scrim/scrim-team-setting.png"
            alt="길드 팀 수정"
            width={600}
            height={600}
          />
          <ul className="list-decimal pl-[18px] text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px] flex flex-col gap-[6px]">
            <li>
              좌측의 포지션을 클릭한 후 목록에서 우측의 길드원 목록에서 멤버를
              클릭합니다. <br /> 또는 X 버튼을 눌러 기존 팀 멤버를 제외할 수
              있습니다.
            </li>
            <li>팀 생성을 눌러 팀을 수정합니다.</li>
            <li>초대를 받은 멤버가 수락을 하면 팀에 합류하게 됩니다.</li>
          </ul>

          <p className="font-bold">길드 팀 가입 방법</p>
          <p>
            팀 리더가 멤버에게 포지션 제안을 보내면, 멤버는 해당 제안을 수락하여
            팀에 합류할 수 있습니다. 로그인후 상단의{" "}
            <span className="font-bold">본인 프로필 옆 종 아이콘</span>을 클릭후
            <span className="font-bold"> 알림</span> 페이지로 이동하여 제안을
            확인할 수 있습니다.
          </p>

          <Image
            src="/guide/scrim/scrim-team-invite.png"
            alt="길드 팀 초대"
            width={600}
            height={600}
          />

          <p className="font-bold">길드 팀 탈퇴 / 삭제 방법</p>
          <p>
            상단의 <span className="font-bold">스크림</span> 페이지로 이동 후
            <span className="font-bold">팀 탈퇴 </span>을 클릭후 탈퇴 / 삭제가
            가능합니다.
          </p>
          <div className="p-[12px] rounded-[6px] bg-red-50 dark:bg-[#1a0000] border border-red-200 dark:border-red-800">
            <div className="flex flex-col gap-2">
              <p className="text-[13px] font-bold text-red-600 dark:text-red-400">
                ⚠️ 길드 팀 탈퇴 및 해체 시 주의사항
              </p>
              <ul className="list-disc list-inside text-[12px] text-red-600 dark:text-red-400 space-y-1">
                <li>
                  <strong>팀 탈퇴:</strong> 탈퇴 시 본인이 참여 중인 모든
                  스크림(호스트/참여) 스케줄이{" "}
                  <strong>자동 취소 및 삭제</strong>됩니다.
                </li>
                <li>
                  <strong>팀 해체:</strong> 진행 중이거나 대기 중인 스크림 슬롯,
                  또는 신청 내역이 있을 경우{" "}
                  <strong>팀을 해체할 수 없습니다.</strong>
                </li>
                <li>
                  모든 스크림 일정을 완료하거나 취소한 후에 팀 탈퇴 및 길드
                  탈퇴를 진행해 주세요.
                </li>
                <li>
                  스크림 일정을 완료하기전 취소 / 탈퇴한 팀의 길드에 점수 제제가
                  있습니다.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="slot" className="scroll-mt-[80px]">
        <h3
          className={`font-bold mb-[12px] ${
            isMobile ? "text-[16px]" : "text-[18px]"
          } text-gray-800 dark:text-gray-200`}
        >
          {scrimToc[2].title}
        </h3>

        <div
          className={`p-[16px] rounded-[8px] bg-gray-50 dark:bg-black border border-gray-100 dark:border-branddarkborder flex flex-col gap-[12px] ${
            isMobile ? "text-[13px]" : "text-[15px]"
          } text-gray-700 dark:text-gray-400`}
        >
          <p className="font-bold">스크림 팀 등록 방법</p>
          <p className="text-gray-700 dark:text-gray-400 text-[13px] md:text-[14px]">
            팀의 모든 포지션에 멤버가 채워지면 스크림 대기팀으로 등록할 수
            있습니다. <br /> 상단의 <span className="font-bold">스크림</span>
            페이지로 이동 후 <span className="font-bold">등록</span>
            버튼을 클릭합니다.
          </p>

          <Image
            src="/guide/scrim/scrim-slot-create.png"
            alt="스크림 대기 등록"
            width={300}
            height={300}
          />

          <ul className="list-disc pl-[18px] flex flex-col gap-[6px] text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px]">
            <li>
              일시, 스크림 희망사항, 스크림 횟수를 작성한 후 등록버튼을
              클릭합니다.
            </li>
          </ul>

          <Image
            src="/guide/scrim/scrim-application.png"
            alt="스크림 신청 수락"
            width={600}
            height={600}
          />
          <ul className="list-disc pl-[18px] flex flex-col gap-[6px] text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px]">
            <li>
              이후 알림 페이지에서 스크림 신청 목록들을 확인하고 수락 또는
              거절할 수 있습니다.
            </li>
          </ul>
        </div>
      </section>

      <section id="application" className="scroll-mt-[80px]">
        <h3
          className={`font-bold mb-[12px] ${
            isMobile ? "text-[16px]" : "text-[18px]"
          } text-gray-800 dark:text-gray-200`}
        >
          {scrimToc[3].title}
        </h3>

        <div
          className={`p-[16px] rounded-[8px] bg-gray-50 dark:bg-black border border-gray-100 dark:border-branddarkborder flex flex-col gap-[12px] ${
            isMobile ? "text-[13px]" : "text-[15px]"
          } text-gray-700 dark:text-gray-400`}
        >
          <p className="text-gray-700 dark:text-gray-400 text-[13px] md:text-[14px]">
            팀의 모든 포지션에 멤버가 채워지면 스크림 대기중인 팀에게 스크림을
            신청할 수 있습니다. <br /> 상단의{" "}
            <span className="font-bold">스크림</span>
            페이지로 이동 후 스크림 대기팀 목록중 팀을 선택하여{" "}
            <span className="font-bold">신청</span>
            버튼을 클릭합니다.
          </p>

          <ul className="list-disc pl-[18px] text-gray-600 dark:text-gray-400 text-[13px] md:text-[14px] flex flex-col gap-[6px]">
            <li>
              알림 페이지에서 신청한 스크림에 대한 상태를 확인할 수 있습니다.
            </li>
            <li>
              스크림 페이지에서 신청한 스크림의 진행상태를 확인할 수 있습니다.
            </li>
          </ul>

          <div className="mb-3 p-[12px] rounded-[6px] bg-blue-50 dark:bg-[#000d1a] border border-blue-200 dark:border-blue-900">
            <div className="flex flex-col gap-1">
              <p className="text-[13px] font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                ℹ️ 스크림 신청 시 안내사항
              </p>
              <ul className="list-disc list-inside text-[12px] text-blue-600 dark:text-blue-400 space-y-0.5 ml-1">
                <li>같은 길드에 소속된 팀끼리는 스크림 신청이 불가능합니다.</li>
                <li>진행 중인 일정이 있다면 팀원들과 상의 후 진행해 주세요.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="scroll-mt-[80px]">
        <h3
          className={`font-bold mb-[12px] ${
            isMobile ? "text-[16px]" : "text-[18px]"
          } text-gray-800 dark:text-gray-200`}
        >
          {scrimToc[4].title}
        </h3>

        <div
          className={`p-[16px] rounded-[8px] bg-gray-50 dark:bg-black border border-gray-100 dark:border-branddarkborder flex flex-col gap-[12px] ${
            isMobile ? "text-[13px]" : "text-[15px]"
          } text-gray-700 dark:text-gray-400`}
        >
          <p className="font-bold">스크림 진행</p>
          <div className="flex flex-col gap-4">
            {/* 이용 안내 섹션 */}
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[14px] leading-relaxed">
                • 스크림 신청-수락 완료 시{" "}
                <span className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-2">
                  스크림 &gt; 스크림 일정 및 최근 기록
                </span>
                에서 확인할 수 있습니다.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[14px] leading-relaxed">
                • 스크림 코드는 예정 시간{" "}
                <span className="text-amber-600 dark:text-amber-500 font-bold">
                  10분 전
                </span>
                부터 열람이 가능합니다.
              </p>
            </div>

            {/* 상태별 안내 (박스 처리로 시인성 확보) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* 완료 상태 */}
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-gray-700">
                <p className="text-[13px] font-bold mb-1 text-green-600 dark:text-green-400">
                  ✅ 상태: 종료
                </p>
                <p className="text-[12px] text-gray-600 dark:text-gray-400">
                  정상 완료된 상태입니다. 탈퇴/삭제 시에도{" "}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    점수가 정상 반영
                  </span>
                  되며 불이익이 없습니다.
                </p>
              </div>

              {/* 대기 상태 */}
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-gray-700">
                <p className="text-[13px] font-bold mb-1 text-amber-600 dark:text-amber-500">
                  ⏳ 상태: 대기중
                </p>
                <p className="text-[12px] text-gray-600 dark:text-gray-400">
                  아직 진행되지 않은 상태입니다. 탈퇴/삭제 시{" "}
                  <span className="font-semibold text-red-500">
                    길드 점수 제재
                  </span>
                  가 발생할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
          <Image
            src="/guide/scrim/scrim-log.png"
            alt="스크림 일정"
            width={400}
            height={400}
          />
          <p className="font-bold">스크림 입장 방법</p>
          <p className="text-gray-700 dark:text-gray-400 text-[13px] md:text-[14px]">
            스크림 예정 시간 10분 전부터 스크림 입장 코드를 확인할 수 있습니다.{" "}
            <br /> 스롤 클라이언트에서 코드를 입력하여 입장할 수 있습니다.
          </p>
          <Image
            src="/guide/scrim/scrim-tournament-code.png"
            alt="스크림 입장 코드"
            width={300}
            height={300}
          />
          <p className="text-gray-700 dark:text-gray-400 text-[13px] md:text-[14px]">
            입장코드는 롤 클라이언트 실행후 게임시작 버튼을 누른후에 나오는
            트로피 버튼을 클릭하면 나오는 모달창에 입력하면 자동으로 커스텀 방에
            입장하게 됩니다.
          </p>
          <Image
            src="/guide/scrim/scrim-tournament-input.png"
            alt="입장 코드 입력"
            width={500}
            height={500}
          />
          {/* 주의 박스 */}
          <div className="p-[12px] rounded-[6px] bg-red-50 dark:bg-[#1a0000] border border-red-200 dark:border-red-800">
            <p className="text-[12px] text-red-600 dark:text-red-400">
              ⚠️ 반드시 토너먼트 입장 코드로 입장해야 하며, 5vs5 인원수를
              충족하며 일반 커스텀 방으로는 기록되지 않습니다.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

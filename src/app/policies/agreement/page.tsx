import React from "react";

export default function Page() {
  return (
    <div className="w-full h-full my-[64px]">
      <div className="max-w-[1200px] mx-auto p-[12px] rounded-[12px] bg-brandbgcolor dark:bg-dark">
        <div className="privacy-header py-[12px] border-b-[2px] border-black dark:border-white">
          <p className="text-[32px] font-extrabold">롤파이트 이용약관</p>
        </div>
        <div className="font-light">
          <div className="flex flex-col py-[8px] gap-[20px]">
            <div>
              <p className="font-semibold">제1조 - 목적</p>
              <p>
                본 약관은 lolfight.kr-이하 LOLFIGHT라 합니다가 제공하는 정보제공
                서비스-이하 서비스라 합니다의 이용과 관련하여 LOLFIGHT와
                회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을
                목적으로 합니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">제2조 - 회원의 정의</p>
              <p>
                ① 회원이란 LOLFIGHT가 제공하는 서비스에 접속하여 본 약관에 따라
                LOLFIGHT의 이용절차에 동의하고 서비스를 이용하는 이용자를
                말합니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">제3조 - 회원 가입</p>
              <p>
                ① 회원이 되고자 하는 자는 LOLFIGHT가 정한 양식에 따라 정보를
                기입하고 동의, 확인 등의 버튼을 눌러 회원 가입을 신청합니다.
              </p>
              <p>
                ② LOLFIGHT는 제1항에 따라 회원 가입 신청을 한 자가 아래 각 호에
                해당하지 않는 한 회원으로 등록합니다.
              </p>
              <p className="pl-[8px]">
                1. 등록 내용에 허위, 기재 누락, 오기가 있는 경우
                <br />
                2. 과거 이용 제한 또는 정지 경험이 있는 경우
                <br />
                3. 기타 서비스 운영 및 기술상 문제가 있다고 판단되는 경우
              </p>
              <p>
                ③ 회원가입 계약은 LOLFIGHT의 승낙이 가입신청자에게 도달한 시점에
                성립합니다.
              </p>
              <p>④ 회원은 정보 변경 시 즉시 정정하여 기재해야 합니다.</p>
            </div>

            <div>
              <p className="font-semibold">제4조 - 서비스 제공 및 변경</p>
              <p>① LOLFIGHT는 회원에게 다음 서비스를 제공합니다.</p>
              <p className="pl-[8px]">
                1. 게임 전적 검색 서비스
                <br />
                2. 게임 통계 서비스
                <br />
                3. 투표를 통해 엄선된 영상 링크 제공
                <br />
                4. 기타 LOLFIGHT가 제공하는 서비스
              </p>
            </div>

            <div>
              <p className="font-semibold">제5조 - 서비스 중단</p>
              <p>
                ① LOLFIGHT는 정보통신설비 보수, 교체, 고장 등의 경우 서비스
                제공을 일시 중단할 수 있으며, 새로운 서비스 교체 또는 중단
                권한을 가집니다.
              </p>
              <p>
                ② 불가항력적 사유로 인한 중단(시스템 장애, 다운 등)은 사전 공지
                없이 가능하며, 책임을 지지 않습니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">제6조 - 회원 탈퇴 및 자격 상실</p>
              <p>
                ① 회원은 언제든지 탈퇴를 요청할 수 있으며, LOLFIGHT는 절차를
                안내합니다.
              </p>
              <p>② 탈퇴 시 게시물은 삭제되지 않을 수 있습니다.</p>
              <p>
                ③ 회원이 약관 위반 시, 또는 1년 이상 로그인 기록이 없을 시,
                LOLFIGHT는 회원 자격을 제한·정지·상실시킬 수 있습니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">제7조 - 회원 통지</p>
              <p>① 회원 통지는 등록된 이메일 또는 게시판 공지를 통해 합니다.</p>
            </div>

            <div>
              <p className="font-semibold">제8조 - 개인정보</p>
              <p>
                LOLFIGHT는 관련 법령에 따라 회원의 개인정보를 수집 및 이용하며,
                상세 내용은 개인정보처리방침에 따릅니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">제9조 - LOLFIGHT 의무</p>
              <p>
                ① LOLFIGHT는 관련 법령을 준수하며 서비스를 안정적으로
                제공합니다.
              </p>
              <p>
                ② 회원에게 손해가 발생하더라도 고의·중과실이 아닌 경우 책임은
                제한됩니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">
                제10조 - 회원의 ID 및 비밀번호 의무
              </p>
              <p>① 회원은 자신의 ID와 비밀번호를 안전하게 관리해야 합니다.</p>
              <p>
                ② 제3자 이용 허용 금지 및 도난 시 즉시 LOLFIGHT에 통보해야
                합니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">제11조 - 회원 의무</p>
              <p>
                ① 회원은 약관 위반, 타인 권리 침해, 불법 게시물 등록 등 행위를
                해서는 안됩니다.
              </p>
              <p className="pl-[8px]">
                위반 시, LOLFIGHT는 회원의 서비스 이용 제한·정지·삭제 권한을
                가집니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">제12조 - 게시물 삭제 및 이용 제한</p>
              <p>
                ① 회원 게시물이 법적 문제, 음란물, 권리 침해 등인 경우
                LOLFIGHT는 게시물 접근 제한·삭제 권한을 갖습니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">제13조 - 저작권</p>
              <p>
                ① 서비스 내 저작물 및 회원 게시물 이용은 LOLFIGHT 허락 없이
                금지됩니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">제14조 - 광고 및 거래</p>
              <p>
                ① 서비스 운영, 광고 수익, 제휴 거래에 대한 권한은 LOLFIGHT에
                있습니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">제15조 - 약관 개정</p>
              <p>
                ① LOLFIGHT는 관련법 준수 범위 내에서 약관을 개정할 수 있으며,
                회원에게 불리할 경우 30일 전 공지합니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">제16조 - 재판관할</p>
              <p>
                ① 서비스 이용 관련 분쟁은 대한민국 법을 적용하며, 대한민국 법원
                관할로 합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

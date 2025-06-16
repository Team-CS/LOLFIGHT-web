"use client";
import { giveMailCode, sendMailAuth } from "@/src/api/mail.api";
import { signUp } from "@/src/api/auth.api";
import { MailDTO } from "@/src/common/DTOs/mail/mail.dto";
import { MemberDTO } from "@/src/common/DTOs/member/member.dto";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { isCancel } from "axios";

const SignUpComponent = () => {
  const router = useRouter();
  const [reissuance, setReissuance] = useState(false);
  const [remainingTime, setRemainingTime] = useState("03:00");
  const [timer, setTimer] = useState(180);
  const [showVerification, setShowVerification] = useState(false);
  const [showInputMemberInfo, setshowInputMemberInfo] = useState(false);
  const [buttonText, setButtonText] = useState("인증하기");
  const [checkPassword, setCheckPassword] = useState("");
  const [viewPassword, setViewPassword] = useState(false);
  const [viewCheckPassword, setViewCheckPassword] = useState(false);
  const [mail, setMail] = useState<MailDTO>({
    id: "",
    mailAddr: "",
    mailCode: "",
    mailStatus: "",
  });
  const [member, setMember] = useState<MemberDTO>({
    id: "",
    memberId: "",
    memberPw: "",
    memberName: "",
    memberIcon: "",
    memberGuild: null,
    memberGame: null,
  });
  const [ischecked, setIsChecked] = useState<boolean>(false);
  3;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // 타이머 표시 함수
  const formatTime = (seconds: number): string => {
    if (seconds <= 0) {
      return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showVerification) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            clearInterval(interval);
            setMail({
              ...mail,
              mailCode: "",
            });
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showVerification, reissuance]);

  // 타이머 갱신 시간 갱신
  useEffect(() => {
    setRemainingTime(formatTime(timer));
  }, [timer]);

  const sendAuthCode = () => {
    setReissuance(!reissuance);
    giveMailCode(mail); //메일 확인 코드발급 API
    setTimer(180);
  };

  const handledCheckedAgree = () => {
    setIsChecked(!ischecked);
  };

  //==============================================================//
  //Email
  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMail({
      ...mail,
      mailAddr: e.target.value,
    });

    setMember({
      ...member,
      memberId: e.target.value,
    });
  };

  const isEmailValid = (email: string): boolean => {
    // @와 최소한 하나의 도메인이 포함된 이메일 주소 패턴
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const handleCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMail({
      ...mail,
      mailCode: e.target.value,
    });
  };

  //Nickname
  const handleNickNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMember({
      ...member,
      memberName: e.target.value,
    });
  };
  //Password
  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMember({
      ...member,
      memberPw: e.target.value,
    });
  };
  //PasswordCheck
  const handlePasswordCheckInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckPassword(e.target.value.toString());
  };
  //==============================================================//

  const handleViewPassword = () => {
    setViewPassword(!viewPassword);
  };

  const handleViewCheckPassword = () => {
    setViewCheckPassword(!viewCheckPassword);
  };

  const handleButtonClick = () => {
    if (buttonText === "인증하기") {
      if (!isEmailValid(mail.mailAddr)) {
        CustomAlert("warning", "회원가입", "올바른 이메일 형식이 아닙니다");
        return;
      }
      giveMailCode(mail); //메일 확인 코드발급 API
      setShowVerification(!showVerification);
      setButtonText(showVerification ? "인증하기" : "인증확인");
    } else if (buttonText === "인증확인") {
      sendMailAuth(mail).then((response) => {
        if (response.data === true) {
          setButtonText("회원가입");
          setshowInputMemberInfo(true);
        } else if (mail.mailCode === "") {
          CustomAlert("warning", "회원가입", "인증코드를 입력해주세요.");
          return;
        } else {
          CustomAlert("warning", "회원가입", "인증코드가 틀렸습니다.");
          return;
        }
      }); //메일 인증코드 전송 API
    } else if (buttonText === "회원가입") {
      if (
        member.memberId === "" ||
        member.memberName === "" ||
        member.memberPw === ""
      ) {
        CustomAlert("warning", "회원가입", "모든정보를 작성해주세요.");
        return;
      }
      if (
        member.memberName.length < 1 ||
        member.memberName.length > 10 ||
        /\s/.test(member.memberName)
      ) {
        CustomAlert(
          "warning",
          "회원가입",
          "닉네임은 2글자 이상 10글자 이하로 작성하고 공백을 포함하지 않아야 합니다."
        );
        return;
      }
      if (member.memberPw.length < 8) {
        CustomAlert(
          "warning",
          "회원가입",
          "비밀번호는 8글자 이상 작성해주세요."
        );
        return;
      }
      if (ischecked === false) {
        CustomAlert(
          "warning",
          "회원가입",
          "개인정보 수집 및 동의에 확인 해주세요."
        );
        return;
      }
      if (member.memberPw === checkPassword) {
        signUp(member)
          .then((response) => {
            CustomAlert(
              "success",
              "회원가입",
              "성공적으로 회원가입을 완료했습니다."
            );
            router.push("/register");
          })
          .catch((error) => {
            CustomAlert(
              "warning",
              "회원가입",
              "동일한 이메일이 존재하거나, 동일한 닉네임이 존재합니다"
            );
            router.push("/register");
          }); //회원가입 API
      } else {
        CustomAlert("warning", "회원가입", "비밀번호를 확인해주세요.");
        return;
      }
    }
  };

  return (
    <>
      <span className="text-32px mb-4">
        회원정보를 <p />
        입력해주세요
      </span>
      <div className="w-full">
        <div className="border border-gray-200 rounded-md my-4 dark:border-gray-700">
          <input
            className="w-full h-12 rounded-md px-2 bg-gray-100 dark:bg-gray-900"
            type="text"
            placeholder="이메일"
            onChange={handleEmailInput}
            disabled={buttonText === "인증확인" || buttonText === "회원가입"}
            style={{
              backgroundColor:
                buttonText === "인증확인" || buttonText === "회원가입"
                  ? document.documentElement.classList.contains("dark")
                    ? "#111519"
                    : "#e0e0e0"
                  : undefined,
            }}
          />
        </div>
        {showVerification && (
          <div className="flex border border-gray-200 rounded-md my-4 dark:border-gray-700">
            <input
              className="w-full h-12 rounded-l-md px-2 bg-gray-100 dark:bg-gray-900"
              type="text"
              placeholder={`인증번호(${remainingTime} 남음)`}
              onChange={handleCodeInput}
              disabled={buttonText === "회원가입"}
              style={{
                backgroundColor:
                  buttonText === "회원가입"
                    ? document.documentElement.classList.contains("dark")
                      ? "#111519"
                      : "#e0e0e0"
                    : undefined,
              }}
            />
            <button
              disabled={buttonText === "회원가입"}
              style={{
                cursor: buttonText === "회원가입" ? "not-allowed" : "pointer",
              }}
              onClick={sendAuthCode}
              className={`flex font-medium bg-brandcolor text-white items-center justify-center rounded-r-md cursor-pointer w-32 ${
                showInputMemberInfo ? "" : ""
              }`}
            >
              재발급
            </button>
          </div>
        )}
        {showInputMemberInfo && (
          <div>
            <div className="border border-gray-200 rounded-md my-4 dark:border-gray-700">
              <input
                className="w-full h-12 rounded-md px-2 bg-gray-100 dark:bg-gray-900"
                type="text"
                placeholder="닉네임"
                onChange={handleNickNameInput}
              />
            </div>
            <div className="border border-gray-200 rounded-md my-4 dark:border-gray-700 relative">
              <input
                className="w-full h-12 rounded-md px-2 bg-gray-100 dark:bg-gray-900"
                type={viewPassword ? "" : "password"}
                placeholder="비밀번호"
                onChange={handlePasswordInput}
              />
              {viewPassword ? (
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#9e9e9e"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#FFFFFF]"
                  onClick={handleViewPassword}
                >
                  <path
                    d="M3 13C6.6 5 17.4 5 21 13"
                    stroke="#9e9e9e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"
                    stroke="#9e9e9e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              ) : (
                <svg
                  width="25px"
                  height="25px"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#9e9e9e"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={handleViewPassword}
                >
                  <path
                    d="M19.5 16L17.0248 12.6038"
                    stroke="#9e9e9e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M12 17.5V14"
                    stroke="#9e9e9e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M4.5 16L6.96895 12.6124"
                    stroke="#9e9e9e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M3 8C6.6 16 17.4 16 21 8"
                    stroke="#9e9e9e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              )}
            </div>
            <div className="border border-gray-200 rounded-md my-4 dark:border-gray-700 relative">
              <input
                className="w-full h-12 rounded-md px-2 bg-gray-100 dark:bg-gray-900"
                type={viewCheckPassword ? "text" : "password"}
                placeholder="비밀번호 확인"
                onChange={handlePasswordCheckInput}
              />
              {viewCheckPassword ? (
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#9e9e9e"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#FFFFFF]"
                  onClick={handleViewCheckPassword}
                >
                  <path
                    d="M3 13C6.6 5 17.4 5 21 13"
                    stroke="#9e9e9e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"
                    stroke="#9e9e9e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              ) : (
                <svg
                  width="25px"
                  height="25px"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#9e9e9e"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={handleViewCheckPassword}
                >
                  <path
                    d="M19.5 16L17.0248 12.6038"
                    stroke="#9e9e9e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M12 17.5V14"
                    stroke="#9e9e9e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M4.5 16L6.96895 12.6124"
                    stroke="#9e9e9e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M3 8C6.6 16 17.4 16 21 8"
                    stroke="#9e9e9e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              )}
            </div>

            <div className="flex my-4 gap-1 items-center">
              <input
                type="checkbox"
                checked={ischecked}
                onChange={handledCheckedAgree}
              />
              <p>개인정보 수집 및 이용동의</p>
              <p
                className="text-xs text-gray-500 cursor-pointer"
                onClick={onOpen}
              >
                상세내용
              </p>
              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                className="bg-white text-black dark:text-white dark:bg-branddark border rounded-md h-525px overflow-y-scroll"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        개인정보 수집 및 이용동의
                      </ModalHeader>
                      <ModalBody>
                        <p>
                          1. 수집하는 개인정보 항목 <br />
                          (1) 회사는 최초 회원 가입시 원활한 고객상담, 서비스
                          제공을 위해 아래와 같은 최소한의 개인정보를
                          필수항목으로 수집하고 있습니다. 개인 회원: 서명,
                          이메일 주소, 비밀번호 SNS 회원: 성명, 이메일 주소 법인
                          회원: 성명, 이메일, 비밀번호, 법인명, 부서명,
                          핸드폰번호 (또는 회사 전화번호) <br />
                          <br />
                          (2) 서비스 이용 과정이나 사업처리 과정에서 아래와 같은
                          정보들이 추가로 수집 될 수 있습니다. 요금 결제:
                          유료서비스 이용에 대한 과금, 구매 <br />① 개인정보:
                          성명, 이메일, 생년월일 <br />② 결제정보: - 카드 결제:
                          마스킹 된 카드정보, 유효기간, 비밀번호 앞 두 자리 -
                          가상 계좌: 가상 계좌번호, 전화번호, 이메일 주소
                          <br /> ③ 요금정산: 기업명, 담당자 정보(이름, 연락처,
                          이메일 주소) 서비스 이용 정보: IP 주소, 쿠키, 방문
                          일시, 서비스 이용 기록, 불량 이용 기록, 브라우저 정보,
                          운영체제 정보(OS), 사용 기기 정보, MAC 주소, 방문 일시
                          등
                        </p>
                        <br />
                        <p>
                          2. 개인정보의 처리 목적
                          <br /> 회사가 각각의 경우에 관계법령에 따라 다음의
                          목적을 위하여 개인정보를 처리합니다. 처리하고 있는
                          개인정보는 다음의 목적 이외의 용도로는 이용되지
                          않으며, 이용 목적이 변경되는 경우에는 「개인정보
                          보호법」 제18조에 따라 별도의 동의를 받는 등 필요한
                          조치를 이행 합니다. <br />
                          <br />
                          (1) 회원관리 - 개인식별, 회원제 서비스 제공
                          <br /> - 가입 의사 확인 및 회원 가입 <br />- 이용약관
                          위반 회원에 대한 이용제한 조치 및 서비스 부정이용 행위
                          제재
                          <br /> - 분쟁 조정을 위한 기록보존, 불만처리 등
                          민원처리
                          <br /> - 회원탈퇴 의사의 확인 <br />- 무료 체험 서비스
                          제공에 따른 이용자 식별 및 인증 <br />- 유료 서비스
                          전환에 따른 고객 관리 목적 등 <br />- 기타 상품 안내,
                          도입 문의 안내 등<br /> - 신규 서비스 개발 및 서비스
                          개선 <br />- 통계학적 특성에 따른 서비스 제공 및 광고
                          게재
                          <br /> - 서비스의 유효성 확인 <br />- 접속빈도 파악{" "}
                          <br />- 회원의 서비스 이용에 대한 통계 분석 등 <br />
                          <br />
                          (2) 서비스 제공에 관한 계약 이행 및 유료서비스 제공에
                          따른 요금정산
                          <br /> - 전자서명 서비스 및 콘텐츠 제공 <br />-
                          유료서비스 이용에 대한 과금, 구매 및 요금 결제,
                          본인인증, 물품 배송 또는 청구서 등 발송, 요금추심 등
                          <br />
                          <br />
                          (3) 법적 증거로 활용 <br />- 법적 분쟁 시 증거자료
                          제출 등
                          <br />
                          <br />
                          (4) 위탁사 요청에 의한 처리
                          <br /> - 위탁사 요청에 의한 서비스 이용 시 개인정보
                          수집 처리
                        </p>
                        <br />
                        <p>
                          3. 개인정보의 보유 및 이용기간 회사는 이용자로부터
                          개인정보를 수집하는 경우 서비스 이용기간 동안
                          개인정보를 이용∙보관함을 원칙으로 합니다. 다만, 혜택
                          중복 방지 차원의 회원 탈퇴 후 30일 간 보관 후
                          파기하며, 개인정보 위수탁 관계에 의한 처리 시 위탁사의
                          요청에 따라 기간 내 저장 후 파기합니다. 또한, 회사는
                          관계법령의 규정 및 회사 내부 방침에 의하여 개인정보를
                          보존할 필요가 있는 경우 아래와 같이 일정한 기간 동안
                          해당 개인 정보를 보관합니다. 관계 법령 및 보관기간
                          <br />
                          <br /> ① 전자상거래 등에서의 소비자보호에 관한 법률
                          <br /> - 계약 또는 청약 철회, 대금결제 및 재화 등의
                          공급에 관한 기록 : 5년 <br />- 소비자의 불만 또는 분쟁
                          처리에 관한 기록 : 3년 <br />- 표시·광고에 관한 기록 :
                          6개월
                          <br /> ② 통신비밀보호법 <br />- 웹사이트 방문 기록 :
                          3개월
                        </p>
                        <br />
                        <p>
                          4. 개인정보 수집 이용 동의 거부권 및 불이익 내용
                          정보주체는 개인정보 수집, 이용에 동의하지 않을 권리가
                          있으며, 동의를 거부할 경우 서비스 이용에 제한이 있을
                          수 있습니다.
                        </p>
                      </ModalBody>
                      <ModalFooter>
                        <Button onPress={onClose}>닫기</Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          </div>
        )}

        <div className="border-b w-full dark:border-gray-700"></div>
        <button
          onClick={handleButtonClick}
          className="flex font-medium bg-brandcolor text-white h-10 items-center justify-center rounded-md cursor-pointer my-4 w-full my-1"
        >
          {buttonText}
        </button>
      </div>
    </>
  );
};

export default SignUpComponent;

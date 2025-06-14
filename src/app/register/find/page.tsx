"use client";
import { MailDTO } from "@/src/common/DTOs/mail/mail.dto";
import { MemberDTO } from "@/src/common/DTOs/member/member.dto";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CustomAlert from "../../../common/components/alert/CustomAlert";
import { giveMailCode, sendMailAuth } from "@/src/api/mail.api";
import { findMember, update } from "@/src/api/member.api";
import { findPassword } from "@/src/api/auth.api";

export default function Page() {
  const router = useRouter();
  const [timer, setTimer] = useState(180);
  const [reissuance, setReissuance] = useState(false);
  const [remainingTime, setRemainingTime] = useState("03:00");
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

  //==============================================================////Email
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
        CustomAlert(
          "warning",
          "비밀번호 변경",
          "올바른 이메일 형식이 아닙니다"
        );
        return;
      }
      findPassword(mail.mailAddr)
        .then((response) => {
          localStorage.setItem("accessToken", response.data.accessToken);
          giveMailCode(mail); //메일 확인 코드발급 API
          setShowVerification(!showVerification);
          setButtonText(showVerification ? "인증하기" : "인증확인");
        })
        .catch((error) => {
          CustomAlert(
            "warning",
            "비밀번호 변경",
            "존재하지 않는 이메일입니다."
          );
        });
    } else if (buttonText === "인증확인") {
      sendMailAuth(mail)
        .then((response) => {
          if (response.data === true) {
            setButtonText("비밀번호 변경");
            setshowInputMemberInfo(true);
          } else if (mail.mailCode === "") {
            CustomAlert("warning", "비밀번호 변경", "인증코드를 입력해주세요.");
            return;
          } else {
            CustomAlert("warning", "비밀번호 변경", "인증코드가 틀렸습니다.");
            return;
          }
        }) //메일 인증코드 전송 API
        .catch((error) => {
          CustomAlert("warning", "비밀번호 변경", "에러");
        });
    } else if (buttonText === "비밀번호 변경") {
      if (member.memberId === "" || member.memberPw === "") {
        CustomAlert("warning", "비밀번호 변경", "모든정보를 작성해주세요.");
        return;
      }
      if (member.memberPw.length < 8) {
        CustomAlert(
          "warning",
          "비밀번호 변경",
          "비밀번호는 8글자 이상 작성해주세요."
        );
        return;
      }
      if (member.memberPw === checkPassword) {
        update(
          member.id,
          member.memberId,
          member.memberPw,
          member.memberName,
          member.memberGuild,
          member.memberGame
        )
          .then((response) => {
            CustomAlert(
              "success",
              "비밀번호 변경",
              "성공적으로 비밀번호 변경을 완료했습니다."
            );
            router.push("/register");
          })
          .catch((error) => {
            CustomAlert(
              "warning",
              "비밀번호 변경",
              "동일한 이메일이 존재합니다."
            );
            router.push("/register");
          }); //비밀번호 변경 API
      } else {
        CustomAlert("warning", "비밀번호 변경", "비밀번호를 확인해주세요.");
        return;
      }
    }
  };

  return (
    <>
      <span className="text-32px mb-4">
        이메일을 <p />
        입력해주세요
      </span>
      <div className="w-full">
        <div className="border border-gray-200 rounded-md my-4 dark:border-gray-700">
          <input
            className="w-full h-12 rounded-md px-2 bg-gray-100 dark:bg-gray-900"
            type="text"
            placeholder="이메일"
            onChange={handleEmailInput}
            disabled={
              buttonText === "인증확인" || buttonText === "비밀번호 변경"
            }
            style={{
              backgroundColor:
                buttonText === "인증확인" || buttonText === "비밀번호 변경"
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
              className={`flex font-medium bg-brandcolor text-white  items-center justify-center rounded-r-md cursor-pointer w-32 ${
                showInputMemberInfo ? "" : ""
              }`}
            >
              재발급
            </button>
          </div>
        )}
        {showInputMemberInfo && (
          <div>
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
                  stroke-width="1.5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#9e9e9e"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#FFFFFF]"
                  onClick={handleViewPassword}
                >
                  <path
                    d="M3 13C6.6 5 17.4 5 21 13"
                    stroke="#9e9e9e"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"
                    stroke="#9e9e9e"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
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
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M12 17.5V14"
                    stroke="#9e9e9e"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M4.5 16L6.96895 12.6124"
                    stroke="#9e9e9e"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M3 8C6.6 16 17.4 16 21 8"
                    stroke="#9e9e9e"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
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
                  stroke-width="1.5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#9e9e9e"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#FFFFFF]"
                  onClick={handleViewCheckPassword}
                >
                  <path
                    d="M3 13C6.6 5 17.4 5 21 13"
                    stroke="#9e9e9e"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"
                    stroke="#9e9e9e"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
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
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M12 17.5V14"
                    stroke="#9e9e9e"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M4.5 16L6.96895 12.6124"
                    stroke="#9e9e9e"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M3 8C6.6 16 17.4 16 21 8"
                    stroke="#9e9e9e"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              )}
            </div>
          </div>
        )}

        <div className="border-b w-full"></div>
        <button
          onClick={handleButtonClick}
          className="flex font-medium bg-brandcolor text-white h-10 items-center justify-center rounded-md cursor-pointer my-4 w-full my-1"
        >
          {buttonText}
        </button>
      </div>
    </>
  );
}

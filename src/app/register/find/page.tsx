"use client";
import { MailDTO } from "@/src/common/DTOs/mail/mail.dto";
import { MemberDTO } from "@/src/common/DTOs/member/member.dto";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CustomAlert from "../../../common/components/alert/CustomAlert";
import { giveMailCode, resetPassword, sendMailAuth } from "@/src/api/mail.api";
import { updatePassword } from "@/src/api/member.api";
import { useMemberStore } from "@/src/common/zustand/member.zustand";

export default function Page() {
  const router = useRouter();
  const [timer, setTimer] = useState(180);
  const [reissuance, setReissuance] = useState(false);
  const [remainingTime, setRemainingTime] = useState("03:00");

  const [showVerification, setShowVerification] = useState(false);

  const [buttonText, setButtonText] = useState("인증하기");

  const [mail, setMail] = useState<MailDTO>({
    id: "",
    mailAddr: "",
    mailCode: "",
    mailStatus: "",
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
  //==============================================================//

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
      giveMailCode(mail); //메일 확인 코드발급 API
      setShowVerification(!showVerification);
      setButtonText(showVerification ? "인증하기" : "인증확인");
    } else if (buttonText === "인증확인") {
      sendMailAuth(mail)
        .then((response) => {
          if (response.data === true) {
            resetPassword(mail);
            CustomAlert(
              "success",
              "비밀번호 변경",
              "이메일로 초기화된 임시 비밀번호를 전송했습니다."
            );
            router.replace("/");
          } else if (mail.mailCode === "") {
            CustomAlert("warning", "비밀번호 변경", "인증코드를 입력해주세요.");
            return;
          } else {
            CustomAlert("warning", "비밀번호 변경", "인증코드가 틀렸습니다.");
            return;
          }
        })
        .catch((error) => {
          CustomAlert("warning", "비밀번호 변경", "에러");
        });
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
            disabled={buttonText === "인증확인"}
            style={{
              backgroundColor:
                buttonText === "인증확인"
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
              style={{
                backgroundColor: document.documentElement.classList.contains(
                  "dark"
                )
                  ? "#111519"
                  : "#e0e0e0",
              }}
            />
            <button
              onClick={sendAuthCode}
              className={`flex font-medium bg-brandcolor text-white  items-center justify-center rounded-r-md cursor-pointer w-32 `}
            >
              재발급
            </button>
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

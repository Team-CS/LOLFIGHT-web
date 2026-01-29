"use client";
import { useState } from "react";
import CustomAlert from "../../../common/components/alert/CustomAlert";
import { deleteMember } from "@/src/api/member.api";
import { useRouter } from "next/navigation";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { removeCookie } from "@/src/utils/cookie/cookie";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

const WithdrawalPage = () => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const { member, setMember } = useMemberStore();
  const isMobile = useIsMobile();

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const handleWithdrawal = () => {
    if (checked) {
      deleteMember()
        .then((response) => {
          setMember(null);
          removeCookie("lf_atk");
          removeCookie("lf_rtk");
          localStorage.clear();
          sessionStorage.clear();
          router.replace("/");
          CustomAlert(
            "success",
            "회원탈퇴",
            "회원 탈퇴가 성공적으로 마무리 되었습니다.",
          );
        })
        .catch((error) => {
          if (error.response.data.code === "COMMON-009") {
            CustomAlert(
              "error",
              "회원탈퇴",
              "가입된 길드가 있는지 확인해주세요.",
            );
          } else {
            CustomAlert("error", "회원탈퇴", "에러");
          }
        });
    } else {
      CustomAlert(
        "warning",
        "회원탈퇴",
        "주의사항 확인 체크를 활성화 시켜주십시오.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-[20px] p-[20px]">
      {/* 헤더 카드 */}
      <div className="w-full rounded-[16px] bg-white dark:bg-branddark border dark:border-branddarkborder shadow-lg overflow-hidden">
        <div className="flex items-center gap-[12px] px-[24px] py-[20px] bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/30">
          <div>
            <p
              className={`font-bold text-red-600 dark:text-red-400 ${isMobile ? "text-[18px]" : "text-[22px]"}`}
            >
              회원 탈퇴
            </p>
            <p className="text-[13px] text-red-500/70 dark:text-red-400/70">
              탈퇴 전 아래 주의사항을 꼭 확인해주세요
            </p>
          </div>
        </div>

        {/* 주의사항 목록 */}
        <div className="p-[24px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex gap-[14px] p-[16px] rounded-[12px] bg-gray-50 dark:bg-gray-800/50">
              <span className="flex items-center justify-center w-[28px] h-[28px] rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[14px] font-bold shrink-0">
                1
              </span>
              <div className="flex flex-col gap-[4px]">
                <span
                  className={`text-gray-800 dark:text-gray-100 font-semibold ${isMobile ? "text-[14px]" : "text-[15px]"}`}
                >
                  정보 유실
                </span>
                <p
                  className={`text-gray-500 dark:text-gray-400 leading-relaxed ${isMobile ? "text-[12px]" : "text-[14px]"}`}
                >
                  회원 탈퇴를 하면 개인 정보와 연결된 모든 데이터가 삭제될 수
                  있습니다. 이는 계정 정보, 프로필 정보, 작성한 게시물 등을
                  포함합니다.
                </p>
              </div>
            </div>

            <div className="flex gap-[14px] p-[16px] rounded-[12px] bg-gray-50 dark:bg-gray-800/50">
              <span className="flex items-center justify-center w-[28px] h-[28px] rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[14px] font-bold shrink-0">
                2
              </span>
              <div className="flex flex-col gap-[4px]">
                <span
                  className={`text-gray-800 dark:text-gray-100 font-semibold ${isMobile ? "text-[14px]" : "text-[15px]"}`}
                >
                  계정 접근 권한
                </span>
                <p
                  className={`text-gray-500 dark:text-gray-400 leading-relaxed ${isMobile ? "text-[12px]" : "text-[14px]"}`}
                >
                  회원 탈퇴를 하면 해당 계정으로 로그인하여 접근할 수 없게
                  됩니다. 따라서 탈퇴 전에 필요한 정보를 백업하거나 필요한
                  작업을 모두 완료했는지 확인해야 합니다.
                </p>
              </div>
            </div>

            <div className="flex gap-[14px] p-[16px] rounded-[12px] bg-gray-50 dark:bg-gray-800/50">
              <span className="flex items-center justify-center w-[28px] h-[28px] rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[14px] font-bold shrink-0">
                3
              </span>
              <div className="flex flex-col gap-[4px]">
                <span
                  className={`text-gray-800 dark:text-gray-100 font-semibold ${isMobile ? "text-[14px]" : "text-[15px]"}`}
                >
                  서비스 이용 중단
                </span>
                <p
                  className={`text-gray-500 dark:text-gray-400 leading-relaxed ${isMobile ? "text-[12px]" : "text-[14px]"}`}
                >
                  회원 탈퇴 후에는 해당 서비스를 더 이상 이용할 수 없게 됩니다.
                  이는 해당 서비스의 모든 기능 및 혜택을 포기해야 함을
                  의미합니다.
                </p>
              </div>
            </div>

            <div className="flex gap-[14px] p-[16px] rounded-[12px] bg-gray-50 dark:bg-gray-800/50">
              <span className="flex items-center justify-center w-[28px] h-[28px] rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[14px] font-bold shrink-0">
                4
              </span>
              <div className="flex flex-col gap-[4px]">
                <span
                  className={`text-gray-800 dark:text-gray-100 font-semibold ${isMobile ? "text-[14px]" : "text-[15px]"}`}
                >
                  계정 재사용 불가능
                </span>
                <p
                  className={`text-gray-500 dark:text-gray-400 leading-relaxed ${isMobile ? "text-[12px]" : "text-[14px]"}`}
                >
                  회원 탈퇴 후에는 동일한 이메일 주소나 사용자 이름으로 계정을
                  다시 생성할 수 없습니다. 따라서 탈퇴하기 전에 재가입을 원하는
                  경우를 고려해야 합니다.
                </p>
              </div>
            </div>

            <div className="flex gap-[14px] p-[16px] rounded-[12px] bg-gray-50 dark:bg-gray-800/50">
              <span className="flex items-center justify-center w-[28px] h-[28px] rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[14px] font-bold shrink-0">
                5
              </span>
              <div className="flex flex-col gap-[4px]">
                <span
                  className={`text-gray-800 dark:text-gray-100 font-semibold ${isMobile ? "text-[14px]" : "text-[15px]"}`}
                >
                  서비스 연관성
                </span>
                <p
                  className={`text-gray-500 dark:text-gray-400 leading-relaxed ${isMobile ? "text-[12px]" : "text-[14px]"}`}
                >
                  회원 탈퇴 시 해당 서비스의 모든 연관된 기능 및 서비스에 대한
                  접근 권한이 상실될 수 있습니다. 이는 예를 들어 온라인
                  커뮤니티의 경우 게시물 작성 및 댓글 달기와 같은 활동에도
                  영향을 줄 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 체크박스 및 버튼 */}
          <div
            className="flex flex-col items-center gap-[20px] pt-[24px] border-t border-gray-200 dark:border-branddarkborder"
            style={{ marginTop: "24px" }}
          >
            <label
              className={`flex items-center gap-[10px] cursor-pointer select-none ${
                isMobile ? "text-[14px]" : "text-[15px]"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={handleCheckboxChange}
                className="w-[18px] h-[18px] accent-red-500 cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                주의사항을 모두 확인하였습니다.
              </span>
            </label>

            <button
              className={`bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-[10px] transition-colors ${
                isMobile
                  ? "px-[24px] py-[12px] text-[14px]"
                  : "px-[32px] py-[14px] text-[16px]"
              }`}
              onClick={handleWithdrawal}
              disabled={!checked}
            >
              <span className="text-white font-semibold">회원탈퇴</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalPage;

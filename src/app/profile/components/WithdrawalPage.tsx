"use client";
import { MemberDto } from "@/src/common/DTOs/member/member.dto";
import { Checkbox } from "@nextui-org/react";
import { useState } from "react";
import CustomAlert from "../../../common/components/alert/CustomAlert";
import { deleteMember } from "@/src/api/member.api";
import { useRouter } from "next/navigation";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { removeCookie } from "@/src/utils/cookie/cookie";

const WithdrawalPage = () => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const { member, setMember } = useMemberStore();

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const handleWithdrawal = () => {
    if (checked) {
      deleteMember(member!.memberId)
        .then((response) => {
          setMember(null);
          removeCookie("lf_atk");
          removeCookie("lf_rtk");
          router.push("/");
          CustomAlert(
            "success",
            "회원탈퇴",
            "회원 탈퇴가 성공적으로 마무리 되었습니다."
          );
        })
        .catch((error) => {
          if (error.response.data.code === "COMMON-009") {
            CustomAlert(
              "error",
              "회원탈퇴",
              "가입된 길드가 있는지 확인해주세요."
            );
          } else {
            CustomAlert("error", "회원탈퇴", "에러");
          }
        });
    } else {
      CustomAlert(
        "warning",
        "회원탈퇴",
        "주의사항 확인 체크를 활성화 시켜주십시오."
      );
    }
  };

  return (
    <div className="flex flex-col p-[16px] gap-[24px]">
      <div className="flex justify-between items-center pb-5 border-b border-gray-200 dark:border-branddarkborder">
        <p className="text-[24px] font-bold">회원 탈퇴</p>
      </div>
      <div className="flex flex-col items-center gap-[12px]">
        <div className="flex flex-col gap-[14px] p-[12px]">
          <div>
            <span className="text-sky-950 dark:text-sky-700 font-bold">
              1. 정보 유실
            </span>
            <p className="text-sm">
              회원 탈퇴를 하면 개인 정보와 연결된 모든 데이터가 삭제될 수
              있습니다. 이는 계정 정보, 프로필 정보, 작성한 게시물 등을
              포함합니다.
            </p>
          </div>
          <div>
            <span className="text-sky-950 dark:text-sky-700 font-bold">
              2. 계정 접근 권한
            </span>
            <p className="text-sm">
              회원 탈퇴를 하면 해당 계정으로 로그인하여 접근할 수 없게 됩니다.
              따라서 탈퇴 전에 필요한 정보를 백업하거나 필요한 작업을 모두
              완료했는지 확인해야 합니다.
            </p>
          </div>
          <div>
            <span className="text-sky-950 dark:text-sky-700 font-bold">
              3. 서비스 이용 중단
            </span>
            <p className="text-sm">
              회원 탈퇴 후에는 해당 서비스를 더 이상 이용할 수 없게 됩니다. 이는
              해당 서비스의 모든 기능 및 혜택을 포기해야 함을 의미합니다
            </p>
          </div>
          <div>
            <span className="text-sky-950 dark:text-sky-700 font-bold">
              4. 계정 재사용 불가능
            </span>
            <p className="text-sm">
              회원 탈퇴 후에는 동일한 이메일 주소나 사용자 이름으로 계정을 다시
              생성할 수 없습니다. 따라서 탈퇴하기 전에 재가입을 원하는 경우를
              고려해야 합니다.
            </p>
          </div>
          <div>
            <span className="text-sky-950 dark:text-sky-700 font-bold">
              5. 서비스 연관성
            </span>
            <p className="text-sm">
              회원 탈퇴 시 해당 서비스의 모든 연관된 기능 및 서비스에 대한 접근
              권한이 상실될 수 있습니다. 이는 예를 들어 온라인 커뮤니티의 경우
              게시물 작성 및 댓글 달기와 같은 활동에도 영향을 줄 수 있습니다.
            </p>
          </div>
        </div>

        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
          />
          주의사항을 모두 확인하였습니다.
        </label>

        <button
          className="w-40 bg-red-500 rounded p-2"
          onClick={handleWithdrawal}
        >
          <p className="text-white font-extrabold tracking-widest">회원탈퇴</p>
        </button>
      </div>
    </div>
  );
};

export default WithdrawalPage;

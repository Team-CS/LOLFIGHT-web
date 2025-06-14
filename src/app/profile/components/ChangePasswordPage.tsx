import { MemberDTO } from "@/src/common/DTOs/member/member.dto";
import { useState } from "react";
import CustomAlert from "../../../common/components/alert/CustomAlert";
import { update } from "@/src/api/member.api";
import { authLogin } from "@/src/api/auth.api";
import { useRouter } from "next/navigation";
import { useMemberStore } from "@/src/common/zustand/member.zustand";

const ChangePasswordPage = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const { member, setMember } = useMemberStore();

  const handleCurrentPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };
  const handleNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };
  const handleChangeButton = () => {
    if (currentPassword && newPassword) {
      authLogin(member!.memberId, currentPassword)
        .then((response) => {
          if (newPassword.length < 8) {
            CustomAlert(
              "warning",
              "비밀번호 변경",
              "비밀번호는 8글자 이상 작성해주세요."
            );
            return;
          } else {
            const updateMember: MemberDTO = member!;
            updateMember.memberPw = newPassword;
            update(
              updateMember.id,
              updateMember.memberId,
              updateMember.memberPw,
              updateMember.memberName,
              updateMember.memberGuild,
              updateMember.memberGame
            )
              .then((response) => {
                CustomAlert(
                  "success",
                  "비밀번호 변경",
                  "성공적으로 비밀번호를 변경했습니다."
                );
                sessionStorage.clear();
                router.push("/register");
              })
              .catch((error) => {
                CustomAlert("error", "비밀번호 변경", "에러2");
              });
          }
        })
        .catch((error) => {
          CustomAlert("error", "비밀번호 변경", "비밀번호를 확인해주세요");
        });
    } else {
      CustomAlert("warning", "비밀번호 변경", "정보를 모두 작성해주세요.");
    }
  };
  return (
    <div className="w-1200px h-full mx-auto pt-4">
      <p className="pb-5 text-xl font-normal border-b border-gray-200">
        비밀번호 변경
      </p>
      <div className="flex flex-col  gap-2 py-5 mt-4">
        <div className="flex border-y-2 dark:border-brandgray">
          <div className="flex w-32 bg-brandbgcolor dark:bg-black p-2 justify-center">
            현재 비밀번호
          </div>
          <input
            className="borde-2 p-2 w-full"
            placeholder="현재 비밀번호를 입력하세요."
            type="password"
            onChange={handleCurrentPassword}
          ></input>
        </div>
        <div className="flex border-y-2 dark:border-brandgray">
          <div className="flex w-32 bg-brandbgcolor dark:bg-black p-2 justify-center">
            새 비밀번호
          </div>
          <input
            className="borde-2 p-2 w-full"
            placeholder="새 비밀번호를 입력하세요."
            type="password"
            onChange={handleNewPassword}
          ></input>
        </div>

        <button
          className="w-full bg-brandcolor rounded p-2"
          onClick={handleChangeButton}
        >
          <p className="text-white font-extrabold tracking-widest">
            비밀번호 변경
          </p>
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordPage;

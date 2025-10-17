import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import constant from "@/src/common/constant/constant";
import ButtonAlert from "@/src/common/components/alert/ButtonAlert";
import { JudgmentDto } from "@/src/common/DTOs/judgment/judgment.dto";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { deleteJudgment } from "@/src/api/judgment.api";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { getCookie } from "@/src/utils/cookie/cookie";
import { jwtDecode } from "jwt-decode";
import { ReportModal } from "@/src/common/components/modal/ReportModal";
import { CreateReportDto } from "@/src/common/DTOs/report/report.dto";
import { reportSubmit } from "@/src/api/report.api";

interface JudgmentHeadComponetProps {
  judgment: JudgmentDto;
}

const JudgmentHeadComponet = (props: JudgmentHeadComponetProps) => {
  const { judgment } = props;
  const [isMine, setIsMine] = useState(false);
  const { member } = useMemberStore();
  const isMobile = useIsMobile();
  const router = useRouter();
  const judgmentDateTime = new Date(judgment.createdAt!);
  const year = judgmentDateTime.getFullYear();
  const month = (judgmentDateTime.getMonth() + 1).toString().padStart(2, "0");
  const day = judgmentDateTime.getDate().toString().padStart(2, "0");

  const token = getCookie("lf_atk");
  const isAdmin = token ? (jwtDecode(token) as any)?.role === "ADMIN" : false;

  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (member) {
      if (judgment?.member.memberName === member.memberName) {
        setIsMine(true);
      }
    }
  }, [judgment]);

  const handleDeleteButtonClick = () => {
    const onConfirmDelete = () => {
      deleteJudgment(judgment.id).then((response) => {
        CustomAlert(
          "success",
          "롤로세움 재판 삭제",
          "해당 재판(롤로세움)을 삭제했습니다."
        );
      });
      router.push("/judgment");
    };

    ButtonAlert(
      "롤로세움 재판 삭제",
      "롤로세움을 삭제하시겠습니까?",
      "삭제",
      "닫기",
      onConfirmDelete
    );
  };

  const handleReport = (reason: string) => {
    if (!member) {
      alert("로그인이 필요합니다");
      setReportModalOpen(false);
      return;
    }
    setReportModalOpen(false);
    const reportDto: CreateReportDto = {
      type: "judgment",
      targetId: judgment.id.toString(),
      targetMemberId: judgment.member.id,
      reporterId: member.id,
      reason: reason,
    };
    reportSubmit(reportDto).then((response) => {
      if (response.data.data) {
        CustomAlert(
          "success",
          "신고",
          "신고가 완료되었습니다. \n 빠른 검토 후 조치 취하도록 하겠습니다. \n 감사합니다."
        );
      } else {
        CustomAlert("error", "신고", "에러");
      }
    });
  };

  const handleMemberClick = (name: string) => {
    router.push(`/members/${name}`);
  };

  return (
    <div className="flex flex-col px-[24px] py-[12px] gap-[12px]">
      <span className={`font-bold ${isMobile ? "text-[20px]" : "text-[24px]"}`}>
        {judgment?.judgmentTitle}
      </span>
      <div className=" flex justify-between">
        <div className="flex gap-[8px] items-center">
          <img
            className={`object-cover rounded-[12px] ${
              isMobile ? "w-[25px] h-[25px]" : "w-[30px] h-[30px]"
            }`}
            src={`${constant.SERVER_URL}/${judgment.member.memberIcon}`}
            alt="memberIcon"
          />
          <p
            className={`font-bold dark:text-gray-400 cursor-pointer hover:underline ${
              isMobile ? "text-[14px]" : "text-[16px]"
            }`}
            onClick={() => handleMemberClick(judgment.member.memberName)}
          >
            {judgment?.member.memberName}
          </p>

          <p
            className={`text-gray-400 ${
              isMobile ? "text-[10px]" : "text-[12px]"
            }`}
          >{`${year}.${month}.${day}`}</p>

          <p
            className={`text-gray-400 ${
              isMobile ? "text-[10px]" : "text-[12px]"
            }`}
          >
            조회수 : {judgment?.judgmentView}
          </p>
        </div>
        <div className="flex gap-[8px] justify-center">
          {(!isMine || isAdmin) && (
            <button
              className={`text-gray-400 ${
                isMobile ? "text-[10px]" : "text-[12px]"
              }`}
              onClick={() => setReportModalOpen(!reportModalOpen)}
            >
              신고하기
            </button>
          )}
          {(isMine || isAdmin) && (
            <button
              className={`text-gray-400 ${
                isMobile ? "text-[10px]" : "text-[12px]"
              }`}
              onClick={handleDeleteButtonClick}
            >
              삭제
            </button>
          )}
        </div>
      </div>
      {reportModalOpen && (
        <ReportModal
          onClose={() => setReportModalOpen(false)}
          onSubmit={handleReport}
        />
      )}
    </div>
  );
};

export default JudgmentHeadComponet;

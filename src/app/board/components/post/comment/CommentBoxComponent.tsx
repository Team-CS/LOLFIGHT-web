import { PostDto } from "@/src/common/DTOs/board/post.dto";
import { useEffect, useState } from "react";
import { deleteComment, getCommentList } from "@/src/api/comment.api";
import { CommentDto } from "@/src/common/DTOs/board/comment.dto";
import { writeReplyComment } from "@/src/api/comment.api";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import constant from "@/src/common/constant/constant";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { getCookie } from "@/src/utils/cookie/cookie";
import { jwtDecode } from "jwt-decode";
import { ReportModal } from "@/src/common/components/modal/ReportModal";
import { CreateReportDto } from "@/src/common/DTOs/report/report.dto";
import { reportSubmit } from "@/src/api/report.api";
import { useRouter } from "next/navigation";

interface CommentBoxComponentProps {
  data: PostDto;
}

const CommentBoxComponent = (props: CommentBoxComponentProps) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [commentList, setCommentList] = useState<CommentDto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openCommentId, setOpenCommentId] = useState<string>("");
  const [replyCommentContent, setReplyCommentContent] = useState("");
  const [refresh, setRefresh] = useState(1);
  const { member } = useMemberStore();

  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [reportTargetComment, setReportTargetComment] = useState<CommentDto>();
  const token = getCookie("lf_atk");
  const isAdmin = token ? (jwtDecode(token) as any)?.role === "ADMIN" : false;

  useEffect(() => {
    if (props.data && props.data.id) {
      getCommentList(props.data).then((res) => {
        setCommentList(res.data.data);
      });
    }
  }, [props.data, refresh]);

  const handleReplyButtonClick = (comment: CommentDto) => {
    setIsOpen(!isOpen); // isOpen 상태를 토글합니다.
    setOpenCommentId(comment.id as string);
  };

  const handleSaveReplyButtonClick = () => {
    if (!member?.id) {
      CustomAlert("info", "답글", "로그인이 필요합니다.");
    } else if (!replyCommentContent || replyCommentContent.trim() === "") {
      CustomAlert("info", "답글", "답글을 작성해주세요");
    } else {
      writeReplyComment(
        props.data,
        member.id,
        replyCommentContent,
        openCommentId
      )
        .then((res) => {
          setRefresh((prev) => prev + 1);

          setIsOpen(false);
          setOpenCommentId("");
          setReplyCommentContent("");
        })
        .catch((error) => {
          const code = error.response.data.code;
          if (code === "COMMON-018") {
            CustomAlert("error", "답글", "부적절한 단어가 포함되어 있습니다.");
          }
        });
    }
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId)
      .then((response) => {
        CustomAlert("success", "댓글 삭제", "삭제 되었습니다.");
        setCommentList((prevList) =>
          prevList.filter((comment) => comment.id !== commentId)
        );
      })
      .catch((error) => {
        const code = error?.response?.data?.code;

        if (code === "COMMON-003") {
          CustomAlert("error", "댓글 삭제", "이미 삭제된 댓글 입니다.");
        } else if (code === "COMMON-002") {
          CustomAlert("error", "댓글 삭제", "본인 댓글만 삭제 가능합니다.");
        } else {
          CustomAlert("error", "댓글 삭제", "에러");
        }
      });
  };

  const handleReport = (reason: string) => {
    if (!member) {
      alert("로그인이 필요합니다");
      setReportModalOpen(false);
      return;
    }
    setReportModalOpen(false);
    if (reportTargetComment) {
      const reportDto: CreateReportDto = {
        type: "comment",
        targetId: reportTargetComment.id!,
        targetMemberId: reportTargetComment.writer.id,
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
    }
  };

  const getDate = (date: string | number | Date) => {
    const today = new Date();
    const commentDateTime = new Date(date);

    const diffMilliseconds = today.getTime() - commentDateTime.getTime();
    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths =
      today.getMonth() -
      commentDateTime.getMonth() +
      12 * (today.getFullYear() - commentDateTime.getFullYear());

    if (
      commentDateTime.getDate() === today.getDate() &&
      commentDateTime.getMonth() === today.getMonth() &&
      commentDateTime.getFullYear() === today.getFullYear()
    ) {
      if (diffMinutes < 60) {
        return `${diffMinutes}분 전`;
      } else if (diffHours < 24) {
        return `${diffHours}시간 전`;
      }
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else if (diffWeeks < 4) {
      return `${diffWeeks}주 전`;
    } else {
      return `${diffMonths}달 전`;
    }
  };

  const getMargin = (depth: number) => {
    return {
      marginLeft: depth > 0 ? "18px" : "0px",
    };
  };

  const handleMemberClick = (name: string) => {
    router.push(`/members/${name}`);
  };

  return (
    <div className="flex flex-col gap-[8px]">
      {commentList.map((comment) => (
        <div
          className="flex p-[8px] border-b dark:border-gray-700"
          key={comment.id}
          style={getMargin(comment.depth)}
        >
          {comment.depth > 0 && (
            <div className="w-[8px] h-[8px] mr-[12px] border-b-[1px] border-l-[1px] border-brandcolor dark:border-white rounded-bl-[2px]" />
          )}
          <div className="flex flex-col w-full gap-[8px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <div
                  className="flex items-center gap-[8px] cursor-pointer hover:underline"
                  onClick={() => handleMemberClick(comment.writer.memberName)}
                >
                  <img
                    className={`object-cover rounded-[12px] ${
                      isMobile ? "w-[25px] h-[25px]" : "w-[30px] h-[30px]"
                    }`}
                    src={`${constant.SERVER_URL}/${comment.writer.memberIcon}`}
                    alt="memberIcon"
                  />
                  <p
                    className={`font-bold ${
                      isMobile ? "text-[12px]" : "text-[14px]"
                    } ${comment.writer.role === "ADMIN" && "text-[#006eff]"}`}
                  >
                    {comment.writer.memberName}
                  </p>
                </div>
                <p
                  className={`text-gray-400 font-normal ${
                    isMobile ? "text-[10px]" : "text-[12px]"
                  }`}
                >
                  {getDate(comment.commentDate)}
                </p>
              </div>
              <div className="flex gap-[8px]">
                {(!(comment.writer.id === member?.id) || isAdmin) && (
                  <button
                    className={`text-gray-400 ${
                      isMobile ? "text-[10px]" : "text-[12px]"
                    }`}
                    onClick={() => {
                      setReportTargetComment(comment),
                        setReportModalOpen(!reportModalOpen);
                    }}
                  >
                    신고하기
                  </button>
                )}
                {(comment.writer.id === member?.id || isAdmin) && (
                  <p
                    className={`text-gray-400 font-normal cursor-pointer hover:text-gray-500 ${
                      isMobile ? "text-[10px]" : "text-[12px]"
                    }`}
                    onClick={() => handleDeleteComment(comment.id!)}
                  >
                    삭제하기
                  </p>
                )}
              </div>
            </div>
            <p
              className={`${isMobile ? "text-[12px]" : "text-[14px]"} ${
                comment.writer.role === "ADMIN" && "font-bold"
              }  whitespace-pre-wrap`}
            >
              {comment.commentContent}
            </p>
            {comment.depth == 0 && (
              <div>
                <button
                  className={`${
                    isMobile ? "text-[12px]" : "text-[14px]"
                  } text-gray-400`}
                  onClick={() => handleReplyButtonClick(comment)}
                >
                  답글 쓰기
                </button>
              </div>
            )}

            {isOpen && comment.id == openCommentId && (
              <div className="flex flex-col p-[24px] gap-[12px]">
                <div className="w-full rounded-md border dark:border-gray-700 dark:bg-black">
                  <textarea
                    className={`w-full p-[12px] rounded-[12px] focus:outline-none dark:bg-black ${
                      isMobile
                        ? "text-[12px] h-[50px]"
                        : "text-[14px] h-[100px]"
                    }`}
                    placeholder="댓글을 입력하세요."
                    onChange={(e) => setReplyCommentContent(e.target.value)}
                  />
                  <div className="flex justify-end p-[12px]">
                    <button
                      className={`border rounded-md bg-brandcolor text-white px-[12px] py-[4px] dark:border-gray-700 ${
                        isMobile ? "text-[12px]" : "text-[14px]"
                      }`}
                      onClick={handleSaveReplyButtonClick}
                    >
                      작성하기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      {reportModalOpen && (
        <ReportModal
          onClose={() => setReportModalOpen(false)}
          onSubmit={handleReport}
        />
      )}
    </div>
  );
};

export default CommentBoxComponent;

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { JudgmentDTO } from "@/src/common/DTOs/judgment/judgment.dto";
import Image from "next/image";
import JudgmentDataCard from "./JudgmentDataCard";
import constant from "@/src/common/constant/constant";
import { getVoteFaction, voteFactionJudgment } from "@/src/api/judgment.api";

interface JudgmentBodyComponentProp {
  judgment: JudgmentDTO;
}

const JudgmentBodyComponent = (props: JudgmentBodyComponentProp) => {
  const router = useRouter();
  const [commentContent, setCommentContent] = useState("");
  const [commentBoxKey, setCommentBoxKey] = useState(0); // State for key prop
  const [like, setLike] = useState<string>("none");

  useEffect(() => {
    const storedId = sessionStorage.getItem("id")?.toString();

    if (storedId) {
      if (props.judgment) {
        getVoteFaction(props.judgment.id, storedId)
          .then((response) => {
            setLike(response.data.data);
          })
          .catch((error) => {
            // console.log(error)
          });
      }
    }
  }, [props.judgment]);

  const handleChangeComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentContent(e.target.value);
  };

  const handleSaveCommentClick = () => {
    const storedId = sessionStorage.getItem("id")?.toString();
    if (!storedId) {
      CustomAlert("info", "댓글", "로그인이 필요합니다");
    } else if (!commentContent || commentContent.trim() === "") {
      CustomAlert("info", "댓글", "댓글을 작성해주세요");
    } else {
      // @todo judgment 댓글 작성
      //   writeComment(props.data, storedId, commentContent).then((res) => {
      //     router.refresh();
      //     setCommentBoxKey((prevKey) => prevKey + 1);
      //     setCommentContent("");
      //     // window.location.reload();
      //   });
    }
  };

  const handleFactionVoteClick = (side: string) => {
    const storedId = sessionStorage.getItem("id")?.toString();
    if (!storedId) {
      CustomAlert("info", "투표", "로그인이 필요합니다");
    } else {
      if (side === "left") {
        voteFactionJudgment("left", props.judgment.id, storedId)
          .then((response) => {
            // console.log(response);
            CustomAlert("success", "투표", "투표가 완료되었습니다.");
            setLike("none");
            window.location.reload();
          })
          .catch((error) => {
            // console.log(error);
            CustomAlert("error", "투표", "에러");
          });
      } else {
        voteFactionJudgment("right", props.judgment.id, storedId)
          .then((response) => {
            // console.log(response);
            CustomAlert("success", "투표", "투표가 완료되었습니다.");
            setLike("none");
            window.location.reload();
          })
          .catch((error) => {
            // console.log(error);
            CustomAlert("error", "투표", "에러");
          });
      }
    }
  };

  return (
    <div className="flex flex-col m-12 gap-12">
      <div className="flex flex-col gap-2">
        <div className="text-[22px] font-bold">재판 상황</div>
        <JudgmentDataCard judgment={props.judgment} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-[22px] font-bold">영상 자료</div>
        {props.judgment?.judgmentVideo ? (
          <video className="w-full max-w-xl rounded-lg shadow-lg" controls>
            <source
              src={`${constant.SERVER_URL}/${props.judgment?.judgmentVideo}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="text-gray-500">영상 자료가 없습니다.</div>
        )}
      </div>

      <div className="flex flex-col gap-2 ">
        <div className="text-[22px] font-bold">상황 설명</div>
        <div className="border rounded-lg p-2">
          {props.judgment?.judgmentDesc}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-[22px] font-bold">투표 하기</div>

        <div className="flex justify-between gap-4">
          <button
            className={`w-1/2 p-2 text-[22px] font-extrabold rounded-lg transition duration-300 ${
              like === "none"
                ? "bg-blue-500 hover:bg-blue-600 text-white "
                : like === "left"
                ? "bg-blue-600 text-white"
                : "bg-gray-500 text-white"
            }`}
            onClick={() => handleFactionVoteClick("left")}
            disabled={like === "right"}
          >
            {like === "left" ? "투표 취소" : "투표"}
          </button>

          <button
            className={`w-1/2 p-2 text-[22px] font-extrabold rounded-lg transition duration-300 ${
              like === "none"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : like === "right"
                ? "bg-red-600 text-white"
                : "bg-gray-500 text-white" // 기본 상태 또는 "left"인 경우
            }`}
            onClick={() => handleFactionVoteClick("right")}
            disabled={like === "left"}
          >
            {like === "right" ? "투표 취소" : "투표"}
          </button>
        </div>
      </div>

      <div className="border-b w-full mt-4 dark:border-gray-700"></div>
      {/* @todo 댓글  */}
      {/* <div className="my-8">댓글 </div> */}
      {/* <CommentBoxComponent
          key={commentBoxKey}
          data={props.data}
        ></CommentBoxComponent>
        <div className="w-full rounded-md px-4 border dark:border-gray-700 dark:bg-black">
          <div className="w-full h-36">
            <input
              className="w-full h-12 focus:outline-none dark:bg-black"
              placeholder="댓글을 입력하세요."
              value={commentContent}
              onChange={handleChangeComment}
            />
          </div>
          <div className="border-b w-full mt-4 dark:border-gray-700"></div>
          <div className="flex justify-end m-2">
            <button
              className="border rounded-md bg-brandcolor text-white w-20 h-8 dark:border-gray-700"
              onClick={handleSaveCommentClick}
            >
              작성하기
            </button>
          </div>
        </div> */}
    </div>
  );
};

export default JudgmentBodyComponent;

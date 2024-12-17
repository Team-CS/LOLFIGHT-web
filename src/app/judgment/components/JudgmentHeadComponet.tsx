import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import constant from "@/src/common/constant/constant";
import ButtonAlert from "@/src/common/components/alert/ButtonAlert";
import { JudgmentDTO } from "@/src/common/DTOs/judgment/judgment.dto";

interface JudgmentHeadComponetProps {
  judgment: JudgmentDTO;
}

const JudgmentHeadComponet = (props: JudgmentHeadComponetProps) => {
  const [isMine, setIsMine] = useState(false);
  const [isImageError, setIsImageError] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const getDate = (date: Date | undefined) => {
    const today = new Date();
    if (date) {
      const postDateTime = new Date(date);

      if (
        postDateTime.getDate() === today.getDate() &&
        postDateTime.getMonth() === today.getMonth() &&
        postDateTime.getFullYear() === today.getFullYear()
      ) {
        const hour = postDateTime.getHours().toString().padStart(2, "0");
        const minute = postDateTime.getMinutes().toString().padStart(2, "0");
        return `${hour}:${minute}`;
      } else {
        const year = postDateTime.getFullYear().toString().padStart(2, "0");
        const month = (postDateTime.getMonth() + 1).toString().padStart(2, "0");
        const day = postDateTime.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    }
  };

  useEffect(() => {
    const storedName = sessionStorage.getItem("memberName")?.toString();

    if (storedName) {
      if (props.judgment?.judgmentWriter === storedName) {
        setIsMine(true);
      }
    }
  }, [props.judgment]);

  const handleDeleteButtonClick = () => {
    const onConfirmDelete = () => {
      // @todo judgment삭제
      //   deletePost(props.post).then((res) => {
      //     CustomAlert("success", "게시글 삭제", "게시글을 삭제했습니다.");
      //   });
      router.replace("/board/free");
    };

    ButtonAlert(
      "게시글 삭제",
      "게시글을 삭제하시겠습니까?",
      "삭제",
      onConfirmDelete
    );
  };

  const handleImageError = () => {
    setIsImageError((prev) => ({
      ...prev,
      [props.judgment?.judgmentWriter]: true,
    }));
  };

  return (
    <div className="flex flex-col m-12">
      <div className="flex justify-between">
        <span className="text-3xl font-bold">
          {props.judgment?.judgmentTitle}
        </span>
      </div>
      <div className="text-sm mt-8 flex justify-between">
        <div className="flex">
          <Image
            className="rounded-full mr-[5px]"
            width={20}
            height={20}
            src={
              isImageError[props.judgment?.judgmentWriter] // 작성자 이름으로 이미지 오류 체크
                ? `${constant.SERVER_URL}/public/default.png`
                : `${constant.SERVER_URL}/public/member/${props.judgment?.judgmentWriter}.png`
            }
            alt="memberIcon"
            onError={(event) => {
              event.preventDefault();
              handleImageError;
            }} // 오류 발생 시 핸들러 호출
            unoptimized
          />
          <span className="text-black dark:text-gray-100">
            {props.judgment?.judgmentWriter}
          </span>

          <span className="mx-1"></span>
          <span className="text-gray-400">
            {getDate(props.judgment?.createdAt)}
          </span>

          <span className="mx-1"></span>

          <span className="text-gray-400">
            조회수 : {props.judgment?.judgmentView}
          </span>
        </div>
        {isMine && (
          <div className="head_btn content-center">
            <button className="text-gray-400" onClick={handleDeleteButtonClick}>
              <span className="p-1">삭제</span>
            </button>
          </div>
        )}
      </div>
      <div className="border-b w-full mt-4 dark:border-gray-700"></div>
    </div>
  );
};

export default JudgmentHeadComponet;

"use client";

import { PostDto } from "@/src/common/DTOs/board/post.dto";
import { useRouter } from "next/navigation";
import boardNavLinks from "@/src/data/boardNavLinks";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

interface BoardInfoComponentProps {
  slug: string;
  data: PostDto;
}

function getSlugFromTitle(title: string) {
  const link = boardNavLinks.find((link) => link.title === title);
  return link?.slug ?? "";
}

const BoardInfoComponent = (props: BoardInfoComponentProps) => {
  const { slug, data } = props;
  const router = useRouter();
  const isMobile = useIsMobile();
  const link = `${slug}/${data.id}`;

  const isAdminWriter = data?.postWriter.role === "ADMIN";

  const handleOnClick = () => {
    if (slug == "all") {
      router.push(getSlugFromTitle(data.postBoard) + "/" + data.id);
    } else {
      router.push(link);
    }
  };

  const getDate = (date: string | number | Date) => {
    const today = new Date();
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
  };

  const containsImage = (content: string) => {
    return /<img\s+[^>]*src=/.test(content);
  };

  const handleMemberClick = (name: string) => {
    router.push(`/members/${name}`);
  };

  return (
    <div className="text-sm h-[32px] flex py-[2px]">
      <div
        className={`w-1/12 truncate flex items-center justify-center ${
          isMobile ? "text-[8px]" : "text-[14px]"
        }`}
      >
        {data.postLikes}
      </div>
      <div className={`w-1/12 flex items-center justify-center text-center`}>
        <p className={`${isMobile ? "truncate text-[10px]" : "text-[14px]"}`}>
          {data.postBoard}
        </p>
      </div>
      <div
        className={`flex pl-[16px] w-1/2 hover:underline hover:decoration-gray-400 hover:decoration-opacity-50`}
      >
        {containsImage(data.postContent) ? (
          <div className="flex items-center justify-center pr-[4px] ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.2"
              stroke="currentColor"
              className={`${
                isMobile ? "w-[15px] h-[15px]" : "w-[20px] h-[20px]"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
              <circle cx="20" cy="5" r="3" fill="red" />
            </svg>
          </div>
        ) : (
          <div className="flex items-center justify-center pr-[4px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.2"
              stroke="currentColor"
              className={`${
                isMobile ? "w-[15px] h-[15px]" : "w-[20px] h-[20px]"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
              <circle cx="20" cy="5" r="3" fill="red" />
            </svg>
          </div>
        )}

        <div className="flex items-center gap-[4px] min-w-0">
          <p
            className={`truncate cursor-pointer hover:decoration-gray-400 hover:decoration-opacity-50 ${
              isMobile
                ? "text-[10px] max-w-[100px]"
                : "text-[14px] max-w-[300px] "
            }`}
            onClick={handleOnClick}
          >
            {data.postTitle}
          </p>
          <span
            className={`text-red-400 ${
              isMobile ? "text-[10px]" : "text-[12px]"
            }`}
          >
            [{data.postComments}]
          </span>
        </div>
      </div>

      <div
        className={`w-2/12 flex items-center justify-center hover:underline cursor-pointer ${
          isMobile ? "text-[8px]" : "text-[14px]"
        } `}
        onClick={() => handleMemberClick(data.postWriter.memberName)}
      >
        <p className={`${data.postWriter.memberItem?.effect}`}>
          {data.postWriter.memberName}
        </p>
        {isAdminWriter && (
          <img
            src="/icon_verificated.svg"
            alt="discord icon"
            width={15}
            height={15}
            draggable={false}
          />
        )}
      </div>
      <div
        className={`w-1/6 flex items-center justify-center ${
          isMobile ? "text-[8px]" : "text-[14px]"
        }`}
      >
        {getDate(data.postDate)}
      </div>
      <div
        className={`w-1/12 flex items-center justify-center ${
          isMobile ? "text-[8px]" : "text-[14px]"
        }`}
      >
        {data.postViews}
      </div>
    </div>
  );
};

export default BoardInfoComponent;

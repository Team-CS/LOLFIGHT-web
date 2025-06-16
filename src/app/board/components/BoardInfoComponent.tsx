"use client";

import { PostDTO } from "@/src/common/DTOs/board/post.dto";
import { useRouter } from "next/navigation";
import boardNavLinks from "@/src/data/boardNavLinks";
import { useState } from "react";

interface BoardInfoComponentProps {
  slug: string;
  data: PostDTO;
}

function getSlugFromTitle(title: string) {
  const link = boardNavLinks.find((link) => link.title === title);
  return link?.slug ?? "";
}

const BoardInfoComponent = (props: BoardInfoComponentProps) => {
  const router = useRouter();
  const link = `${props.slug}/${props.data.id}`;
  // const link = `${props.data.postBoard}/${props.data.id}`;
  const [postDate, setPostDate] = useState<String>();

  const handleOnClick = () => {
    if (props.slug == "all") {
      // router.push(`${props.data.postBoard}/${props.data.id}`);
      router.push(getSlugFromTitle(props.data.postBoard) + "/" + props.data.id);
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
      // return `${postDateTime.getHours()}:${postDateTime.getMinutes()}`;
    } else {
      // const formattedDate = `${postDateTime.getFullYear()}-${
      //   postDateTime.getMonth() + 1
      // }-${postDateTime.getDate()}`;
      const year = postDateTime.getFullYear().toString().padStart(2, "0");
      const month = (postDateTime.getMonth() + 1).toString().padStart(2, "0");
      const day = postDateTime.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  };

  const containsImage = (content: string) => {
    return /<img\s+[^>]*src=/.test(content);
  };

  return (
    <div className="notice-info text-sm h-8 flex mt-1">
      <div className="notice-info__number w-1/12 flex items-center justify-center">
        {props.data.postLikes}
      </div>
      <div className="notice-info__type w-1/12 flex items-center justify-center">
        {props.data.postBoard}
      </div>
      <div className="flex w-1/2 pl-4">
        {containsImage(props.data.postContent) ? (
          <div className="flex items-center justify-center pr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.2"
              stroke="currentColor"
              className="w-5 h-5"
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
          <div className="flex items-center justify-center pr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.2"
              stroke="currentColor"
              className="w-5 h-5"
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
        <div className="flex items-center hover:underline cursor-pointer">
          <a className="notice-info__title" onClick={handleOnClick}>
            {props.data.postTitle}
          </a>
          <a className="notice-info__comment flex items-center text-gray-400">
            [{props.data.postComments}]
          </a>
        </div>
      </div>
      <div className="notice-info__writer w-2/12 flex items-center justify-center">
        {props.data.postWriter}
      </div>
      <div className="notice-info__date w-1/6 flex items-center justify-center">
        {getDate(props.data.postDate)}
      </div>
      <div className="notice-info__views w-1/12 flex items-center justify-center">
        {props.data.postViews}
      </div>
    </div>
  );
};

export default BoardInfoComponent;

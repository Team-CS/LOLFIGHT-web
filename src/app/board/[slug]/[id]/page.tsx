"use client";

import React, { useEffect, useState } from "react";
import { getPostContent } from "@/src/api/post.api";
import BoardNavComponent from "../../components/BoardNavComponent";
import BoardPostComponent from "../../components/post/BoardPostComponent";
import { PostDto } from "@/src/common/DTOs/board/post.dto";
import { notFound } from "next/navigation";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { getTitleFromSlug } from "@/src/utils/string/string.util";

type PageProps = {
  slug: string;
  id: string;
};

export default function Page({ params }: { params: PageProps }) {
  const isMobile = useIsMobile();
  const [post, setPost] = useState<PostDto>();
  const [error, setError] = useState<boolean>();

  useEffect(() => {
    if (!post) {
      getPostContent(getTitleFromSlug(params.slug), params.id)
        .then((res) => {
          setPost(res.data.data);
        })
        .catch((error) => {
          setError(error);
        });
    }
  });

  if (error) {
    notFound();
  }

  return (
    <>
      <div
        className={`flex max-w-[1200px] h-full mx-auto w-full py-[28px] gap-[24px] ${
          isMobile && "flex-col px-[12px]"
        }`}
      >
        <BoardNavComponent></BoardNavComponent>
        <BoardPostComponent data={post as PostDto}></BoardPostComponent>
      </div>
    </>
  );
}

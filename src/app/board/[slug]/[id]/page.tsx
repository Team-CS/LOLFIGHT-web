"use client";

import React, { useEffect, useState } from "react";
import { getPostContent, increaseView } from "@/src/api/post.api";
import BoardNavComponent from "../../components/BoardNavComponent";
import BoardPostComponent from "../../components/post/BoardPostComponent";
import { PostDTO } from "@/src/common/DTOs/board/post.dto";
import boardNavLinks from "@/src/data/boardNavLinks";
import { useRouter } from "next/router";

type PageProps = {
  slug: string;
  id: string;
};

function getTitleFromSlug(slug: string) {
  const link = boardNavLinks.find((link) => link.href === `/board/${slug}`);
  return link?.title ?? "";
}

function getSlugFromTitle(title: string) {
  const link = boardNavLinks.find((link) => link.title === title);
  return link?.slug ?? "";
}

export default function Page({ params }: { params: PageProps }) {
  // const router = useRouter();
  // const { postDTO } = router.query;
  const [post, setPost] = useState<PostDTO>();

  useEffect(() => {
    if (!post) {
      getPostContent(getTitleFromSlug(params.slug), params.id).then((res) => {
        setPost(res.data.data);
      });
    }
  });

  useEffect(() => {
    // console.log(post);
    if (post) {
      increaseView(post);
    }
  }, [post]);

  return (
    <>
      <div className="flex max-w-[1200px] h-full mx-auto w-full py-[28px] gap-[24px]">
        <BoardNavComponent></BoardNavComponent>
        <BoardPostComponent data={post as PostDTO}></BoardPostComponent>
      </div>
    </>
  );
}

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PostDto } from "@/src/common/DTOs/board/post.dto";
import { getPostContent } from "@/src/api/post.api";
import { getTitleFromSlug } from "@/src/utils/string/string.util";
import BoardWriteComponent from "../../../components/write/BoardWriteComponent";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import BoardNavComponent from "../../../components/BoardNavComponent";

const BoardEditPage = () => {
  const params = useParams();
  const { slug, id } = params;
  const { member } = useMemberStore();
  const [post, setPost] = useState<PostDto | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      getPostContent(getTitleFromSlug(slug.toString()), id.toString()).then(
        (res) => {
          const data = res.data.data;
          if (data.postWriter.id !== member?.id) {
            CustomAlert("warning", "게시글 수정", "비정상적인 접근입니다.");
            return router.replace("/");
          }
          setPost(res.data.data);
        }
      );
    }
  }, [id]);

  if (!post)
    return (
      <div className="flex max-w-[1200px] h-full mx-auto w-full py-[28px] gap-[24px] px-[12px] md:px-0 flex-col md:flex-row">
        <BoardNavComponent />
        <div className="w-full flex items-center justify-center py-[60px]">
          <div className="w-[32px] h-[32px] border-[3px] border-brandcolor border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );

  return (
    <div className="flex max-w-[1200px] h-full mx-auto w-full py-[28px] gap-[24px] px-[12px] md:px-0 flex-col md:flex-row">
      <BoardNavComponent />
      <BoardWriteComponent post={post} isEdit={true} />
    </div>
  );
};

export default BoardEditPage;

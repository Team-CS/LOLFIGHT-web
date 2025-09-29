"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PostDto } from "@/src/common/DTOs/board/post.dto";
import { getPostContent } from "@/src/api/post.api";
import { getTitleFromSlug } from "@/src/utils/string/string.util";
import BoardWriteComponent from "../../../components/write/BoardWriteComponent";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import CustomAlert from "@/src/common/components/alert/CustomAlert";

const BoardEditPage = () => {
  const params = useParams();
  const { slug, id } = params;
  const { member } = useMemberStore();
  const [post, setPost] = useState<PostDto | null>(null);
  const isMobile = useIsMobile();
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

  if (!post) return <p>Loading...</p>;

  return (
    <div
      className={`flex max-w-[1200px] h-full mx-auto w-full py-[28px] gap-[24px] ${
        isMobile && "flex-col px-[12px]"
      }`}
    >
      <BoardWriteComponent post={post} isEdit={true} />
    </div>
  );
};

export default BoardEditPage;

import React from "react";
import { getPostContent } from "@/src/api/post.api";
import BoardNavComponent from "../../components/BoardNavComponent";
import BoardPostComponent from "../../components/post/BoardPostComponent";
import { PostDto } from "@/src/common/DTOs/board/post.dto";
import { notFound } from "next/navigation";
import { getTitleFromSlug } from "@/src/utils/string/string.util";
import { Metadata } from "next";
import boardNavLinks from "@/src/data/boardNavLinks";

// 동적 렌더링 강제 (모든 게시글에 대해 동적으로 생성)
export const dynamic = "force-dynamic";

// 메타데이터 캐싱 설정 (메모리 효율성을 위한 캐싱)
export const revalidate = 3600; // 1시간마다 재검증

// 정적 경로 생성 (빌드 시점에 일부 경로만 생성)
export async function generateStaticParams() {
  const staticParams = [];

  // 각 게시판의 첫 번째 페이지들만 정적으로 생성
  for (const link of boardNavLinks) {
    staticParams.push({
      slug: link.slug,
      id: "1", // 첫 번째 게시글 ID
    });
  }

  return staticParams;
}

type PageProps = {
  slug: string;
  id: string;
};

// 동적 메타데이터 생성 (메모리 최적화)
export async function generateMetadata({
  params,
}: {
  params: PageProps;
}): Promise<Metadata> {
  try {
    const post = await getPostContent(getTitleFromSlug(params.slug), params.id);
    const postData = post.data.data;

    // 메모리 효율적인 문자열 처리
    const title = postData.postTitle
      ? `${postData.postTitle} | 롤파이트`
      : "게시글 | 롤파이트";

    // HTML 태그 제거 및 길이 제한으로 메모리 사용량 최적화
    let description =
      "롤파이트(LOLFIGHT) 게시판에서 롤 관련 정보를 공유하고 소통해보세요.";
    if (postData.postContent) {
      const cleanContent = postData.postContent.replace(/<[^>]*>/g, "");
      description =
        cleanContent.length > 160
          ? cleanContent.substring(0, 160) + "..."
          : cleanContent;
    }

    const baseUrl = `https://lolfight.kr/board/${params.slug}/${params.id}`;
    const imageUrl = "https://lolfight.kr/LOLFIGHT_NONE_TEXT.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: baseUrl,
        type: "article",
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: "롤파이트 LOLFIGHT",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: baseUrl,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    // 에러 발생 시 최소한의 메타데이터만 반환하여 메모리 사용량 최소화
    return {
      title: "게시글 | 롤파이트",
      description:
        "롤파이트(LOLFIGHT) 게시판에서 롤 관련 정보를 공유하고 소통해보세요.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function Page({ params }: { params: PageProps }) {
  let post: PostDto;

  try {
    const response = await getPostContent(
      getTitleFromSlug(params.slug),
      params.id
    );
    post = response.data.data;
  } catch (error) {
    notFound();
  }

  return (
    <>
      <div className="flex max-w-[1200px] h-full mx-auto w-full py-[28px] gap-[24px] px-[12px] md:px-0 flex-col md:flex-row">
        <BoardNavComponent></BoardNavComponent>
        <BoardPostComponent data={post}></BoardPostComponent>
      </div>
    </>
  );
}

import React from "react";
import { getPostContent } from "@/src/api/post.api";
import BoardNavComponent from "../../components/BoardNavComponent";
import BoardPostComponent from "../../components/post/BoardPostComponent";
import { PostDto } from "@/src/common/DTOs/board/post.dto";
import { notFound } from "next/navigation";
import { getTitleFromSlug } from "@/src/utils/string/string.util";
import { Metadata } from "next";
import boardNavLinks from "@/src/data/boardNavLinks";

export const dynamic = "force-dynamic";
export const revalidate = 3600;
export async function generateStaticParams() {
  const staticParams = [];
  for (const link of boardNavLinks) {
    staticParams.push({
      slug: link.slug,
      id: "1",
    });
  }
  return staticParams;
}

type PageProps = {
  slug: string;
  id: string;
};

export async function generateMetadata({
  params,
}: {
  params: PageProps;
}): Promise<Metadata> {
  try {
    const post = await getPostContent(getTitleFromSlug(params.slug), params.id);
    const postData = post.data.data;

    const title = postData.postTitle
      ? `${postData.postTitle} | 롤파이트`
      : "게시글 | 롤파이트";

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

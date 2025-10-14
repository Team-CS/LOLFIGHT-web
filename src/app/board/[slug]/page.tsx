import { notFound } from "next/navigation";
import BoardNavComponent from "../components/BoardNavComponent";
import BoardComponent from "../components/BoardComponent";
import boardNavLinks from "@/src/data/boardNavLinks"; // slug 정의된 곳
import { Metadata } from "next";

export async function generateStaticParams() {
  return boardNavLinks.map((link) => ({
    slug: link.slug,
  }));
}

type PageProps = {
  slug: string;
};

export async function generateMetadata({
  params,
}: {
  params: PageProps;
}): Promise<Metadata> {
  const isValidSlug = boardNavLinks.some((link) => link.slug === params.slug);

  if (!isValidSlug) {
    return {
      title: "페이지를 찾을 수 없습니다 | 롤파이트",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const boardInfo = boardNavLinks.find((link) => link.slug === params.slug);
  const boardTitle = boardInfo?.title || "게시판";

  const title = `${boardTitle} | 롤파이트`;
  const description = `롤파이트(LOLFIGHT) ${boardTitle}에서 롤 관련 정보를 공유하고 소통해보세요.`;

  const baseUrl = `https://lolfight.kr/board/${params.slug}`;
  const imageUrl = "https://lolfight.kr/LOLFIGHT_NONE_TEXT.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: baseUrl,
      type: "website",
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
}

export default function Page({ params }: { params: PageProps }) {
  const isValidSlug = boardNavLinks.some((link) => link.slug === params.slug);

  if (!isValidSlug) {
    notFound();
  }

  return (
    <div className="flex max-w-[1200px] h-full mx-auto w-full py-[28px] gap-[24px] px-[12px] md:px-0 flex-col md:flex-row">
      <BoardNavComponent />
      <BoardComponent slug={params.slug} />
    </div>
  );
}

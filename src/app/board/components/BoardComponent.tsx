"use client";

import { useEffect, useState } from "react";
import { getPostList } from "@/src/api/post.api";
import Pagination from "@mui/material/Pagination";
import BoardInfoComponent from "./BoardInfoComponent";
import BoardHeadComponent from "./BoardHeadComponent";
import { PostDto, PostListResponseDto } from "@/src/common/DTOs/board/post.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { getTitleFromSlug } from "@/src/utils/string/string.util";

interface BoardComponentProps {
  slug: string;
}

const BoardComponent = (props: BoardComponentProps) => {
  const isMobile = useIsMobile();
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0); // 총 페이지 수
  const [searchTerm, setSearchTerm] = useState<string>(""); // 검색어
  const [searchTarget, setSearchTarget] = useState<string>("title"); // 기본은 제목
  const postsPerPage = 20;

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handlePageClick = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };

  const fetchPosts = async (page: number) => {
    try {
      const response = await getPostList(
        `${getTitleFromSlug(props.slug)}`,
        page,
        postsPerPage,
        searchTerm,
        searchTarget
      );
      const data = response.data.data as PostListResponseDto;
      if (Array.isArray(data.postList)) {
        setPosts(data.postList);
      } else {
        setPosts([]);
      }

      if (data.pagination) {
        const { totalPage } = data.pagination;
        const pages = Math.ceil(totalPage! / postsPerPage);
        setTotalPages(Math.max(1, pages));
      }
    } catch (error) {
      console.error("게시글 목록 조회 실패:", error);
      setPosts([]);
      setTotalPages(1);
    }
  };

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (trimmed.length >= 2) {
      setCurrentPage(1);
      fetchPosts(1);
    } else {
      alert("검색어는 최소 2자 이상 입력해주세요.");
    }
  };

  // 엔터키 입력 시 실행
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-white dark:bg-dark rounded-[16px] shadow-lg border border-gray-100 dark:border-branddarkborder">
      <BoardHeadComponent
        head={{
          slug: props.slug,
        }}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        onKeyDown={handleKeyDown}
        searchTarget={searchTarget}
        setSearchTarget={setSearchTarget}
      ></BoardHeadComponent>
      <div className="flex flex-col gap-[2px] py-[10px]">
        {posts.length > 0 ? (
          posts.map((post) => (
            <BoardInfoComponent
              key={`${post.postBoard}-${post.id}`}
              data={post}
              slug={props.slug}
            />
          ))
        ) : (
          <div
            className={`w-full text-center text-gray-400 py-[40px] ${
              isMobile ? "text-[12px]" : "text-[14px]"
            }`}
          >
            해당 글이 존재하지 않습니다
          </div>
        )}
      </div>
      <div className="w-full flex justify-center py-[16px] border-t border-gray-100 dark:border-branddarkborder">
        <Pagination
          count={totalPages}
          page={currentPage}
          shape="rounded"
          boundaryCount={2}
          onChange={(event, page) => handlePageClick(event, page)}
          sx={{
            // 다크 모드 선택된 아이템
            ".dark & .Mui-selected": {
              backgroundColor: "#4C4C4C",
              color: "#CACACA",
              "&:hover": {
                backgroundColor: "#707070",
              },
            },
            // 다크 모드 일반 아이템
            ".dark & .MuiPaginationItem-root": {
              color: "#EEEEEE",
            },
            ".dark & .MuiPaginationItem-icon": {
              color: "#EEEEEE",
            },
            // 모바일 / PC 반응형
            "& .MuiPaginationItem-root": {
              fontSize: isMobile ? "10px" : "14px", // 폰트 크기
              minWidth: isMobile ? "24px" : "36px", // 버튼 최소 너비
              height: isMobile ? "24px" : "36px", // 버튼 높이
            },
          }}
        />
      </div>
    </div>
  );
};

export default BoardComponent;

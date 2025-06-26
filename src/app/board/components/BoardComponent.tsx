"use client";

import { useEffect, useState } from "react";
import { getPostList } from "@/src/api/post.api";
import boardNavLinks from "@/src/data/boardNavLinks";
import Pagination from "@mui/material/Pagination";
import BoardInfoComponent from "./BoardInfoComponent";
import BoardHeadComponent from "./BoardHeadComponent";
import { PostDto, PostListResponseDto } from "@/src/common/DTOs/board/post.dto";

interface BoardComponentProps {
  slug: string;
}

function getTitleFromSlug(slug: string) {
  const link = boardNavLinks.find((link) => link.href === `/board/${slug}`);
  return link?.title ?? "";
}

const BoardComponent = (props: BoardComponentProps) => {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0); // 총 페이지 수
  const [searchTerm, setSearchTerm] = useState<string>(""); // 검색어
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
        searchTerm
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
    <div className="w-full bg-white dark:bg-dark rounded-[12px] shadow-md">
      <BoardHeadComponent
        head={{
          slug: props.slug,
        }}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        onKeyDown={handleKeyDown}
      ></BoardHeadComponent>
      <div className="flex flex-col gap-[2px] py-[8px]">
        {posts.length > 0 ? (
          posts.map((post) => (
            <BoardInfoComponent key={post.id} data={post} slug={props.slug} />
          ))
        ) : (
          <div className="w-full text-center text-gray-400 py-[20px] text-[14px]">
            해당 글이 존재하지 않습니다 😅
          </div>
        )}
      </div>
      <div className="w-full flex justify-center py-[12px] border-t border-brandborder dark:border-branddarkborder">
        <Pagination
          count={totalPages}
          page={currentPage}
          shape="rounded"
          boundaryCount={2}
          onChange={(event, page) => handlePageClick(event, page)}
          sx={{
            ".dark & .Mui-selected": {
              backgroundColor: "#4C4C4C", // 원하는 색상으로 변경
              color: "#CACACA", // 텍스트 색상
              "&:hover": {
                backgroundColor: "#707070", // 호버 시 색상
              },
            },
            ".dark & .MuiPaginationItem-root": {
              color: "#EEEEEE", // 선택되지 않은 아이템의 기본 텍스트 색상
            },
            ".dark & .MuiPaginationItem-icon": {
              color: "#EEEEEE", // 텍스트 색상
            },
          }}
        />
      </div>
    </div>
  );
};

export default BoardComponent;

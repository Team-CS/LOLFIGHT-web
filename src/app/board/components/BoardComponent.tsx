"use client";

import { useEffect, useState } from "react";
import { getPostList } from "@/src/api/post.api";
import boardNavLinks from "@/src/data/boardNavLinks";
import Pagination from "@mui/material/Pagination";
import BoardInfoComponent from "./BoardInfoComponent";
import BoardHeadComponent from "./BoardHeadComponent";
import { PostDto } from "@/src/common/DTOs/board/post.dto";

interface BoardComponentProps {
  slug: string;
}

function getTitleFromSlug(slug: string) {
  const link = boardNavLinks.find((link) => link.href === `/board/${slug}`);
  return link?.title ?? "";
}

const BoardComponent = (props: BoardComponentProps) => {
  const [postList, setPostList] = useState<PostDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const [searchTerm, setSearchTerm] = useState<string>(""); // 검색어
  const postsPerPage = 20;

  useEffect(() => {
    getPostList(`${getTitleFromSlug(props.slug)}`).then((res) => {
      setPostList(res.data.data);
      setTotalPages(Math.ceil(res.data.data.length / postsPerPage));
    });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageClick = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };

  const filteredPosts = postList.filter((post) =>
    post.postTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="w-full bg-white dark:bg-dark rounded-[12px] shadow-md">
      <BoardHeadComponent
        head={{
          slug: props.slug,
        }}
        setSearchTerm={setSearchTerm}
      ></BoardHeadComponent>
      <div className="flex flex-col gap-[2px] py-[8px]">
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map((post) => (
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

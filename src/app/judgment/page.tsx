"use client";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Image } from "@nextui-org/react";
import constant from "@/src/common/constant/constant";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import { useRouter } from "next/navigation";
import { getJudgmentList } from "@/src/api/judgment.api";
import { JudgmentDTO } from "@/src/common/DTOs/judgment/judgment.dto";
import JudgmentBox from "./components/JudgmentBox";
import Pagination from "@mui/material/Pagination";
import { useMemberStore } from "@/src/common/zustand/member.zustand";

export default function Page() {
  const router = useRouter();
  const [judgmentList, setJudgmentList] = useState<JudgmentDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { member } = useMemberStore();
  const judgmentPerPage = 5;

  const filteredJudgments = judgmentList.filter((judgment) =>
    judgment.judgmentTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedJudgments = filteredJudgments.slice(
    (currentPage - 1) * judgmentPerPage,
    currentPage * judgmentPerPage
  );

  const handleWriteClick = () => {
    if (member) {
      router.push(`/judgment//write`);
    } else {
      CustomAlert("info", "글쓰기", "로그인이 필요합니다");
    }
  };

  const handlePageClick = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    getJudgmentList().then((response) => {
      setJudgmentList(response.data.data);
      console.log(response);
      setTotalPages(Math.ceil(response.data.data.length / judgmentPerPage));
    });
  }, []);
  return (
    <div className="w-full my-16">
      <div className="w-1200px mx-auto mb-16">
        <div className="w-full bg-white dark:bg-dark shadow-md">
          <div className="flex flex-col">
            <div className="flex justify-between mx-8 mt-8 ">
              <span className="text-xl font-bold text-center justify-center items-center flex">
                롤로세움
              </span>
              <button
                className="h-8 w-16 border border-brandcolor bg-brandcolor text-white m-1 rounded-lg"
                onClick={handleWriteClick}
              >
                글쓰기
              </button>
            </div>

            <div className="flex justify-between font-semibold">
              <div className="flex my-2 ml-2"></div>
              <div className="flex w-[300px] border border-gray-200 rounded-md my-2 mr-2 dark:bg-black dark:border-black">
                <div className="bg-gray-100 w-12 h-10 flex flex-wrap justify-center content-center dark:bg-black">
                  <FaSearch />
                </div>
                <input
                  className="w-full h-10 rounded-md px-2 bg-gray-100 focus:outline-none dark:bg-black font-normal"
                  type="text"
                  placeholder="검색"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="w-full h-[10px] text-sm flex border-t border-b border-slate-500 dark:bg-branddark" />
          <div className="flex flex-col w-full h-full p-[20px] gap-5">
            {paginatedJudgments.map((judgment) => (
              <JudgmentBox key={judgment.id} judgment={judgment} />
            ))}
          </div>
        </div>
        <div className="w-full flex justify-center mt-1 p-3">
          <Pagination
            count={totalPages}
            shape="rounded"
            boundaryCount={2}
            onChange={(event, page) => handlePageClick(event, page)}
            sx={{
              ".dark & .Mui-selected": {
                backgroundColor: "#4C4C4C",
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
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { Category } from "@/src/common/types/enums/category.enum";
import { ShopDto, ShopListResponseDto } from "@/src/common/DTOs/shop/shop.dto";
import { ShopNavComponent } from "./components/ShopNavComponent";
import { ShopItemBox } from "./components/ShopItemBox";
import { getShopItems } from "@/src/api/shop.api";
import { Pagination } from "@mui/material";

export default function Page() {
  const isMobile = useIsMobile();

  const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">(
    "ALL"
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0); // 총 페이지 수
  const [searchTerm, setSearchTerm] = useState<string>(""); // 검색어
  const [shopItems, setshopItems] = useState<ShopDto[]>([]); // API 호출 시 초기화
  const shopItemsPerPage = 10;

  useEffect(() => {
    fetchShopItems(currentPage);
  }, [currentPage, selectedCategory]);

  const fetchShopItems = async (page: number) => {
    try {
      const category =
        selectedCategory === "ALL" ? undefined : selectedCategory;
      const response = await getShopItems(
        page,
        shopItemsPerPage,
        category,
        searchTerm
      );
      const data = response.data.data as ShopListResponseDto;
      if (Array.isArray(data.shopList)) {
        setshopItems(data.shopList);
      } else {
        setshopItems([]);
      }

      if (data.pagination) {
        const { totalPage } = data.pagination;
        const pages = Math.ceil(totalPage! / shopItemsPerPage);
        setTotalPages(Math.max(1, pages));
      }
    } catch (error) {
      console.log("상점 아이템 조회 실패:", error);
      setshopItems([]);
      setTotalPages(1);
    }
  };

  const handlePageClick = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };
  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (trimmed.length >= 2) {
      setCurrentPage(1);
      fetchShopItems(1);
    } else {
      alert("검색어는 최소 2자 이상 입력해주세요.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex max-w-[1200px] h-full mx-auto w-full py-[28px] gap-[24px] px-[12px] md:px-0 flex-col md:flex-row">
      <ShopNavComponent
        selectedCategory={selectedCategory}
        onSetCategory={setSelectedCategory}
      />

      <div className="flex flex-col gap-[12px] w-full bg-white dark:bg-branddark rounded-[12px] shadow-md p-[24px]">
        {/* 상점 헤드 + 검색 */}
        <div className="flex justify-between items-center w-full">
          <p
            className={`flex font-bold ${
              isMobile ? "text-[12px]" : "text-[18px]"
            }`}
          >
            상점
          </p>

          {/* 검색 UI */}
          {isMobile ? (
            <>
              <div
                onClick={() => setIsSearchOpen(true)}
                className="cursor-pointer"
              >
                <FaSearch />
              </div>
              {isSearchOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-start justify-center bg-black/30"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <div
                    className="w-[90%]border border-gray-300 bg-white dark:bg-black dark:border-gray-700 p-[12px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-1 border border-gray-200 rounded-md px-[8px] gap-[4px] bg-gray-100 dark:bg-black dark:border-black">
                      <div
                        className="flex flex-wrap justify-center content-center cursor-pointer"
                        onClick={handleSearch}
                      >
                        <FaSearch />
                      </div>
                      <input
                        autoFocus
                        className="w-full rounded-md bg-gray-100 px-[8px] py-[4px] text-[12px] focus:outline-none dark:bg-black font-normal"
                        type="text"
                        placeholder="검색어 입력 (2자 이상)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex w-[200px] border border-gray-200 rounded-md px-[12px] gap-[4px] bg-gray-100 dark:bg-black dark:border-black">
              <div
                className="flex flex-wrap justify-center content-center cursor-pointer"
                onClick={handleSearch}
              >
                <FaSearch />
              </div>
              <input
                className="w-full rounded-md bg-gray-100 px-[12px] py-[4px] text-[14px] focus:outline-none dark:bg-black font-normal"
                type="text"
                placeholder="검색어 입력 (2자 이상)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}
        </div>

        {/* 아이템 그리드 */}
        <div className="w-full">
          {shopItems.length > 0 ? (
            <div
              className={`grid gap-[16px] ${
                isMobile ? "grid-cols-2" : "grid-cols-5"
              }`}
            >
              {shopItems.map((item, index) => (
                <ShopItemBox key={index} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] bg-white dark:bg-branddark rounded-[12px] shadow-md">
              <p className="text-[18px] font-semibold text-gray-400">
                😓 검색 결과가 없습니다
              </p>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 mt-[8px]">
                다른 검색어나 카테고리를 선택해주세요
              </p>
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
    </div>
  );
}

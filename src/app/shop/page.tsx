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
import { getMyItems } from "@/src/api/member_item.api";
import { MemberItemDto } from "@/src/common/DTOs/member/member_item.dto";
import { getCookie } from "@/src/utils/cookie/cookie";

export default function Page() {
  const isMobile = useIsMobile();

  const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">(
    "ALL"
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [shopItems, setshopItems] = useState<ShopDto[]>([]);
  const [myItems, setMyItems] = useState<MemberItemDto[] | null>(null);
  const shopItemsPerPage = 10;

  useEffect(() => {
    const accessToken = getCookie("lf_atk");
    if (accessToken) {
      getMyItems().then((response) => {
        setMyItems(response.data.data);
      });
    }
  }, []);

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
    <div className="flex max-w-[1200px] h-full mx-auto w-full py-[32px] gap-[20px] px-[12px] md:px-0 flex-col md:flex-row">
      <ShopNavComponent
        selectedCategory={selectedCategory}
        onSetCategory={setSelectedCategory}
      />

      <div className="flex flex-col gap-[16px] w-full bg-white dark:bg-dark rounded-[16px] shadow-lg border border-gray-100 dark:border-branddarkborder p-[20px] md:p-[24px]">
        {/* 상점 헤드 + 검색 */}
        <div className="flex justify-between items-center w-full pb-[12px] border-b border-gray-100 dark:border-branddarkborder">
          <div className="flex items-center gap-[10px]">
            <div className="w-[4px] h-[20px] bg-gradient-to-b from-brandcolor to-blue-400 rounded-full" />
            <p
              className={`font-bold ${
                isMobile ? "text-[14px]" : "text-[20px]"
              }`}
            >
              상점
            </p>
            <span className={`text-gray-400 font-medium ${isMobile ? "text-[11px]" : "text-[13px]"}`}>
              {shopItems.length}개 아이템
            </span>
          </div>

          {/* 검색 UI */}
          {isMobile ? (
            <>
              <div
                onClick={() => setIsSearchOpen(true)}
                className="cursor-pointer p-[8px] rounded-[8px] bg-gray-100 dark:bg-branddark hover:bg-gray-200 dark:hover:bg-branddarkborder transition-colors"
              >
                <FaSearch className="text-gray-500 dark:text-gray-300" />
              </div>
              {isSearchOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-[20px]"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <div
                    className="w-[90%] bg-white dark:bg-dark rounded-[12px] shadow-xl p-[16px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center border border-gray-200 dark:border-branddarkborder rounded-[10px] px-[12px] gap-[8px] bg-gray-50 dark:bg-branddark">
                      <div
                        className="flex items-center justify-center cursor-pointer p-[8px]"
                        onClick={handleSearch}
                      >
                        <FaSearch className="text-gray-400" />
                      </div>
                      <input
                        autoFocus
                        className="w-full bg-transparent py-[12px] text-[14px] focus:outline-none font-normal placeholder:text-gray-400"
                        type="text"
                        placeholder="아이템 검색 (2자 이상)"
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
            <div className="flex w-[220px] items-center border border-gray-200 dark:border-branddarkborder rounded-[10px] px-[12px] gap-[8px] bg-gray-50 dark:bg-branddark hover:border-brandcolor dark:hover:border-brandcolor transition-colors">
              <div
                className="flex items-center justify-center cursor-pointer"
                onClick={handleSearch}
              >
                <FaSearch className="text-gray-400" />
              </div>
              <input
                className="w-full bg-transparent py-[10px] text-[14px] focus:outline-none font-normal placeholder:text-gray-400"
                type="text"
                placeholder="아이템 검색 (2자 이상)"
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
              className={`grid gap-[14px] ${
                isMobile ? "grid-cols-2" : "grid-cols-4"
              }`}
            >
              {shopItems.map((item, index) => (
                <ShopItemBox
                  key={index}
                  item={item}
                  hasItems={myItems}
                  onPurchase={(newItem: MemberItemDto) =>
                    setMyItems((prev) =>
                      prev ? [...prev, newItem] : [newItem]
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-branddark dark:to-dark rounded-[14px]">
              <p className="text-[16px] font-semibold text-gray-400">
                검색 결과가 없습니다
              </p>
              <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-[6px]">
                다른 검색어나 카테고리를 선택해주세요
              </p>
            </div>
          )}
        </div>
        <div className="w-full flex justify-center pt-[16px] border-t border-gray-100 dark:border-branddarkborder">
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

"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import constant from "@/src/common/constant/constant";
import { Category } from "@/src/common/types/enums/category.enum";
import { ShopDto } from "@/src/common/DTOs/shop/shop.dto";
import { ShopItemBox } from "./components/ShopItemBox";
import { ShopNavComponent } from "./components/ShopNavComponent";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    Category.ALL
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  // 샘플 아이템 데이터
  const sampleItems: ShopDto[] = [
    {
      id: "1",
      name: "레전드 배너",
      category: Category.BANNER,
      price: 500,
      imageUrl: `${constant.SERVER_URL}/public/shop/banner1.png`,
    },
    {
      id: "2",
      name: "태양 테두리",
      category: Category.BORDER,
      price: 1000,
      imageUrl: `${constant.SERVER_URL}/public/shop/border1.png`,
    },
    {
      id: "3",
      name: "네온 효과",
      category: Category.EFFECT,
      price: 800,
      imageUrl: `${constant.SERVER_URL}/public/shop/effect1.png`,
    },
    {
      id: "4",
      name: "레전드 배너",
      category: Category.BANNER,
      price: 2000,
      imageUrl: `${constant.SERVER_URL}/public/shop/banner2.png`,
    },
    {
      id: "5",
      name: "태양 테두리",
      category: Category.BORDER,
      price: 1500,
      imageUrl: `${constant.SERVER_URL}/public/shop/border2.png`,
    },
    {
      id: "6",
      name: "네온 효과",
      category: Category.EFFECT,
      price: 1200,
      imageUrl: `${constant.SERVER_URL}/public/shop/effect2.png`,
    },
  ];

  // 필터링된 아이템
  const filteredItems = sampleItems.filter((item) => {
    const matchesCategory =
      selectedCategory === Category.ALL || item.category === selectedCategory;

    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

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
                    className="mt-[40px] w-[90%] max-w-md rounded-xl border border-gray-300 bg-white dark:bg-black dark:border-gray-700 shadow-lg p-[12px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-1 border border-gray-200 rounded-md px-[8px] gap-[4px] bg-gray-100 dark:bg-black dark:border-black">
                      <div
                        className="flex flex-wrap justify-center content-center cursor-pointer"
                        onClick={() => {}}
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
                onClick={() => {}}
              >
                <FaSearch />
              </div>
              <input
                className="w-full rounded-md bg-gray-100 px-[12px] py-[4px] text-[14px] focus:outline-none dark:bg-black font-normal"
                type="text"
                placeholder="검색어 입력 (2자 이상)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* 아이템 그리드 */}
        <div className="w-full">
          {filteredItems.length > 0 ? (
            <div
              className={`grid gap-[16px] ${
                isMobile ? "grid-cols-2" : "grid-cols-5"
              }`}
            >
              {filteredItems.map((item, index) => (
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
      </div>
    </div>
  );
}

import { ShopDto } from "@/src/common/DTOs/shop/shop.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import constant from "@/src/common/constant/constant";

import "@/src/css/index.ts";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { purchaseItem } from "@/src/api/member_item.api";
import { MemberItemDto } from "@/src/common/DTOs/member/member_item.dto";
import CustomAlert from "@/src/common/components/alert/CustomAlert";
import Image from "next/image";

interface ShopItemBoxProps {
  item: ShopDto;
  hasItems?: MemberItemDto[] | null;
  onPurchase: (newItem: MemberItemDto) => void;
}

export const ShopItemBox = (props: ShopItemBoxProps) => {
  const { item, hasItems, onPurchase } = props;
  const { member } = useMemberStore();
  const isMobile = useIsMobile();
  const isBanner = item.category === "BANNER";

  const renderContent = () => {
    switch (item.category) {
      case "BORDER":
        return (
          <div
            className={`relative rounded-[12px] ${
              isMobile ? "w-[32px] h-[32px]" : "w-[40px] h-[40px]"
            } ${item.cssClass}`}
          >
            <Image
              src={`${constant.SERVER_URL}/public/default.png`}
              alt={item.name}
              width={40}
              height={40}
              className="object-cover w-full h-full rounded-[12px]"
            />
          </div>
        );
      case "EFFECT":
        return (
          <div className={`flex items-center justify-center w-full h-full`}>
            <p className={`${item.cssClass} text-center ${isMobile ? "text-[14px]" : "text-[18px]"}`}>LOLFIGHT</p>
          </div>
        );
      case "BANNER":
        return (
          <div className="w-full h-full rounded-[8px] overflow-hidden flex items-center justify-center p-[12px]">
            <Image
              src={`${constant.SERVER_URL}/${item.imageUrl}`}
              alt={item.name}
              width={300}
              height={80}
              className="object-contain w-full h-auto max-h-full"
            />
          </div>
        );
      default:
        return <></>;
    }
  };

  const handlePurchase = (item: ShopDto) => {
    if (member) {
      const memberItemDto: MemberItemDto = {
        member: member.id,
        shop: item,
      };
      purchaseItem(memberItemDto)
        .then((response) => {
          CustomAlert(
            "success",
            "아이템 구매",
            `구매가 완료되었습니다! <br/> 내정보에서 구매한 아이템을 활성화 시켜주세요!`,
          );
          onPurchase(response.data.data);
        })
        .catch((error) => {
          const code = error.response.data.code;
          if (code === "COMMON-005") {
            CustomAlert(
              "warning",
              "아이템 구매",
              "이미 보유하고 있는 아이템 입니다",
            );
          } else if (code === "COMMON-009") {
            CustomAlert("warning", "아이템 구매", "보유한 포인트가 부족합니다");
          }
        });
    } else {
      CustomAlert("warning", "아이템 구매", "로그인 후 이용가능 합니다.");
    }
  };

  const hasPurchased = (item: ShopDto) => {
    if (hasItems?.find((hasItem) => hasItem.shop.id === item.id)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div
      key={item.id}
      className={`bg-white dark:bg-branddark rounded-[14px] shadow-md overflow-hidden group
             transform transition-all duration-300 ease-in-out border border-transparent
             hover:scale-[1.03] hover:shadow-lg hover:border-blue-100 dark:hover:border-branddarkborder
             ${isBanner ? (isMobile ? "col-span-2" : "col-span-2") : ""}`}
    >
      <div
        className={`relative w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-brandgray dark:to-branddark ${
          isBanner ? "aspect-[3/1]" : "aspect-square"
        } ${hasPurchased(item) ? "opacity-70" : ""}`}
      >
        {renderContent()}

        {hasPurchased(item) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 text-white backdrop-blur-[1px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${isBanner ? "w-8 h-8" : "w-10 h-10"} mb-1 text-green-400 drop-shadow-md`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className={`font-semibold tracking-wide ${isBanner ? "text-xs" : "text-sm"}`}>
              구매 완료
            </span>
          </div>
        )}

        {/* 카테고리 뱃지 */}
        <div className={`absolute top-[8px] left-[8px] px-[8px] py-[2px] rounded-full text-[10px] font-bold text-white shadow-sm ${
          item.category === "BANNER" ? "bg-gradient-to-r from-purple-500 to-pink-500" :
          item.category === "BORDER" ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
          "bg-gradient-to-r from-orange-500 to-yellow-500"
        }`}>
          {item.category === "BANNER" ? "배너" : item.category === "BORDER" ? "테두리" : "효과"}
        </div>
      </div>

      <div className={`flex flex-col gap-[6px] ${isBanner ? "p-[12px]" : "p-[14px]"}`}>
        <p
          className={`font-bold truncate ${
            isMobile ? "text-[13px]" : "text-[15px]"
          }`}
        >
          {item.name}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[6px]">
            <Image
              src="/images/point.png"
              alt="포인트"
              width={16}
              height={16}
              className="w-[16px] h-[16px] object-cover"
            />
            <span
              className={`text-brandcolor font-bold ${
                isMobile ? "text-[13px]" : "text-[15px]"
              }`}
            >
              {item.price.toLocaleString()}
            </span>
          </div>
          {!hasPurchased(item) && (
            <button
              className={`bg-gradient-to-r from-brandcolor to-blue-500 text-white rounded-[6px] hover:opacity-90 transition-opacity font-medium ${
                isMobile ? "px-[10px] py-[4px] text-[11px]" : "px-[14px] py-[5px] text-[12px]"
              }`}
              onClick={() => handlePurchase(item)}
            >
              구매
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

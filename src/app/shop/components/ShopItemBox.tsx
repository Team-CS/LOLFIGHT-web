import { ShopDto } from "@/src/common/DTOs/shop/shop.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import constant from "@/src/common/constant/constant";

import "@/src/css/index.ts";
import { useMemberStore } from "@/src/common/zustand/member.zustand";
import { purchaseItem } from "@/src/api/member_item.api";
import { MemberItemDto } from "@/src/common/DTOs/member/member_item.dto";
import CustomAlert from "@/src/common/components/alert/CustomAlert";

interface ShopItemBoxProps {
  item: ShopDto;
  hasItems: MemberItemDto[] | null;
}

export const ShopItemBox = (props: ShopItemBoxProps) => {
  const { item, hasItems } = props;
  const { member, setMember } = useMemberStore();
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (item.category) {
      case "BORDER":
        return (
          <div
            className={`relative rounded-[12px] ${
              isMobile ? "w-[25px] h-[25px]" : "w-[30px] h-[30px]"
            } ${item.cssClass}`}
          >
            <img
              className="object-cover w-full h-full rounded-[12px]"
              src={`${constant.SERVER_URL}/public/default.png`}
              alt={item.name}
            />
          </div>
        );
      case "EFFECT":
        return (
          <div className={`flex items-center justify-center w-full h-full`}>
            <p className={`${item.cssClass} text-center`}>LOLFIGHT</p>
          </div>
        );
      case "BANNER":
        return (
          <div className="w-full h-full rounded-[8px] overflow-hidden">
            <img
              className="object-cover w-full h-full"
              src={`${constant.SERVER_URL}/${item.imageUrl}`}
              alt={item.name}
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
        member: member,
        shop: item,
      };
      purchaseItem(memberItemDto)
        .then((response) => {
          CustomAlert(
            "success",
            "아이템 구매",
            `구매가 완료되었습니다! <br/> 내정보에서 구매한 아이템을 활성화 시켜주세요!`
          );
        })
        .catch((error) => {
          const code = error.response.data.code;
          if (code === "COMMON-005") {
            CustomAlert(
              "warning",
              "아이템 구매",
              "이미 보유하고 있는 아이템 입니다"
            );
          } else if (code === "COMMON-009") {
            CustomAlert("warning", "아이템 구매", "보유한 포인트가 부족합니다");
          }
        });
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
      className="bg-white dark:bg-branddark rounded-[12px] shadow-md overflow-hidden group
             transform transition-transform duration-200 ease-in-out
             hover:scale-105"
    >
      <div
        className={`relative w-full aspect-square overflow-hidden flex items-center justify-center ${
          hasPurchased(item)
            ? "bg-gray-100 dark:bg-brandgray opacity-60"
            : "bg-gray-100 dark:bg-brandgray"
        }`}
      >
        {renderContent()}

        {hasPurchased(item) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 mb-1 text-green-400 drop-shadow-md"
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
            <span className="font-semibold text-sm tracking-wide">
              구매 완료
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[4px] p-[16px]">
        <p
          className={`font-semibold ${
            isMobile ? "text-[14px]" : "text-[16px]"
          }`}
        >
          {item.name}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[4px]">
            <span
              className={`text-brandcolor font-bold ${
                isMobile ? "text-[12px]" : "text-[14px]"
              }`}
            >
              {item.price.toLocaleString()}
            </span>
            <img
              className="w-[15px] h-[15px] object-cover"
              src="/images/point.png"
              alt="포인트"
            />
          </div>
          {!hasPurchased(item) && (
            <button
              className={`bg-brandcolor text-white rounded-md hover:opacity-90 transition text-[12px] ${
                isMobile ? "px-[8px] py-[2px]" : "px-[12px] py-[2px]"
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

import { ShopDto } from "@/src/common/DTOs/shop/shop.dto";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import constant from "@/src/common/constant/constant";

import "@/src/css/index.ts";

interface ShopItemBoxProps {
  item: ShopDto;
}

export const ShopItemBox = (props: ShopItemBoxProps) => {
  const { item } = props;
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (item.category) {
      case "BORDER":
        return (
          <div
            className={`relative rounded-[12px] ${
              isMobile ? "w-[25px] h-[25px]" : "w-[30px] h-[30px]"
            } flame-border`}
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
        return (
          <img
            className="object-cover w-full h-full rounded-[12px]"
            src={item.imageUrl}
            alt={item.name}
          />
        );
    }
  };

  return (
    <div
      key={item.id}
      className="bg-white dark:bg-branddark rounded-[12px] shadow-md overflow-hidden cursor-pointer group"
    >
      {/* 아이템 이미지 또는 네온 효과 */}
      <div className="w-full aspect-square bg-gray-100 dark:bg-brandgray overflow-hidden flex items-center justify-center">
        {renderContent()}
      </div>

      {/* 아이템 정보 */}
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
          <button
            className={`bg-brandcolor text-white rounded-md hover:opacity-90 transition text-[12px] ${
              isMobile ? "px-[8px] py-[2px]" : "px-[12px] py-[4px]"
            }`}
          >
            구매
          </button>
        </div>
      </div>
    </div>
  );
};

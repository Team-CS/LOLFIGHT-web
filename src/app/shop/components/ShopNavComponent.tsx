import { Category } from "@/src/common/types/enums/category.enum";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import { FaLayerGroup, FaImage, FaBorderStyle, FaMagic } from "react-icons/fa";

interface ShopNavComponentProps {
  onSetCategory: (category: Category | "ALL") => void;
  selectedCategory: Category | string;
}

const categories: { value: Category | "ALL"; label: string; icon: React.ReactNode }[] = [
  { value: "ALL", label: "전체", icon: <FaLayerGroup /> },
  { value: Category.BANNER, label: "배너", icon: <FaImage /> },
  { value: Category.BORDER, label: "테두리", icon: <FaBorderStyle /> },
  { value: Category.EFFECT, label: "효과", icon: <FaMagic /> },
];

export const ShopNavComponent = (props: ShopNavComponentProps) => {
  const { selectedCategory, onSetCategory } = props;
  const isMobile = useIsMobile();
  return (
    <div
      className={`rounded-[14px] shadow-lg bg-white dark:bg-dark border border-gray-100 dark:border-branddarkborder ${
        isMobile
          ? "w-full overflow-x-auto"
          : "sticky top-[100px] w-[200px] overflow-y-auto"
      }`}
    >
      {!isMobile && (
        <div className="px-[16px] py-[14px] border-b border-gray-100 dark:border-branddarkborder">
          <p className="text-[14px] font-bold text-gray-700 dark:text-gray-200">카테고리</p>
        </div>
      )}
      <nav
        className={`flex ${
          isMobile
            ? "flex-nowrap gap-[8px] items-center p-[10px] min-w-max"
            : "flex-col py-[8px]"
        }`}
      >
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onSetCategory(category.value)}
            className={`flex items-center gap-[8px] rounded-[8px] font-medium transition-all duration-200 ${
              selectedCategory === category.value
                ? "bg-gradient-to-r from-brandcolor to-blue-500 text-white shadow-md"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-branddarkborder"
            } ${
              isMobile
                ? "w-fit h-[28px] text-[11px] px-[10px]"
                : "h-[42px] text-[14px] px-[14px] mx-[8px] my-[3px]"
            }`}
          >
            <span className={`${isMobile ? "text-[10px]" : "text-[14px]"}`}>{category.icon}</span>
            {category.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

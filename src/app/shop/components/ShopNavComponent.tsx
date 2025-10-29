import { Category } from "@/src/common/types/enums/category.enum";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

interface ShopNavComponentProps {
  onSetCategory: (category: Category | "ALL") => void;
  selectedCategory: Category | string;
}

const categories: { value: Category | "ALL"; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: Category.BANNER, label: "배너" },
  { value: Category.BORDER, label: "테두리" },
  { value: Category.EFFECT, label: "효과" },
];

export const ShopNavComponent = (props: ShopNavComponentProps) => {
  const { selectedCategory, onSetCategory } = props;
  const isMobile = useIsMobile();
  return (
    <div
      className={`rounded-[12px] shadow-md bg-white dark:bg-dark h-full ${
        isMobile
          ? "w-full overflow-x-auto"
          : "sticky top-[100px] w-[200px] overflow-y-auto"
      }`}
    >
      <nav
        className={`flex ${
          isMobile
            ? "flex-nowrap gap-[8px] items-center p-[8px] min-w-max"
            : "flex-col py-[12px]"
        }`}
      >
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onSetCategory(category.value)}
            className={`flex items-center rounded-[8px] font-medium transition-colors ${
              selectedCategory === category.value
                ? "bg-brandcolor text-white"
                : "text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            } ${
              isMobile
                ? "w-fit h-[25px] text-[10px] px-[8px]"
                : "h-[40px] text-[16px] px-[16px] mx-[8px] my-[4px]"
            }`}
          >
            {category.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

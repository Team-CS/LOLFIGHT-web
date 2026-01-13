import headerNavLinks from "@/src/data/headerNavLinks";
import Link from "./Link";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

const Navigation = () => {
  const isMobile = useIsMobile();
  return (
    <div className="flex items-center">
      <div
        className={`flex font-bold items-center ${
          isMobile ? "text-[14px]" : "text-[16px]"
        }`}
      >
        {headerNavLinks
          .filter((link) => link.href !== "/")
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-white dark:text-gray-100 px-[12px] py-[4px] rounded-[12px] transition-colors
  hover:bg-black/10"
            >
              {link.title}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Navigation;

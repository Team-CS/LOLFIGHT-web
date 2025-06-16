import headerNavLinks from "@/src/data/headerNavLinks";
import Link from "./Link";

const Navigation = () => {
  return (
    <div className="w-full">
      <div className="mx-auto flex items-center">
        <div className="flex font-bold items-center gap-[18px]">
          {headerNavLinks
            .filter((link) => link.href !== "/")
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hidden text-white dark:text-gray-100 sm:block"
              >
                {link.title}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Navigation;

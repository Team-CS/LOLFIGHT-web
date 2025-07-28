import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LOL.FIGHT",
  description: "Create and join League of Legends tournaments.",
  icons: {
    icon: "/icon-blue.ico",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="">
        <div className="w-full h-screen">
          <div className="mx-auto w-1200px">
            <div className="flex justify-center items-center pt-24 mb-8">
              <Link className="text-32px font-extrabold" key="home" href={"/"}>
                LOL.FIGHT
              </Link>
            </div>
            <div className="flex justify-center items-center">
              <div className="h-full flex flex-col border border-gray-200 rounded-md p-20 w-540px bg-white shadow-md dark:bg-dark dark:border-gray-700">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

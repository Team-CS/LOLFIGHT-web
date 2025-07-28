export const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="w-full max-w-[1200px] flex flex-col gap-[12px] p-[12px] rounded-2xl shadow-sm border border-brandborder dark:border-branddarkborder bg-white dark:bg-branddark">
    <h2 className="text-[22px] font-bold text-brandgray dark:text-brandhover">
      {title}
    </h2>
    {children}
  </div>
);

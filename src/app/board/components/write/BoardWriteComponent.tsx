import WysiwygEditor from "@/src/common/components/WysiwygEditor";

const BoardWriteComponent = () => {
  return (
    <div className="w-full bg-white rounded-[12px] p-[24px] shadow-md dark:bg-dark">
      <WysiwygEditor />
    </div>
  );
};

export default BoardWriteComponent;

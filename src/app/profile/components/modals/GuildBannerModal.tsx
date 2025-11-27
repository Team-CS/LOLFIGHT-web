import Image from "next/image";

interface GuildBannerModalProps {
  selectedImage: File | null;
  previewImage: string;
  onClose: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export const GuildBannerModal = (props: GuildBannerModalProps) => {
  const { selectedImage, previewImage, onClose, onImageChange, onSubmit } =
    props;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col bg-white dark:bg-gray-900 rounded-[16px] p-[24px] gap-[16px] w-[90%] max-w-[500px] shadow-lg">
        <h2 className="text-[20px] font-bold text-center">길드 배너 업로드</h2>

        <div className="flex justify-center items-center h-[200px] border border-dashed border-gray-300 rounded-[12px] bg-gray-50 dark:bg-gray-900 overflow-hidden">
          {selectedImage === null ? (
            <span className="text-[14px] text-gray-400">미리보기 없음</span>
          ) : (
            <Image
              src={previewImage}
              alt="배너 미리보기"
              width={200}
              height={100}
              className="w-full max-h-[200px] object-contain"
            />
          )}
        </div>

        <input
          type="file"
          onChange={onImageChange}
          accept="image/*"
          className="text-[14px] text-gray-700"
        />

        <div className="flex justify-end gap-[8px] mt-[8px]">
          <button
            className="px-[16px] py-[8px] rounded-[8px] bg-gray-200 text-gray-800 hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-[16px] py-[8px] rounded-[8px] bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={onSubmit}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

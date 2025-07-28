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
      <div className="flex flex-col bg-white rounded-[16px] p-[24px] gap-[16px] w-[90%] max-w-[500px] shadow-lg dark:text-black">
        <h2 className="text-xl font-bold text-center">길드 배너 업로드</h2>

        <div className="flex justify-center items-center h-[200px] border border-dashed border-gray-300 rounded-[12px] bg-gray-50 overflow-hidden">
          {selectedImage === null ? (
            <span className="text-gray-400 text-sm">미리보기 없음</span>
          ) : (
            <img
              src={previewImage}
              alt="배너 미리보기"
              className="max-h-[200px] object-contain"
            />
          )}
        </div>

        <input
          type="file"
          onChange={onImageChange}
          accept="image/*"
          className="text-sm text-gray-700"
        />

        <div className="flex justify-end gap-[8px] mt-2">
          <button
            className="bg-gray-200 text-black px-[16px] py-[8px] rounded hover:bg-gray-300 transition"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="bg-blue-600 text-white px-[16px] py-[8px] rounded hover:bg-blue-700 transition"
            onClick={onSubmit}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

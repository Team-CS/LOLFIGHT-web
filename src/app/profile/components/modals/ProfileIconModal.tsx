interface ProfileIconModalProps {
  selectedImage: File | null;
  previewImage: string;
  onClose: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export const ProfileIconModal = (props: ProfileIconModalProps) => {
  const { selectedImage, previewImage, onClose, onImageChange, onSubmit } =
    props;

  console.log(previewImage);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col bg-white dark:bg-gray-900 rounded-[16px] p-[24px] gap-[16px] w-[90%] max-w-[400px] shadow-lg">
        <h2 className="text-[20px] font-bold text-center">프로필 사진 변경</h2>

        <div className="flex justify-center">
          <div className="flex justify-center items-center h-[80px] w-[80px] rounded-[12px] overflow-hidden border border-dashed border-gray-300 bg-gray-50 dark:bg-gray-800">
            {selectedImage ? (
              <img
                src={previewImage}
                alt="프로필 사진 미리보기"
                className="w-[80px] h-[80px] object-cover"
              />
            ) : (
              <img
                src="https://placehold.co/50x50"
                alt="기본 이미지"
                className="w-[50px] h-[50px]"
              />
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <input
            type="file"
            onChange={onImageChange}
            accept="image/*"
            className="text-[14px] text-gray-700 dark:text-gray-200"
          />
        </div>

        <div className="flex justify-end gap-[12px] mt-[8px]">
          <button
            className="px-[16px] py-[8px] rounded-[8px] bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={onSubmit}
          >
            등록
          </button>
          <button
            className="px-[16px] py-[8px] rounded-[8px] bg-gray-200 text-gray-800 hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

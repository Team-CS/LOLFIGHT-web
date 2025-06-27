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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col bg-white rounded-[12px] p-[22px] gap-[12px] dark:text-black">
        <h2 className="text-lg font-bold">프로필 사진 변경</h2>
        <div className="flex justify-center ">
          {selectedImage === null ? (
            <img src="https://placehold.co/50x50" alt="기본 이미지" />
          ) : (
            <img src={previewImage} alt="프로필 사진 미리보기" width={50} />
          )}
        </div>

        <input type="file" onChange={onImageChange} accept="image/*" />

        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 text-black px-[12px] py-[8px] rounded mr-[8px]"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="bg-blue-500 text-white px-[12px] py-[8px] rounded"
            onClick={onSubmit}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

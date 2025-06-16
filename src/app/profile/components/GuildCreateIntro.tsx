import { useRouter } from "next/navigation";
import { FaArrowCircleRight, FaRegQuestionCircle } from "react-icons/fa";

export const GuildCreateIntro = () => {
  const router = useRouter();
  return (
    <div className="flex w-full py-10">
      <div className="flex flex-col w-full border-2 border-black rounded-lg p-7">
        <div className="mb-10">
          <p className="font-extrabold text-4xl">롤파이트에 오신것을</p>
          <p className="font-extrabold text-4xl">환영합니다</p>
        </div>
        <div className="mb-10">
          <p className="font-extrabold text-3xl text-brandcolor">
            길드를 생성하세요
          </p>
          <p className="font-extrabold text-3xl text-brandcolor">
            나만의 길드를 운영해보세요.
          </p>
        </div>
        <button
          className="flex h-45px rounded-lg w-200px items-center justify-center bg-brandcolor gap-2"
          onClick={() => {
            router.push("/league/guild/create");
          }}
        >
          <FaArrowCircleRight className="w-30px h-30px text-white" />
          <p className="text-3xl text-white">길드만들기</p>
        </button>
      </div>
      <div className="flex flex-col pl-5">
        <div className="flex w-full gap-2 pb-3">
          <FaRegQuestionCircle className="w-30px h-30px text-brandcolor" />
          <p className="font-extrabold text-2xl text-brandcolor">
            롤파이트 길드란?
          </p>
        </div>
        <p className="text-lg">
          롤파이트 유저가 자신만의 길드를 만들어 원하는 다른 길드들과 함께
          롤파이트 전적시스템을 이용할 수 있습니다.
        </p>
        <div className="flex w-full gap-2 pb-3 pt-3">
          <FaRegQuestionCircle className="w-30px h-30px text-brandcolor" />
          <p className="font-extrabold text-2xl text-brandcolor">
            어떻게 참여하나요?
          </p>
        </div>
        <p className="text-lg">
          길드생성을 하면 자동으로 롤파이트 공식 리그에 참여하여 참여 중인 다른
          길드들과 경쟁하세요.
        </p>
        <div className="flex w-full gap-2 pb-3 pt-3">
          <FaRegQuestionCircle className="w-30px h-30px text-brandcolor" />
          <p className="font-extrabold text-2xl text-brandcolor">
            길드는 어떻게 만들수 있나요.
          </p>
        </div>
        <p className="text-lg">
          롤파이트 클라이언트를 통해 롤 계정 인증을 완료한 유저만 길드를 생성할
          수 있습니다. 길드를 생성해 강한팀을 만들어 보세요.
        </p>
      </div>
    </div>
  );
};

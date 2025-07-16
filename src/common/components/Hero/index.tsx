"use client";
import { downloadFile } from "@/src/api/file.api";
import CustomAlert from "../alert/CustomAlert";

const Hero = () => {
  const handleClick = () => {
    downloadFile();
    CustomAlert(
      "success",
      "LOLFIGHT.Desktop",
      "다운로드 중입니다. 잠시만 기다려주세요"
    );
  };
  return (
    <section
      id="home"
      className="h-screen relative z-10 overflow-hidden bg-white pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px] "
    >
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover opacity-40"
        >
          <source src="/backgroundVideo.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="container m-auto px-4">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[800px] text-center">
              <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                최고의 스크림/내전, <br />
                LOLFIGHT Desktop과 함께!
              </h1>
              <p className="mb-12 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
                당신과, 당신의 팀원들의 수준급 플레이를 보여주세요! <br />
                숨어있는 강자들의 팀들과 수준 높은 경기를 가질 수 있습니다.
                <br />
                적팀과 싸워서 승리를 쟁취하고 더 높은 경기력을 가진 팀이
                되어보세요!
              </p>
              <div className="flex flex-col items-center justify-center font-semibold space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <button
                  // href="https://nextjstemplates.com/templates/saas-starter-startup"
                  className="w-[350px] rounded-lg bg-gradient-to-r from-[#11235A] to-[#3B82F6] px-8 py-4 transition-all duration-500 ease-in-out hover:scale-110 hover:from-[#FF7F50] hover:to-[#FFD700]"
                  onClick={handleClick}
                >
                  🔥 LOLFIGHT.Desktop 다운로드
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 w-full text-center">
        <div className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300 ease-in-out">
          ↓ 주요기능
        </div>
      </div>
    </section>
  );
};

export default Hero;

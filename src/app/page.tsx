"use client";

import GuildInfoComponent from "./league/components/GuildInfoComponent";
import LeagueHeaderComponent from "./league/components/LeagueHeaderComponent";
import { GuildDto, GuildListResponseDto } from "../common/DTOs/guild/guild.dto";
import { getGuildList } from "@/src/api/guild.api";
import { useState, useEffect } from "react";
import { PostDto, PostListResponseDto } from "../common/DTOs/board/post.dto";
import { getPopularPosts } from "../api/post.api";
import BoardInfoComponent from "./board/components/BoardInfoComponent";
import { convertBoardNameToCode } from "../utils/string/string.util";
import { showDoNotTouch } from "../utils/string/doNotTouch";

export default function Page() {
  const [guilds, setGuilds] = useState<GuildDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [posts, setPosts] = useState<PostDto[]>([]);

  useEffect(() => {
    try {
      setIsLoading(true);
      getPopularPosts(1, 5).then((response) => {
        const data = response.data.data as PostListResponseDto;
        if (Array.isArray(data.postList)) {
          setPosts(data.postList);
        } else {
          setPosts([]);
        }
      });
      getGuildList(1, 5)
        .then((response) => {
          const data = response.data.data as GuildListResponseDto;
          if (Array.isArray(data.guildList)) {
            setGuilds(data.guildList);
          } else {
            setGuilds([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      showDoNotTouch();
    } catch (error) {
      console.log("Guild fetch error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {/* <Slider></Slider> */}
      <div className="flex flex-col max-w-[1200px] mx-auto py-[28px] gap-[24px]">
        <div className="flex flex-col gap-[12px]">
          <LeagueHeaderComponent guildLength={guilds.length} />
          <div className="flex flex-col ">
            <div className="flex bg-brandcolor text-white dark:bg-dark font-thin rounded-t-[4px] w-full whitespace-nowrap">
              <div className="flex-[0.25] text-center px-[8px]">순위</div>
              <div className="flex-[1] text-center px-[8px]">길드명</div>
              <div className="flex-[2] text-center px-[8px]">길드소개</div>
              <div className="flex-[0.25] text-center px-[8px]">길드원</div>
              <div className="flex-[0.25] text-center px-[8px]">승</div>
              <div className="flex-[0.25] text-center px-[8px]">패</div>
              <div className="flex-[0.5] text-center px-[8px]">티어</div>
              <div className="flex-[0.5] text-center px-[8px]">래더점수</div>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center py-[28px]">
                <p>로딩 중...</p>
              </div>
            ) : (
              <>
                {guilds.map((guild) => (
                  <GuildInfoComponent key={guild.id} guild={guild} />
                ))}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col py-[12px] gap-[12px] bg-white dark:bg-dark rounded-[12px] shadow-md">
          <p className="p-[12px] text-[14px] font-bold">LOLFIGHT 인기 게시글</p>
          <div>
            <div className="w-full py-[8px] text-sm flex border-t border-b border-brandborder dark:border-branddarkborder bg-[#f4f7ff] dark:bg-branddark">
              <div className="w-1/12 flex items-center justify-center text-brandcolor font-semibold">
                추천
              </div>
              <div className="w-1/12 flex items-center justify-center text-brandcolor font-semibold">
                말머리
              </div>
              <div className="w-1/2 flex items-center justify-center text-brandcolor font-semibold">
                제목
              </div>
              <div className="w-2/12 flex items-center justify-center text-brandcolor font-semibold">
                작성자
              </div>
              <div className="w-1/6 flex items-center justify-center text-brandcolor font-semibold">
                작성일
              </div>
              <div className="w-1/12 flex items-center justify-center text-brandcolor font-semibold">
                조회수
              </div>
            </div>
            <div className="flex flex-col gap-[2px] py-[8px]">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <BoardInfoComponent
                    key={`${post.postBoard}-${post.id}`}
                    data={post}
                    slug={`board/${convertBoardNameToCode(post.postBoard)}`}
                  />
                ))
              ) : (
                <div className="w-full text-center text-gray-400 py-[20px] text-[14px]">
                  해당 글이 존재하지 않습니다 😅
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

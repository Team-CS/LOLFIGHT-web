"use client";
import { useEffect, useState } from "react";
import GuildInfoComponent from "./components/GuildInfoComponent";
import LeagueHeaderComponent from "./components/LeagueHeaderComponent";
import { GuildDTO } from "@/src/common/DTOs/guild/guild.dto";
import { getGuildList } from "@/src/api/guild.api";
import Pagination from "@mui/material/Pagination";
import LeaguePodium from "./components/LeaguePodium";

export default function Page() {
  const [guildList, setGuildList] = useState<GuildDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const [searchTerm, setSearchTerm] = useState<string>(""); // 검색어
  const guildsPerPage = 10;

  useEffect(() => {
    getGuildList()
      .then((response) => {
        const sortedGuilds = response.data.data.sort(
          (a: GuildDTO, b: GuildDTO) => {
            const rankA =
              a.guildRecord?.recordRanking !== "기록없음"
                ? parseInt(a.guildRecord!.recordRanking, 10)
                : Infinity;
            const rankB =
              b.guildRecord?.recordRanking !== "기록없음"
                ? parseInt(b.guildRecord!.recordRanking, 10)
                : Infinity;
            return rankA - rankB;
          }
        );

        setGuildList(sortedGuilds);
        setTotalPages(Math.ceil(sortedGuilds.length / guildsPerPage)); // sortedGuilds 길이 사용
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlePageClick = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };

  const filteredGuilds = guildList.filter((guild) =>
    guild.guildName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedGuilds = filteredGuilds.slice(
    (currentPage - 1) * guildsPerPage,
    currentPage * guildsPerPage
  );

  const topGuilds = [0, 1, 2]
    .map((i) => guildList[i])
    .filter(
      (guild) =>
        guild &&
        guild.guildRecord &&
        guild.guildRecord.recordRanking !== "기록없음"
    );

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-[12px] py-[28px]">
      {topGuilds.length === 0 ? (
        <div className="w-full text-center text-gray-400 py-[20px] text-[14px]">
          순위 기록이 없습니다 😅
        </div>
      ) : (
        <LeaguePodium
          first={topGuilds[0]}
          second={topGuilds[1]}
          third={topGuilds[2]}
        />
      )}

      <LeagueHeaderComponent
        guildLength={guildList.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <div className="flex flex-col border rounded-t-[12px] dark:border-branddark">
        <div className="flex bg-brandcolor text-white dark:bg-dark font-thin rounded-t-[12px] w-full whitespace-nowrap">
          <div className="flex-[0.25] text-center px-[8px]">순위</div>
          <div className="flex-[1] text-center px-[8px]">길드이름</div>
          <div className="flex-[2] text-center px-[8px]">길드소개</div>
          <div className="flex-[0.25] text-center px-[8px]">길드원</div>
          <div className="flex-[0.25] text-center px-[8px]">승</div>
          <div className="flex-[0.25] text-center px-[8px]">패</div>
          <div className="flex-[0.5] text-center px-[8px]">티어</div>
          <div className="flex-[1] text-center px-[8px]">길드장</div>
        </div>
        <div className="flex flex-col">
          {paginatedGuilds.map((guild) => (
            <GuildInfoComponent key={guild.id} guild={guild} />
          ))}
        </div>
      </div>
      <div className="notice__pagination w-full flex justify-center mt-1 p-3">
        <Pagination
          count={totalPages}
          shape="rounded"
          boundaryCount={2}
          onChange={(event, page) => handlePageClick(event, page)}
          sx={{
            ".dark & .Mui-selected": {
              backgroundColor: "#4C4C4C",
              color: "#CACACA", // 텍스트 색상
              "&:hover": {
                backgroundColor: "#707070", // 호버 시 색상
              },
            },
            ".dark & .MuiPaginationItem-root": {
              color: "#EEEEEE", // 선택되지 않은 아이템의 기본 텍스트 색상
            },
            ".dark & .MuiPaginationItem-icon": {
              color: "#EEEEEE", // 텍스트 색상
            },
          }}
        />
      </div>
    </div>
  );
}

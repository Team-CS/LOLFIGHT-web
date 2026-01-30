"use client";

import { JudgmentDto } from "@/src/common/DTOs/judgment/judgment.dto";
import React, { useEffect, useState } from "react";
import JudgmentHeadComponet from "../components/JudgmentHeadComponet";
import { getJudgment } from "@/src/api/judgment.api";
import JudgmentBodyComponent from "../components/JudgmentBodyComponent";
import { notFound } from "next/navigation";

type PageProps = {
  id: number;
};

export default function Page({ params }: { params: PageProps }) {
  const [judgment, setJudgment] = useState<JudgmentDto>();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!judgment) {
      getJudgment(params.id)
        .then((response) => {
          setJudgment(response.data.data);
        })
        .catch((error) => {
          console.log(error);
          setError(true);
        });
    }
  }, []);

  if (error) {
    notFound();
  }

  if (!judgment) {
    return (
      <div className="flex justify-center items-center py-[60px] text-gray-500">
        <div className="flex flex-col items-center gap-[12px]">
          <div className="w-[40px] h-[40px] border-4 border-gray-200 border-t-red-500 rounded-full animate-spin" />
          <span className="text-[14px]">로딩 중...</span>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col max-w-[1200px] h-full mx-auto w-full py-[32px] gap-[20px] px-[12px] md:px-0">
        <div className="w-full bg-white dark:bg-dark rounded-[16px] shadow-lg border border-gray-100 dark:border-branddarkborder overflow-hidden">
          <div className="head border-b border-gray-100 dark:border-branddarkborder">
            <JudgmentHeadComponet judgment={judgment!} />
          </div>
          <div className="body">
            <JudgmentBodyComponent judgment={judgment!} />
          </div>
        </div>
      </div>
    </>
  );
}

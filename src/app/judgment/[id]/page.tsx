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
          console.log(response);
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
      <div className="flex justify-center items-center py-[24px] text-gray-600">
        로딩 중...
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col max-w-[1200px] h-full mx-auto w-full py-[28px] gap-[24px]">
        <div className="w-full bg-white dark:bg-dark rounded-[12px] shadow-md">
          <div className="head">
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

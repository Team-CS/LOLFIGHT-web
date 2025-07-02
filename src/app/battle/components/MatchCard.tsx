interface MatchCardProps {
  opponent: string;
  date: string;
  status: "upcoming" | "finished";
  resultText: "승리" | "패배" | "대기중";
}

const MatchCard = ({ opponent, date, status, resultText }: MatchCardProps) => {
  const isFinished = status === "finished";

  const getResultColor = () => {
    switch (resultText) {
      case "승리":
        return "text-blue-500";
      case "패배":
        return "text-red-500";
      case "대기중":
        return "text-gray-500";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      className={`p-[12px] rounded-lg border border-brandborder dark:border-branddarkborder flex flex-col gap-[4px] ${
        isFinished ? "bg-gray-100 dark:bg-black" : "bg-white dark:bg-brandgray"
      }`}
    >
      <p
        className={`text-[14px] font-medium ${
          isFinished ? "text-gray-400" : "text-branddark dark:text-white"
        }`}
      >
        {isFinished ? "✅ 최근 내전 결과" : "🔥 예정된 내전"}
      </p>
      <p className="text-[13px] text-gray-600 dark:text-gray-300">
        상대팀: <span className="font-semibold">{opponent}</span>
      </p>
      <p className="text-[13px] text-gray-600 dark:text-gray-300">
        일정: {date}
      </p>
      <p className="text-[13px] text-gray-600 dark:text-gray-300">
        상태:{" "}
        <span className={`${getResultColor()} font-semibold`}>
          {resultText}
        </span>
      </p>
    </div>
  );
};

export default MatchCard;

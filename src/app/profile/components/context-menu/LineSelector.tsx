import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import constant from "@/src/common/constant/constant";
import { useIsMobile } from "@/src/hooks/useMediaQuery";

interface Props {
  currentLine: string;
  isMaster: boolean;
  onChangeLine: (line: string) => void;
}

const ALL_LINES = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

const LineSelector = (props: Props) => {
  const { currentLine, isMaster, onChangeLine } = props;

  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const filteredLines = ALL_LINES.filter((line) => line !== currentLine);

  const toggleDropdown = () => {
    if (buttonRef.current && isMaster) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.bottom });
      setOpen((prev) => !prev);
    }
  };

  const closeDropdown = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`flex items-center gap-[4px] font-medium rounded cursor-pointer ${
          isMobile ? "text-[10px]" : "text-[14px]"
        }`}
      >
        <img
          src={`${constant.SERVER_URL}/public/ranked-positions/${currentLine}.png`}
          alt={currentLine}
          className={`${isMobile ? "w-[15px] h-[15px]" : "w-[25px] h-[25px]"}`}
        />
        {currentLine}
      </button>

      {open &&
        ReactDOM.createPortal(
          <div
            className="absolute z-[9999] w-fit bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded shadow-lg"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          >
            {filteredLines.map((line) => (
              <button
                key={line}
                onClick={() => {
                  onChangeLine(line);
                  closeDropdown();
                }}
                className={`flex items-center gap-[4px] w-full hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                  isMobile
                    ? "px-[8px] py-[4px] text-[12px]"
                    : "px-[12px] py-[8px] text-[14px]"
                }`}
              >
                <img
                  src={`${constant.SERVER_URL}/public/ranked-positions/${line}.png`}
                  alt={line}
                  className={`${
                    isMobile ? "w-[15px] h-[15px]" : "w-[20px] h-[20px]"
                  }`}
                />
                <span>{line}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};

export default LineSelector;

import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import constant from "@/src/common/constant/constant";
import { useIsMobile } from "@/src/hooks/useMediaQuery";
import Image from "next/image";

interface Props {
  currentLine?: string;
  onChangeLine: (line: string) => void;
}

const ALL_LINES = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

const LineSelector = (props: Props) => {
  const { currentLine, onChangeLine } = props;

  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filteredLines = ALL_LINES.filter((line) => line !== currentLine);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const toggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY,
      });
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
        className={`flex items-center gap-[4px] font-medium rounded cursor-pointer border bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-neutral-700 dark:border-neutral-600 dark:hover:bg-neutral-600 transition ${
          isMobile ? "text-[10px] px-[6px] py-[4px]" : "text-[14px] px-[8px] py-[4px]"
        }`}
      >
        <Image
          src={`${constant.SERVER_URL}/public/ranked-positions/${currentLine}.png`}
          alt="curentLine"
          width={25}
          height={25}
          className={`${isMobile ? "w-[15px] h-[15px]" : "w-[25px] h-[25px]"}`}
        />
        {currentLine}
      </button>

      {open &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
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
                <Image
                  src={`${constant.SERVER_URL}/public/ranked-positions/${line}.png`}
                  alt="line"
                  width={20}
                  height={20}
                  className={`${
                    isMobile ? "w-[15px] h-[15px]" : "w-[20px] h-[20px]"
                  }`}
                />
                <span>{line}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
};

export default LineSelector;

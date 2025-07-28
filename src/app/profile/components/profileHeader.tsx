import React from "react";

export interface ProfileHeaderProps {
  title: string;
  onClick: () => void;
}

export const ProfileHeader = (props: ProfileHeaderProps) => {
  const { title, onClick } = props;
  return (
    <button
      onClick={onClick}
      className="hoverable flex border border-[#CDCDCD] justify-center items-center py-[4px] rounded-[4px] font-normal hover:bg-[#EFEFEF] dark:hover:bg-brandgray"
    >
      {title}
    </button>
  );
};

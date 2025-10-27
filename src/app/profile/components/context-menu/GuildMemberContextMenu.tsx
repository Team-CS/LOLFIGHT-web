import React, { useEffect, useRef } from "react";
import { GuildDto } from "@/src/common/DTOs/guild/guild.dto";
import { MemberDto } from "@/src/common/DTOs/member/member.dto";

interface Props {
  visible: boolean;
  position: { x: number; y: number };
  guildMember?: MemberDto;
  guild?: GuildDto;
  onClose: () => void;
  expulsionMember?: (member: MemberDto) => void;
  transferGuildMaster?: (memberName: string, guildName: string) => void;
}

const GuildMemberContextMenu = ({
  visible,
  position,
  guildMember,
  guild,
  onClose,
  expulsionMember,
  transferGuildMaster,
}: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  if (!visible || !guildMember || !guild) return null;

  return (
    <div
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
      className="absolute z-50 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded shadow-md"
      style={{
        top: position.y,
        left: position.x,
        minWidth: "160px",
      }}
    >
      <button
        className="block w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-500/20"
        onClick={() => {
          expulsionMember?.(guildMember);
          onClose();
        }}
      >
        추방
      </button>
      <button
        className="block w-full text-left px-4 py-2 hover:bg-green-100 dark:hover:bg-green-500/20"
        onClick={() => {
          transferGuildMaster?.(guildMember.memberName, guild.guildName);
          onClose();
        }}
      >
        길드 마스터 변경
      </button>
    </div>
  );
};

export default GuildMemberContextMenu;

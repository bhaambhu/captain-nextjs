import React from "react";
import { BiInfoCircle } from "react-icons/bi"
import { twMerge } from "tailwind-merge";
import twColors from "../../config/twColors";

export default function InfoPill({ message, className='' }) {
  if (!message) return null;
  return (
    <div
      className={twMerge(twColors.infoContainer + " font-overline uppercase text-xs cursor-default font-bold border shadow-sm justify-center rounded p-2 flex gap-1 w-fit "+className)}
    >
      <BiInfoCircle size={14} />
      {message}
    </div>
  );
}

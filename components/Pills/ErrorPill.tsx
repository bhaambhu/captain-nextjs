import React from "react";
import { BiErrorAlt } from "react-icons/bi"
import { twMerge } from "tailwind-merge";
import colors from "../../config/colors";
import fonts from "../../config/fonts";
import twColors from "../../config/twColors";

export default function ErrorPill({ message, visible }) {
  if (!visible || !message) return null;
  return (
    <div
      className={twMerge(twColors.errorContainer + " font-overline border shadow-sm rounded p-2 flex gap-2 justify-center items-center")}
    >
      <BiErrorAlt size={18} />
      {message}
    </div>
  );
}

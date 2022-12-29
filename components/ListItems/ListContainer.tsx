import React from "react";
import { twMerge } from "tailwind-merge";

export default function ListContainer({ className='', ...otherProps }) {
  return (
    <div
      className={twMerge(`p-2 border rounded-sm flex flex-col gap-2 ${className}`)}
      {...otherProps}
    />
  );
}

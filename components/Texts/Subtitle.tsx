import React from 'react'
import { twMerge } from 'tailwind-merge';

export default function Subtitle({ className = '', ...props }) {
  return (
    <div
      className={twMerge(`font-subtitle_1 text ${className}`)}
      {...props}
    />
  );
}

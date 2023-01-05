import React from 'react'
import { twMerge } from 'tailwind-merge';

export default function Body({ className = '', ...props }) {
  return (
    <div
      className={twMerge(`font-body_1 text ${className}`)}
      {...props}
    />
  );
}

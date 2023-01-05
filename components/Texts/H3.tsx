import React from 'react'
import { twMerge } from 'tailwind-merge';

export default function H3({ className = '', ...props }) {
  return (
    <div
      className={twMerge(`font-h3_headline text-xl ${className}`)}
      {...props}
    />
  );
}

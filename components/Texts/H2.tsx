import React from 'react'
import { twMerge } from 'tailwind-merge';

export default function H2({ className = '', ...props }) {
  return (
    <div
      className={twMerge(`font-h2_headline text-2xl ${className}`)}
      {...props}
    />
  );
}

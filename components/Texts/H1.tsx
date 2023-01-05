import React from 'react'
import { twMerge } from 'tailwind-merge';

export default function H1({ className = '', ...props }) {
  return (
    <div
      className={twMerge(`font-h1_headline text-3xl ${className}`)}
      {...props}
    />
  );
}

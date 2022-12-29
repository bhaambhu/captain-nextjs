import React from 'react'
import { twMerge } from 'tailwind-merge';

export default function SectionHeader({ className = '', bar = true, ...props }) {
  return (
    <div
      className={twMerge(`font-overline text-sm ${bar ? 'border-t border-current mt-2 pt-3 border-dashed' : ''} ${className}`)}
      {...props}
    />
  );
}

import { useTheme } from 'next-themes';
import React from 'react'
import { MdDarkMode } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { Button } from './Buttons/Button'

export default function DarkModeToggle({className=''}) {
  const { theme, setTheme } = useTheme();
  return (
    <div
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={twMerge('flex w-fit h-fit items-center px-2 py-2 rounded-full bg-san-on-surface text-san-surface dark:bg-san-dark-on-surface dark:text-san-dark-surface '+className)}
    >
      <MdDarkMode />
    </div>
  )
}

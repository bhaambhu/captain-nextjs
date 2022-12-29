import { useTheme } from 'next-themes';
import React from 'react'
import { MdDarkMode } from 'react-icons/md';
import { Button } from './Buttons/Button'

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='flex items-center px-2 mx-2 rounded-full bg-san-on-surface text-san-surface dark:bg-san-dark-on-surface dark:text-san-dark-surface'
    >
      <MdDarkMode />
    </div>
  )
}

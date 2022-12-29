import React from 'react'
import { twMerge } from 'tailwind-merge';
import routes from '../config/routes'
import twColorTheme from '../config/twColors';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo'
import NavBarLink from './NavBarLink'

function Navbar() {
  let user: Boolean = false;
  return (
    <div className={twMerge(twColorTheme.twNavbarColors + 'p-5')}>
      <div className='flex'>
        <Logo>Captain</Logo>
        <DarkModeToggle />
        <div
          className='border-l border-current h-8 ml-4 pl-4 gap-2.5 flex items-center'
        >
          <NavBarLink to={routes.HOME}>Home</NavBarLink>
          <NavBarLink to={routes.DATA}>Data</NavBarLink>
          <NavBarLink to={routes.TOPICS}>Topics</NavBarLink>
          <NavBarLink to={routes.PATHS}>Paths</NavBarLink>
          <NavBarLink to={routes.EXAMS}>Exams</NavBarLink>
          <NavBarLink to={routes.SUBJECTS}>Subjects</NavBarLink>
        </div>
        <div
          className='flex w-full justify-end gap-2.5 items-center'
        >
          {user ? (
            <>
              <NavBarLink to={routes.PROFILE}>Sanjay</NavBarLink>
            </>
          ) : (
            <>
              <NavBarLink to={routes.LOGIN}>Log In</NavBarLink>
              <NavBarLink to={routes.REGISTER}>Register</NavBarLink>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
import React from 'react'
import colors from '../config/colors'
import routes from '../config/routes'
import Logo from './Logo'
import NavBarLink from './NavBarLink'

function Navbar() {
  let user: Boolean = false;
  return (
    <div className='bg-cclrs-bg-surface p-5'>
      <div className='flex'>
        <Logo>Captain</Logo>
        <div
          className='border-l h-8 ml-4 pl-4 gap-2.5 flex border-cclrs-bg-disabled items-center'
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
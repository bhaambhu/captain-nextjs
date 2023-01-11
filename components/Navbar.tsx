import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge';
import routes from '../config/routes'
import twColors from '../config/twColors';
import twColorTheme from '../config/twColors';
import useAuth from '../lib/auth/useAuth';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo'
import NavBarLink from './NavBarLink'

function Navbar() {
  const auth = useAuth();
  const user = auth.user;
  const router = useRouter()

  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(()=>{
    setShowSidebar(false)
  }, [router.pathname])

  return (
    <>
      {/* Sidebar BG Blur */}
      {showSidebar && <div onTouchStart={() => setShowSidebar(!showSidebar)} className='z-10 h-screen w-screen fixed backdrop-blur-sm top-0 '>
      </div>}

      {/* Navbar */}
      <header className={twMerge(twColorTheme.twNavbarColors + 'px-3 md:px-6 py-6 border-b sm:flex border-current')}>

        {/* Logo and Dark Mode Toggle */}
        <div className='flex justify-between items-center sm:flex-row-reverse sm:justify-end sm:gap-3'>
          <DarkModeToggle className='sm:mt-2' />
          <Logo>Captain</Logo>

          {/* Sidebar Toggle Button */}
          <div className='sm:hidden mt-1'>
            {showSidebar &&
              <svg
                onClick={() => setShowSidebar(!showSidebar)}
                className="fixed z-50 flex items-center cursor-pointer right-3 fill-current"
                // fill="white"
                viewBox="0 0 100 80"
                width="30"
                height="30"
              >
                <rect width="100" height="14"></rect>
                <rect y="30" x='20' width="80" height="14"></rect>
                <rect y="60" x='40' width="60" height="14"></rect>
              </svg>
            }
            <svg
              onClick={() => setShowSidebar(!showSidebar)}
              className=" z-30 flex items-center cursor-pointer fill-current"
              // fill="white"
              viewBox="0 0 100 80"
              width="30"
              height="30"
            >
              <rect width="100" height="14"></rect>
              <rect y="30" x='20' width="80" height="14"></rect>
              <rect y="60" x='40' width="60" height="14"></rect>
            </svg>

          </div>
        </div>

        {/* Nav Buttons for Desktop Layout */}
        <nav className='hidden sm:flex justify-between pt-2.5 items-center w-full'>
          <div className='justify-center border-l border-current h-8 ml-4 pl-4 gap-2.5 flex items-center'>
            <NavPagesButtons />
          </div>
          {/* User Actions */}
          <div className='flex w-full justify-center sm:justify-end gap-2.5'>
            <NavUserActionButtons />
          </div>
        </nav>

        {/* Sidebar */}
        <div
          className={twMerge(twColors.twNavbarColors+` border-l border-current top-0 flex items-center drop-shadow-2xl right-0 w-[60vw] pointer-events-none p-10 fixed h-full z-40 ease-in-out duration-300 ${showSidebar ? "translate-x-0 " : "translate-x-full"
            }`)}
        >
          <nav className=' flex flex-col text-xl font-mono gap-10 justify-between w-full  items-center'>
            <NavPagesButtons />
            <hr className='w-full border-current' />
            <NavUserActionButtons />
          </nav>
        </div>

      </header>
    </>
  )
}

function NavPagesButtons() {
  const auth = useAuth();
  return (
    <>
      <NavBarLink to={routes.HOME}>Home</NavBarLink>
      <NavBarLink to={routes.PATHS}>Paths</NavBarLink>
      <NavBarLink to={routes.SUBJECTS}>Subjects</NavBarLink>
      <NavBarLink to={routes.TOPICS}>Topics</NavBarLink>
      {auth.isSuperUser() && <NavBarLink to={routes.USERS}>Users</NavBarLink>}
      {auth.isStaff() && <NavBarLink to={routes.DATA}>Data</NavBarLink>}
      {/* <NavBarLink to={routes.EXAMS}>Exams</NavBarLink> */}
    </>
  )
}

function NavUserActionButtons() {
  const auth = useAuth();
  return (
    <>
      {auth.user ? (
        <>
          <NavBarLink to={routes.PROFILE}>{auth.user.display_name}</NavBarLink>
        </>
      ) : (
        <>
          <NavBarLink to={routes.LOGIN}>Log In</NavBarLink>
          <NavBarLink to={routes.REGISTER}>Register</NavBarLink>
        </>
      )}
    </>
  )
}

export default Navbar
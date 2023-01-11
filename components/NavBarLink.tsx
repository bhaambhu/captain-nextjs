import { useRouter } from 'next/router';
import React, { ReactNode } from 'react'
import { CSSProperties } from 'react'
import { twMerge } from 'tailwind-merge';
import twColorTheme from '../config/twColors';

type AppProps = {
  to: string;
  children: ReactNode;
  className?: string;
}

function NavBarLink({ className, to, children }: AppProps) {
  const router = useRouter();
  return (
    <button
      className={
        twMerge(((router.pathname == to) ? twColorTheme.twNavbarLinkColors.current : twColorTheme.twNavbarLinkColors.others) + 'font-button pointer-events-auto')
      }
      onClick={()=>{
        router.push(to)
      }}
      >{children}</button>
  )
}

export default NavBarLink
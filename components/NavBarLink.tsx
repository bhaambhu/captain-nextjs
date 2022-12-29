import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react'
import { CSSProperties } from 'react'
import { twMerge } from 'tailwind-merge';
import twColorTheme from '../config/twColors';

type AppProps = {
  to: string;
  children: ReactNode;
  style?: CSSProperties;
}

function NavBarLink({ style, to, children }: AppProps) {
  const router = useRouter();
  return (
    <Link
      className={
        twMerge(((router.pathname == to) ? twColorTheme.twNavbarLinkColors.current : twColorTheme.twNavbarLinkColors.others) + 'font-button')
      }
      href={to}>{children}</Link>
  )
}

export default NavBarLink
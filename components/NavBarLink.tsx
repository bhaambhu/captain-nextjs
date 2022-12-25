import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react'
import { CSSProperties } from 'react'

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
        router.pathname == to
          ? 'text-cclrs-secondary-normal font-button'
          : 'text-cclrs-dark-strong font-button'
      }
      href={to}>{children}</Link>
  )
}

export default NavBarLink
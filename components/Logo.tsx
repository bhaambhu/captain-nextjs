import Link from 'next/link';
import React, { ReactNode } from 'react'
import colors from '../config/colors';

type AppProps = {
  children: ReactNode
}

function Logo({children}:AppProps) {
  return (
    <Link
    className='font-logo text-3xl'
    href={"/"}
    >
      {children}
    </Link>
  );
}

export default Logo
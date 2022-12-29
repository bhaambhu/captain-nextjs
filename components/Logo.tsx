import React, { ReactNode } from 'react'
import colors from '../config/colors';

type AppProps = {
  children: ReactNode
}

function Logo({children}:AppProps) {
  return (
    <div
    className='font-logo text-xl'
    >
      {children}
    </div>
  );
}

export default Logo
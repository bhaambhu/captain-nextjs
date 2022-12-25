import React, { ReactNode } from 'react'
import colors from '../config/colors';

type AppProps = {
  children: ReactNode
}

function Logo({children}:AppProps) {
  return (
    <div
    className='font-logo text-xl text-cclrs-dark-strong'
      // style={{
      //   fontSize: 20,
      //   fontFamily: "old_english",
      //   color: colors.textStrong,
      // }}
    >
      {children}
    </div>
  );
}

export default Logo
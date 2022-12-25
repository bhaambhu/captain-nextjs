import React from 'react'
import colors from '../../config/colors';
import fonts from '../../config/fonts';

export default function SectionHeader(props) {
  return (
    <div
      className='font-overline text-cclrs-dark-weak text-sm'
      // style={{
      //   justifyContent: "center",
      //   alignContent: "center",
      //   // display: "flex",
      //   flexDirection: "row",
      //   flex: 1,
      //   fontFamily: fonts.overline,
      //   color: colors.textWeak,
      //   fontSize: 14,
      // }}
      {...props}
    />
  );
}

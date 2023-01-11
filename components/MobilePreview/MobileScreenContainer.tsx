import React from "react"
import Image from "next/image";

export default function MobileScreenContainer({ children }) {
  return (
    // Dimensions of Image
    <div className='min-w-[314px] w-[314px] max-sm:mx-auto max-sm:flex justify-center h-[641px] mt-3 select-none bg-transparent drop-shadow-2xl'>
      {/* Container */}
      <div className='w-[80%] h-[80%] relative grid'>
        <Image src={'/assets/iphone-trimmed.png'} alt='Iphone for illustration' fill />
        {/* Screen */}
        <div className='w-[86%] h-[75.08%] ml-[7.01%] mt-[26.57%] z-10 grid-cols-1 grid-rows-1'>
        {/* <div className='w-[270px] h-[482px] ml-[22px] mt-[83px] z-10 grid-cols-1 grid-rows-1'> */}
          {/* Content */}
          <div className=' w-full h-full bg-san-surface dark:bg-san-dark-surface'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
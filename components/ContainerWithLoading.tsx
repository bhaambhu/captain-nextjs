import React from 'react'
import { twMerge } from 'tailwind-merge'
import LottiePlayer from './LottiePlayer'

export default function ContainerWithLoading({ loading = false, classNamesForLoading = '', className = '', ...otherProps }) {
  return (
    <div className="w-full h-fit relative flex mb-3">
      <div className={twMerge("w-full h-fit  " + className)} {...otherProps} />
      {loading &&
        <div className="w-full h-full absolute top-0 left-0 ">
          <LottiePlayer
            loop
            className={twMerge(`opacity-80 bg-white ` + classNamesForLoading)}
            src={'https://assets9.lottiefiles.com/packages/lf20_GzIQOnSaf8.json'} />
        </div>
      }
    </div>

    // <div className='relative w-full h-full'>
    //   <div className={twMerge(`w-full h-full absolute overflow-hidden ` + className)} {...otherProps} />
    //   {loading &&
    //     <div className='absolute w-full h-full '>
    // <LottiePlayer
    //   loop
    //   className={twMerge(`opacity-90 bg-white `+classNamesForLoading)}
    //   src={'https://assets9.lottiefiles.com/packages/lf20_GzIQOnSaf8.json'} />
    //     </div>
    //   }
    // </div>
  )
}

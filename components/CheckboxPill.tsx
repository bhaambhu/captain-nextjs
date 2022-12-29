import React from 'react'
import { twMerge } from 'tailwind-merge'
import twColors from '../config/twColors'

export default function CheckboxPill({className='', checked=false, readOnly=false, children, onChange}) {
  return (
    <div
        className={twMerge(`h-[25px] text-xs w-fit inline-flex rounded-sm ${checked ? twColors.checked : twColors.unchecked } ${className}`)}
      >
        {/* Checkbox */}
        <div className="w-[22px] pl-1">
          <input
            type="checkbox"
            readOnly={readOnly}
            onChange={onChange}
            className="w-full h-full"
            checked={checked}
          />{" "}
        </div>
        {/* Label */}
        <div className={`uppercase font-overline px-1 flex items-center`} >
          {children}
        </div>
      </div>
  )
}

import React from 'react'
import { MdCheckCircleOutline, MdLock } from 'react-icons/md';
import { TbArrowRotaryLastRight } from 'react-icons/tb';
import { twMerge } from 'tailwind-merge';
import { activityState } from '../../config/enums'

export default function ListItemStudyPlan({
  title,
  subtitle,
  className = '',
  onClick,
  currentTopic = false,
  otherprops
}) {

  return (
    <div
      className={`flex border-current w-fit cursor-pointer ${currentTopic ? 'bg-san-primary-container text-san-on-primary-container dark:bg-san-dark-primary dark:text-san-dark-on-primary' : 'bg-san-surface text-san-on-surface dark:text-san-dark-on-surface dark:bg-san-dark-surface'} border rounded-sm ${className}`}
      {...otherprops}
    >
      <div
        onClick={onClick} className={`flex flex-col p-1 w-full`}
      >
        {/* Icon and Subtitle */}
        <div className="flex items-center mb-1">
          {!currentTopic && (
            <MdLock
              size="15"
              className="mr-1"
            />
          )}
          <div className="text-xs font-overline">
            {subtitle}
          </div>
        </div>
        {/* Title */}
        <div className="font-overline">
          <div>{title}</div>
        </div>
        {/* Buttons */}
        {currentTopic && <div className={`
        font-overline 
        text-xs 
        self-end  
        rounded-sm 
        p-0.5
        px-1
        mt-1
        text-san-on-primary-container
        border
        border-current
        bg-san-surface     
        `} >
          CONTINUE
        </div>}
      </div>
    </div>
  );
}

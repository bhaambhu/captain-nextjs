import React from 'react'
import { twMerge } from 'tailwind-merge';
import SectionHeader from './Texts/SectionHeader';

export default function JSONViewer({ heading=null, children, className='' }) {
  return (
    <div
      className={twMerge('table table-fixed w-full ' + className)}
    >
      {heading && <SectionHeader>{heading}</SectionHeader>}
      <pre
        className='p-2.5 mt-2 bg-san-primary/10 dark:bg-san-dark-primary/10 border-san-outline border font-bold  text-san-on-primary-container dark:text-san-dark-on-primary-container rounded-sm text-sm max-h-[500px] leading-[21px] overflow-y-auto whitespace-pre-wrap font-mono '
      >
        {JSON.stringify(children, null, 2)}
      </pre>
    </div>
  );
}

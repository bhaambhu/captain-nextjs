import React from 'react'
import colors from '../config/colors';
import SectionHeader from './Texts/SectionHeader';

export default function JSONViewer({ heading, children }) {
  return (
    <div
      className='table table-fixed w-full'
    >
      {heading && <SectionHeader>{heading}</SectionHeader>}
      <pre
        className='p-2.5 bg-cclrs-dark-strong rounded text-sm max-h-[500px] leading-[21px] overflow-scroll font-mono text-cclrs-secondary-light'
      >
        {JSON.stringify(children, null, 2)}
      </pre>
    </div>
  );
}

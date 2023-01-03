import React from "react";
import { twMerge } from "tailwind-merge";

function Clickable({ className = '', children, onClick }) {
  return (
    <div
      onClick={onClick}
      className={twMerge(`cursor-pointer font-overline text-san-on-surface dark:text-san-dark-on-surface self-start ${className}`)}
    >
      {children}
    </div>
  );
}

function Button({ className = '', onClick, ...props }) {
  return (
    <Clickable
      onClick={onClick}
      className={twMerge(`bg-san-surface dark:bg-san-dark-surface border rounded-sm border-current p-1.5 ${className}`)}
      {...props}
    >
      {props.children}
    </Clickable>
  );
}

function TextButton({ className='', children, onClick }) {
  return (
    <Clickable onClick={onClick} className={className}>
      {children}
    </Clickable>
  );
}

export { Button, TextButton };

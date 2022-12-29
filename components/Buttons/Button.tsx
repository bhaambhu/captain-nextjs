import React from "react";
import { twMerge } from "tailwind-merge";

function Clickable({ className = '', children, onClick }) {
  return (
    <div
      onClick={onClick}
      className={twMerge(`cursor-pointer font-overline text-cclrs-dark-strong self-start ${className}`)}
    >
      {children}
    </div>
  );
}

function Button({ className = '', ...props }) {
  return (
    <Clickable
      onClick={props.onClick}
      className={twMerge(`bg-cclrs-bg-surface border rounded-sm border-cclrs-dark-strong p-1.5 ${className}`)}
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

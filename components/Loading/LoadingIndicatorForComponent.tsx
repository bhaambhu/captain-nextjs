import React from "react";

export default function LoadingIndicatorForComponent({ visible = false }) {

  if (!visible) return null;

    return (
      <div className="w-full h-full absolute flex">
        {/* Window */}
        <div 
        className="inline-flex w-full h-full items-center justify-center backdrop-blur"
        >
          <div 
          className="rounded border border-current backdrop-blur-xl bg-white shadow-2xl"
          >
            <div className="
              animate-text 
              bg-gradient-to-r 
              from-black
              via-transparent
              to-black
              bg-clip-text 
              text-transparent 
              text-6xl 
              font-logo
              p-12
            ">
              Captain
            </div>
          </div>
        </div>
      </div>
    );
}
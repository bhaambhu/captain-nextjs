import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export default function LoadingIndicatorFullScreen({ visible = false }) {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!visible) return null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      <div className="w-full h-full fixed left-0 top-0">
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
      </div>,
      document.getElementById("modal-root") as HTMLElement
    );
  } else {
    return null;
  }

}
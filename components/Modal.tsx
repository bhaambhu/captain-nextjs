import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

function Modal() {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (isBrowser) {
    return ReactDOM.createPortal(
      <div className="w-full h-full fixed left-0 top-0 backdrop-blur">
        <div className="inline-flex w-full h-full items-center justify-center">
          <div className="bg-cclrs-bg-surface rounded-sm p-3">
            <div>Loading...</div>
          </div>
        </div>
      </div>,
      document.getElementById("modal-root") as HTMLElement
    );
  } else {
    return null;
  }

}

export default Modal;
import React, { useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge';

export default function LottiePlayer({ src, className = '', autoplay = true, loop = false, onComplete, otherProps }) {
  const ref = useRef(null);
  React.useEffect(() => {
    import("@lottiefiles/lottie-player");
  }, []);

  useEffect(() => {
    console.log("doc is ready")
    ref.current?.addEventListener("complete", () => {
      console.log("ok")
      if (onComplete != null)
        onComplete();
    });
  }, [ref.current])

  // Doing this becase lottie-player still loops on prop loop=false 
  loop = loop ? loop : null;
  autoplay = autoplay ? autoplay : null;

  return (
    <div className={twMerge('h-full ' + className)}>
      <lottie-player
        id="firstLottie"
        ref={ref}
        autoplay={autoplay}
        loop={loop}
        mode=""

        src={src}
        {...otherProps}
      />
    </div>
  );
}

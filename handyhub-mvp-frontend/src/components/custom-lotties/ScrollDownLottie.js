"use client";

import scrollDownAnimation from "/public/lottie/scroll-down-animation.json";
import Lottie from "react-lottie";

export default function ScrollDownLottie() {
  const lottieSettings = {
    loop: true,
    autoplay: true,

    animationData: scrollDownAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="h-auto w-[50px]">
      <Lottie options={lottieSettings} speed={1} />
    </div>
  );
}

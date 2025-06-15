"use client";

import HolyLoader from "holy-loader";

export default function Toploader() {
  return (
    <HolyLoader
      color="linear-gradient(to left, var(--primary-orange), var(--primary-blue))"
      height="3px"
      speed={120}
      easing="linear"
      showSpinner={true}
      zIndex={1600}
      initialPosition={0.04}
    />
  );
}

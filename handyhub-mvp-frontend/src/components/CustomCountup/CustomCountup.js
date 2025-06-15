"use client";

import CountUp from "react-countup";

export default function CustomCountup({
  start = 0,
  end = 100,
  duration = 2.75,
  delay = 0,
}) {
  return (
    <CountUp
      start={start}
      end={end}
      duration={duration}
      enableScrollSpy={true}
      scrollSpyOnce={true}
      scrollSpyDelay={delay}
    />
  );
}

"use client";

import { cn } from "@/lib/utils";
import { fadeUpWithBlurVariants } from "@/utils/sharedMotionVariants";
import { motion } from "motion/react";

export default function SectionHeader({
  heading = "",
  subHeading = "",
  className,
}) {
  return (
    <motion.section
      className={cn("mx-auto space-y-4 lg:w-3/4 2xl:w-[60%]", className)}
      variants={fadeUpWithBlurVariants()}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <motion.h2
        key={heading}
        variants={fadeUpWithBlurVariants()}
        className="text-3xl font-bold lg:text-4xl xl:text-5xl"
      >
        {heading}
      </motion.h2>
      <motion.p
        key={subHeading}
        variants={fadeUpWithBlurVariants()}
        className="font-dm-sans text-base text-[#707071] lg:text-lg"
      >
        {subHeading}
      </motion.p>
    </motion.section>
  );
}

"use client";

import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import Image from "next/image";
import sectionBanner from "/public/images/home/popular-section-right.png";
import { Medal } from "lucide-react";
import { UsersRound } from "lucide-react";
import { CircleDollarSign } from "lucide-react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { slideLeftVariant } from "@/utils/sharedMotionVariants";

// motion variants
const scaleUpVariant = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
      delay: 0.3,
    },
  },
};

const scaleUpChildVariant = {
  initial: { scale: 0, x: 10 },
  animate: {
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 30,
      mass: 0.1,
    },
  },
};

const qualities = [
  {
    id: 1,
    icon: <Medal />,
    title: "Quality Job",
  },
  {
    id: 2,
    icon: <UsersRound />,
    title: "Top Workers",
  },
  {
    id: 1,
    icon: <CircleDollarSign />,
    title: "No Extra Charge",
  },
  {
    id: 1,
    icon: <Sparkles />,
    title: "100% Satisfaction",
  },
];

export default function Popular() {
  return (
    <ResponsiveContainer className="flex-center-between flex-col gap-y-12 lg:flex-row lg:gap-y-0 2xl:gap-x-8">
      {/* ------------------- Left ---------------------- */}
      <div className="space-y-14 xl:w-[60%]">
        <SectionHeader
          heading="Why We are the Best?"
          subHeading="Our platform brings together a diverse range of expert service providers, from electricians and plumbers to carpenters and cleaners. With professionals you can trust, we ensure that every vendor on our platform is vetted for quality and reliability."
          className="!w-full"
        />

        <motion.div
          variants={scaleUpVariant}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          {qualities?.map((quality, idx) => (
            <motion.div
              key={idx}
              className={cn(
                "flex-center-start gap-x-3 rounded-xl bg-white p-4",
                idx === 0 && "shadow-[0px_0px_10px_5px_rgba(0,0,0,0.05)]",
              )}
              variants={scaleUpChildVariant}
            >
              <span className="flex-center size-11 rounded-xl bg-primary-orange text-white">
                {quality?.icon}
              </span>

              <p className="text-lg font-semibold text-black">
                {quality.title}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ----------------- Right ------------------- */}
      <motion.div
        variants={slideLeftVariant(1.5)}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="w-full lg:w-1/2 xl:w-[40%]"
      >
        <Image
          src={sectionBanner}
          alt="Why are the best section banner"
          height={1200}
          width={1200}
          className="ml-auto block h-auto w-full object-cover xl:w-[90%]"
        />
      </motion.div>
    </ResponsiveContainer>
  );
}

"use client";

import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import HeroSearchBar from "./HeroSearchBar";
import CustomCountup from "@/components/CustomCountup/CustomCountup";
import { Separator } from "@/components/ui/separator";
import HeroCarousel from "./HeroCarousel";
import { GradualSpacing } from "@/moton-variants/GradualSpacing";
import { motion } from "motion/react";
import { fadeUpVariants } from "@/utils/sharedMotionVariants";

// Dummy data
const STATS = [
  { id: 1, title: "Total Workers", value: 30 },
  { id: 2, title: "Total Customers", value: 25 },
  { id: 1, title: "Total Reviews", value: 15 },
];

// motion variants

export default function Hero() {
  return (
    <ResponsiveContainer className="min-h-[calc(100vh - 155px)] min-w-0">
      <motion.section
        variants={fadeUpVariants()}
        initial="initial"
        animate="animate"
        className="text-center"
      >
        <div className="flex-center flex-wrap lg:flex-row">
          <GradualSpacing
            text="Find the perfect"
            className="text-4xl font-extrabold md:text-5xl xl:text-6xl"
          />

          <GradualSpacing
            text=" professional for you"
            className="text-4xl font-extrabold text-primary-blue md:text-5xl xl:text-6xl"
            initialDelay={0.75}
          />
        </div>

        <motion.h1
          key="hero-title"
          variants={fadeUpVariants(1.6)}
          className="mt-5 text-3xl font-semibold md:text-4xl lg:mt-4 xl:text-5xl"
        >
          Book trusted help for home tasks
        </motion.h1>

        <motion.p
          key="hero-desc"
          variants={fadeUpVariants(1.8)}
          className="mx-auto mb-10 mt-5 w-full font-dm-sans text-lg font-normal text-gray-600 md:mt-8 lg:mt-6 lg:w-3/4 2xl:w-1/2"
        >
          Provide a convenient way for users to find, hire and manage service
          providers with an emphasis on ease of use and reliability.
        </motion.p>

        <motion.div key="hero-search-bar" variants={fadeUpVariants(1.8)}>
          <HeroSearchBar />
        </motion.div>

        <motion.div
          key="hero-carousel"
          variants={fadeUpVariants(1.8)}
          className="mb-5 mt-10 lg:mb-10"
        >
          <HeroCarousel />
        </motion.div>
      </motion.section>

      {/* Stats */}
      <section className="flex-center-between mx-auto mt-0 w-full flex-col gap-y-10 lg:mt-16 lg:w-11/12 lg:flex-row lg:gap-y-0 2xl:w-10/12 2xl:gap-x-5">
        <h4 className="hidden font-dm-sans text-3xl font-medium text-foundation-primary-white-dark lg:block lg:w-[60%]">
          <span className="text-black">
            “Our mission is to create a collaborative space
          </span>
          <br />
          Handyhub connections and empowers our members to achieve their goals.”
        </h4>

        <h4 className="block text-center font-dm-sans text-2xl font-medium text-foundation-primary-white-dark lg:hidden lg:w-[60%]">
          <span className="text-black">
            “Our mission is to create a collaborative space,
          </span>{" "}
          Handyhub connections and empowers our members to achieve their goals.”
        </h4>

        <div className="flex-center lg:flex-grow">
          {STATS.map((stat, idx) => (
            <div key={stat.id} className="flex items-stretch">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-primary-orange">
                  <CustomCountup end={stat.value} duration={idx + 1 * 5} />+
                </h1>

                <p className="font-medium text-gray-500">{stat.title}</p>
              </div>

              {idx < STATS.length - 1 && (
                <Separator className="mx-6 h-auto w-[1px] bg-foundation-primary-white-dark" />
              )}
            </div>
          ))}
        </div>
      </section>
    </ResponsiveContainer>
  );
}

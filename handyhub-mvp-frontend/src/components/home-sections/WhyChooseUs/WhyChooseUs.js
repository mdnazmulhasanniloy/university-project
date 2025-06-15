"use client";

import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import { motion } from "motion/react";
import flexibiltyIcon from "/public/images/home/Flexibility.svg";
import credibilityIcon from "/public/images/home/credibilty.svg";
import securityIcon from "/public/images/home/Security.svg";
import supportIcon from "/public/images/home/Support.svg";
import valueIcon from "/public/images/home/Value.svg";
import centerImg from "/public/images/home/Content.png";
import accessibilityIcon from "/public/images/home/accessibility.svg";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import Image from "next/image";
import { BentArrow, DotSquare } from "@/utils/svgLibrary";

const slideRightVariants = {
  initial: {
    x: -50,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
      staggerChildren: 0.4,
      when: "beforeChildren",
    },
  },
};

const slideLeftVariants = {
  initial: {
    x: 50,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
      staggerChildren: 0.4,
      when: "beforeChildren",
    },
  },
};

const leftSideData = [
  {
    img: credibilityIcon,
    title: "Trust and Reliability",
    description:
      "Work with professionals who are thoroughly verified and backed by proven feedback and experience.",
  },
  {
    img: securityIcon,
    title: "Secure Transactions",
    description:
      "Benefit from safe payment methods and protection for every transaction, ensuring financial peace of mind.",
  },
  {
    img: supportIcon,
    title: "Round-the-Clock Support",
    description:
      "Our dedicated support team works 24/7 to resolve all of your queries over the phone or email, no matter where you are located.",
  },
];

const rightSideData = [
  {
    img: flexibiltyIcon,
    title: "Flexibility You Need",
    description:
      "Customizable agreements and payment terms designed to work the way you prefer.",
  },
  {
    img: valueIcon,
    title: "Unbeatable Value",
    description:
      "Get the best services at competitive prices, maximizing value without compromising quality",
  },
  {
    img: accessibilityIcon,
    title: "Accessibility for All",
    description:
      "Our platform is designed to be inclusive and easy to use, ensuring everyone can access top-notch services regardless of location or ability.",
  },
];

export default function WhyChooseUs() {
  return (
    <ResponsiveContainer className="space-y-20">
      <SectionHeader
        heading="Why Choose Us?"
        subHeading="Explore the key benefits that set us apart. From verified professionals to secure payment options, 24/7 support, and unmatched flexibility, we ensure you get the best value for your needs, every step of the way."
        className="text-center"
      />

      <div className="flex flex-col items-center justify-between gap-y-10 space-y-10 lg:flex-row lg:gap-x-12 lg:gap-y-0 lg:space-y-0 2xl:gap-x-20">
        {/* left */}
        <motion.div
          className="flex-1 space-y-8 lg:w-[30%]"
          variants={slideRightVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {leftSideData.map((data) => (
            <motion.div key={data.title} variants={slideRightVariants}>
              <div className="text-secondary-1 mb-2 flex items-center justify-start gap-x-3 lg:justify-end">
                <h4 className="text-2xl font-bold">{data.title}</h4>

                <Image src={data.img} alt={data.title} />
              </div>

              <p className="text-left font-dm-sans text-muted lg:text-right">
                {data.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* center */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true }}
          className="relative flex-1"
        >
          <Image
            src={centerImg}
            alt="Why choose us banner"
            className="w-full"
          />

          {/* Bent arrow icon */}
          <span className="absolute -top-8 left-8">
            <BentArrow />
          </span>

          {/* Dot Square icon */}
          <span className="absolute -bottom-5 -right-5 -z-10">
            <DotSquare />
          </span>
        </motion.div>

        {/* right */}
        <motion.div
          className="flex-1 space-y-8 lg:w-[30%]"
          variants={slideLeftVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {rightSideData.map((data) => (
            <motion.div key={data.title} variants={slideLeftVariants}>
              <div className="text-secondary-1 mb-2 flex items-center justify-start gap-x-3">
                <Image src={data.img} alt={data.title} />
                <h4 className="text-2xl font-bold">{data.title}</h4>
              </div>
              <p className="text-left font-dm-sans text-muted">
                {data.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </ResponsiveContainer>
  );
}

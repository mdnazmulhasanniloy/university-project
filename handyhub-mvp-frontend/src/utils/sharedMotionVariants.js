// motion variants
export const fadeUpVariants = (delay = 0) => ({
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      delay,
      damping: 30,
      mass: 0.5,
      staggerChildren: 0.03,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
  },
});

export const fadeUpWithBlurVariants = (stiffness, damping, mass) => ({
  initial: {
    y: 50,
    opacity: 0,
    filter: "blur(3px)",
  },

  animate: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      stiffness: stiffness || 190,
      damping: damping || 40,
      mass: mass || 0.3,
      staggerChildren: 0.09,
      when: "beforeChildren",
    },
  },
});

export const textSlideUpParentVariant = () => {
  return {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: {
      opacity: 1,
      y: 0,

      transition: {
        // stiffness: 180,
        // damping: 500,
        delayChildren: 0, // this will set a delay before the children start animating
        staggerChildren: 0.3,
        when: "beforeChildren",
      },
    },
  };
};

export const textSlideUpChildVariant = () => {
  return {
    initial: {
      opacity: 0,
      y: 50,
      filter: "blur(5px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 210,
        damping: 35,
      },
    },
  };
};

export const slideDownVariant = (delay = 0) => {
  return {
    initial: {
      y: -50,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 210,
        damping: 35,
        delay: delay,
      },
    },
  };
};

export const slideLeftVariant = (delay = 0) => {
  return {
    initial: {
      x: 200,
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 40,
        delay: delay,
      },
    },
  };
};

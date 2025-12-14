export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // premium easing
    },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

export const scaleHover = {
  whileHover: {
    scale: 1.04,
  },
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 20,
  },
};

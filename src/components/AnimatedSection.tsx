import React from "react";
import { motion } from "motion/react";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  amount?: number | "some" | "all";
  scale?: boolean;
  instant?: boolean;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
  id,
  delay = 0,
  direction = "up",
  amount = 0.08,
  scale = false,
  instant = false,
}) => {
  // If instant render requested or no direction, bypass Framer Motion entirely
  // so above-the-fold content paints instantly without any initial opacity-0 delay
  if (instant || direction === "none") {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  const getInitialOffset = () => {
    switch (direction) {
      case "up":
        return { y: 20, x: 0 };
      case "down":
        return { y: -20, x: 0 };
      case "left":
        return { x: 20, y: 0 };
      case "right":
        return { x: -20, y: 0 };
      default:
        return { y: 20, x: 0 };
    }
  };

  const initialOffset = getInitialOffset();

  return (
    <motion.div
      id={id}
      initial={{
        opacity: 0,
        ...initialOffset,
        scale: scale ? 0.98 : 1,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount,
        margin: "-10px 0px -10px 0px",
      }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;

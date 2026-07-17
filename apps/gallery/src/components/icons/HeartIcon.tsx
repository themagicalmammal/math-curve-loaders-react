import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle } from "react";

import type { AnimatedIconHandle, AnimatedIconProps } from "./types";

const HeartIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { className = "", color = "currentColor", size = 24, strokeWidth = 2 },
    ref,
  ) => {
    const controls = useAnimation();

    const start = async () => {
      await controls.start({
        scale: [1, 1.15, 1, 1.25, 1],
        transition: { duration: 0.6, ease: "easeOut" },
      });
    };

    const stop = () => {
      controls.start({
        scale: 1,
        transition: { duration: 0.2, ease: "easeOut" },
      });
    };

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    const handleHoverStart = () => {
      start();
    };

    const handleHoverEnd = () => {
      stop();
    };

    return (
      <motion.svg
        className={`${className} cursor-pointer`}
        fill="none"
        height={size}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        onTouchEnd={handleHoverEnd}
        onTouchStart={handleHoverStart}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        style={{ overflow: "visible" }}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path d="M0 0h24v24H0z" fill="none" stroke="none" />
        <motion.path
          animate={controls}
          d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
          initial={false}
          style={{ transformOrigin: "50% 50%" }}
        />
      </motion.svg>
    );
  },
);

HeartIcon.displayName = "HeartIcon";

export default HeartIcon;

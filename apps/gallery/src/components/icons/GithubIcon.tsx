import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle } from "react";

import type { AnimatedIconHandle, AnimatedIconProps } from "./types";

const GithubIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { className = "", color = "currentColor", size = 24, strokeWidth = 2 },
    ref,
  ) => {
    const controls = useAnimation();

    const start = async () => {
      await controls.start({
        rotate: [0, -5, 5, 0],
        scale: [1, 1.1, 1],
        transition: { duration: 0.5, ease: "easeInOut" },
      });
    };

    const stop = () => {
      controls.start({
        rotate: 0,
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
        className={`inline-flex cursor-pointer items-center justify-center ${className}`}
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
        <motion.g
          animate={controls}
          initial={false}
          style={{ transformOrigin: "center" }}
        >
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
        </motion.g>
      </motion.svg>
    );
  },
);

GithubIcon.displayName = "GithubIcon";

export default GithubIcon;

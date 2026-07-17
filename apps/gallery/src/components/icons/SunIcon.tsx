import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";

import type { AnimatedIconHandle, AnimatedIconProps } from "./types";

const SunIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { className = "", color = "currentColor", size = 24, strokeWidth = 2 },
    ref,
  ) => {
    const centerControls = useAnimation();
    const rayControls = useAnimation();
    const wrapperRef = useRef<HTMLDivElement>(null);

    const start = async () => {
      await Promise.all([
        centerControls.start({
          scale: [1, 0.8, 1],
          transition: { duration: 0.4, ease: "easeInOut" },
        }),
        rayControls.start({
          opacity: [1, 0.4, 1],
          transition: { duration: 0.5, ease: "easeInOut" },
        }),
      ]);
    };

    const stop = () => {
      centerControls.start({
        scale: 1,
        transition: { duration: 0.2, ease: "easeOut" },
      });
      rayControls.start({
        opacity: 1,
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
      <motion.div
        className={`inline-flex cursor-pointer items-center justify-center ${className}`}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        onTouchEnd={handleHoverEnd}
        onTouchStart={handleHoverStart}
        ref={wrapperRef}
      >
        <svg
          fill="none"
          height={size}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <motion.path
            animate={centerControls}
            d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
            initial={false}
            style={{ transformOrigin: "center" }}
          />
          <motion.g animate={rayControls} initial={false}>
            <path d="M12 5l0 .01" />
            <path d="M17 7l0 .01" />
            <path d="M19 12l0 .01" />
            <path d="M17 17l0 .01" />
            <path d="M12 19l0 .01" />
            <path d="M7 17l0 .01" />
            <path d="M5 12l0 .01" />
            <path d="M7 7l0 .01" />
          </motion.g>
        </svg>
      </motion.div>
    );
  },
);

SunIcon.displayName = "SunIcon";

export default SunIcon;

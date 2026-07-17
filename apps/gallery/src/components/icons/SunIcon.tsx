import { forwardRef, useImperativeHandle, useRef } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimation } from "framer-motion";

const SunIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
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
        ref={wrapperRef}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        onTouchStart={handleHoverStart}
        onTouchEnd={handleHoverEnd}
        className={`inline-flex cursor-pointer items-center justify-center ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <motion.path
            animate={centerControls}
            initial={false}
            d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
            style={{ transformOrigin: "center" }}
          />
          <motion.g
            animate={rayControls}
            initial={false}
          >
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

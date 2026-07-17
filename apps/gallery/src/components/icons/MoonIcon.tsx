import { motion, useAnimate } from "framer-motion";
import { forwardRef, useImperativeHandle } from "react";

import type { AnimatedIconHandle, AnimatedIconProps } from "./types";

const MoonIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { className = "", color = "currentColor", size = 24, strokeWidth = 2 },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = async () => {
      await animate(
        ".moon",
        { rotate: [0, -15, 0], scale: [1, 1.1, 1] },
        { duration: 0.5, ease: "easeInOut" },
      );
    };

    const stop = () => {
      animate(
        ".moon",
        { rotate: 0, scale: 1 },
        { duration: 0.2, ease: "easeOut" },
      );
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
        className={`cursor-pointer ${className}`}
        fill="none"
        height={size}
        onHoverEnd={handleHoverEnd}
        onHoverStart={handleHoverStart}
        ref={scope}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        style={{ overflow: "visible" }}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0h24v24H0z" fill="none" stroke="none" />
        <motion.path
          className="moon"
          d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"
          style={{ transformOrigin: "center" }}
        />
      </motion.svg>
    );
  },
);

MoonIcon.displayName = "MoonIcon";

export default MoonIcon;

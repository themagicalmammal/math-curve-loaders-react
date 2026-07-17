export interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export interface AnimatedIconProps {
  className?: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

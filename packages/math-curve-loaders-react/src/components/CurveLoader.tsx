import { useRef, useEffect } from "react";
import type { CurveConfig } from "../data/curves";

export interface CurveLoaderProps {
  /** The curve configuration (math, particle count, timing, etc.) */
  config: CurveConfig;
  /** Override particle count */
  particleCount?: number;
  /** Override trail span (0–1) */
  trailSpan?: number;
  /** Override stroke width */
  strokeWidth?: number;
  /** Additional CSS class name */
  className?: string;
  /** Inline styles (width, height, etc.) */
  style?: React.CSSProperties;
}

const SVG_NS = "http://www.w3.org/2000/svg";

function getDetailScale(time: number, pulseDurationMs: number, phaseOffset: number) {
  const pulseProgress = ((time + phaseOffset * pulseDurationMs) % pulseDurationMs) / pulseDurationMs;
  const pulseAngle = pulseProgress * Math.PI * 2;
  return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;
}

function getRotation(time: number, rotate: boolean, rotationDurationMs: number, phaseOffset: number) {
  if (!rotate) return 0;
  return (
    -((time + phaseOffset * rotationDurationMs) % rotationDurationMs) / rotationDurationMs
  ) * 360;
}

function buildPath(config: CurveConfig, detailScale: number, steps = 480) {
  const parts: string[] = new Array(steps + 1);
  for (let i = 0; i <= steps; i++) {
    const pt = config.point(i / steps, detailScale, config);
    parts[i] = `${i === 0 ? "M" : "L"} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
  }
  return parts.join(" ");
}

function getParticle(
  config: CurveConfig,
  index: number,
  progress: number,
  detailScale: number
) {
  const tailOffset = index / (config.particleCount - 1);
  const pt = config.point(
    ((progress - tailOffset * config.trailSpan) % 1 + 1) % 1,
    detailScale,
    config
  );
  const fade = Math.pow(1 - tailOffset, 0.56);
  return {
    x: pt.x,
    y: pt.y,
    radius: 0.9 + fade * 2.7,
    opacity: 0.04 + fade * 0.96,
  };
}

export default function CurveLoader({
  config,
  particleCount: propParticles,
  trailSpan: _propTrail,
  strokeWidth: propStroke,
  className,
  style,
}: CurveLoaderProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const groupRef = useRef<SVGGElement | null>(null);
  const startTimeRef = useRef(performance.now());
  const phaseRef = useRef(Math.random());
  const particleElementsRef = useRef<SVGCircleElement[]>([]);
  const configRef = useRef(config);
  const propParticlesRef = useRef(propParticles);
  const propStrokeRef = useRef(propStroke);

  // Keep refs in sync with latest props (animation loop reads from refs)
  if (configRef.current !== config) configRef.current = config;
  if (propParticlesRef.current !== propParticles) propParticlesRef.current = propParticles;
  if (propStrokeRef.current !== propStroke) propStrokeRef.current = propStroke;

  useEffect(() => {
    const svg = svgRef.current;
    const group = groupRef.current;
    const path = pathRef.current;
    if (!svg || !group || !path) return;

    // Initialize particle circles
    const count = propParticlesRef.current ?? configRef.current.particleCount;
    const circles: SVGCircleElement[] = [];

    // Clear any previous circles
    while (group.firstChild) {
      group.removeChild(group.firstChild);
    }

    // Add path element
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", String(propStrokeRef.current ?? configRef.current.strokeWidth));
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("opacity", "0.1");
    group.appendChild(path);

    // Create particle circles
    for (let i = 0; i < count; i++) {
      const circle = document.createElementNS(SVG_NS, "circle");
      circle.setAttribute("fill", "currentColor");
      group.appendChild(circle);
      circles.push(circle);
    }

    particleElementsRef.current = circles;

    // Animation loop
    let animFrame: number;
    let running = true;

    function tick(now: number, p: SVGPathElement, g: SVGGElement) {
      if (!running) return;

      const time = now - startTimeRef.current;
      const phase = phaseRef.current;
      const c = configRef.current;
      const progress =
        ((time + phase * c.durationMs) % c.durationMs) / c.durationMs;
      const detailScale = getDetailScale(time, c.pulseDurationMs, phase);
      const rotation = getRotation(time, c.rotate, c.rotationDurationMs, phase);

      // Update path
      p.setAttribute("d", buildPath(c, detailScale));

      // Update rotation
      if (c.rotate) {
        g.setAttribute("transform", `rotate(${rotation} 50 50)`);
      }

      // Update particles
      const currentCircles = particleElementsRef.current;
      const currentCount = propParticlesRef.current ?? c.particleCount;
      for (let i = 0; i < currentCount; i++) {
        const pth = getParticle(c, i, progress, detailScale);
        const circle = currentCircles[i];
        if (circle) {
          circle.setAttribute("cx", pth.x.toFixed(2));
          circle.setAttribute("cy", pth.y.toFixed(2));
          circle.setAttribute("r", pth.radius.toFixed(2));
          circle.setAttribute("opacity", pth.opacity.toFixed(3));
        }
      }

      animFrame = requestAnimationFrame((now: number) => tick(now, p, g));
    }

    animFrame = requestAnimationFrame((now: number) => tick(now, path, group));

    return () => {
      running = false;
      cancelAnimationFrame(animFrame);
    };
  }, []); // stable deps — reads all mutable state from refs

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      style={style}
      aria-hidden="true"
    >
      <g ref={groupRef}>
        <path ref={pathRef} />
      </g>
    </svg>
  );
}

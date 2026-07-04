import { useRef, useEffect } from "react";
import type { CurveConfig } from "../data/curves";

interface CurveLoaderProps {
  config: CurveConfig;
  particleCount?: number;
  trailSpan?: number;
  strokeWidth?: number;
  className?: string;
}

const SVG_NS = "http://www.w3.org/2000/svg";

function normalizeProgress(progress: number) {
  return ((progress % 1) + 1) % 1;
}

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
    normalizeProgress(progress - tailOffset * config.trailSpan),
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
  trailSpan: propTrail,
  strokeWidth: propStroke,
  className,
}: CurveLoaderProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const groupRef = useRef<SVGGElement | null>(null);
  const startTimeRef = useRef(performance.now());
  const phaseRef = useRef(Math.random());
  const particleElementsRef = useRef<SVGCircleElement[]>([]);
  const prevParticleCountRef = useRef(0);

  const particles = propParticles ?? config.particleCount;
  const trailSpan = propTrail ?? config.trailSpan;
  const strokeWidth = propStroke ?? config.strokeWidth;

  useEffect(() => {
    const svg = svgRef.current;
    const group = groupRef.current;
    const path = pathRef.current;
    if (!svg || !group || !path) return;

    // Initialize particle circles
    const count = particles;
    const circles: SVGCircleElement[] = [];

    // Clear any previous circles
    while (group.firstChild) {
      group.removeChild(group.firstChild);
    }

    // Add path element
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", String(strokeWidth));
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

    function tick(now: number) {
      if (!running) return;

      const time = now - startTimeRef.current;
      const phase = phaseRef.current;
      const progress =
        ((time + phase * config.durationMs) % config.durationMs) / config.durationMs;
      const detailScale = getDetailScale(time, config.pulseDurationMs, phase);
      const rotation = getRotation(time, config.rotate, config.rotationDurationMs, phase);

      // Update path
      path.setAttribute("d", buildPath(config, detailScale));

      // Update rotation
      if (config.rotate) {
        group.setAttribute("transform", `rotate(${rotation} 50 50)`);
      }

      // Update particles
      for (let i = 0; i < count; i++) {
        const p = getParticle(config, i, progress, detailScale);
        const circle = circles[i];
        if (circle) {
          circle.setAttribute("cx", p.x.toFixed(2));
          circle.setAttribute("cy", p.y.toFixed(2));
          circle.setAttribute("r", p.radius.toFixed(2));
          circle.setAttribute("opacity", p.opacity.toFixed(3));
        }
      }

      animFrame = requestAnimationFrame(tick);
    }

    animFrame = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(animFrame);
    };
  }, [config, particles, strokeWidth]);

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <g ref={groupRef}>
        <path ref={pathRef} />
      </g>
    </svg>
  );
}

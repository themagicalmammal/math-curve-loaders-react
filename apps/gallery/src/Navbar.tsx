import { useEffect, useRef, useState } from "react";

import GithubIcon from "./components/icons/GithubIcon";
import HeartIcon from "./components/icons/HeartIcon";
import MoonIcon from "./components/icons/MoonIcon";
import SunIcon from "./components/icons/SunIcon";

interface NavbarProps {
  onToggleTheme: () => void;
  theme: "dark" | "light";
}

export default function Navbar({ onToggleTheme, theme }: NavbarProps) {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const threshold = 10;
          if (currentScrollY > lastScrollY.current + threshold) {
            setIsHidden(true);
          } else if (currentScrollY < lastScrollY.current - threshold) {
            setIsHidden(false);
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar${isHidden ? " navbar-hidden" : ""}`}>
      <div className="navbar-left">
        <span className="navbar-dot" />
        <h1 className="navbar-title">
          Math Curve Loaders
          <span className="navbar-subtitle">
            Mathematical Loading Animations
          </span>
        </h1>
      </div>

      <div className="navbar-actions">
        <button
          aria-label="GitHub"
          className="github-link"
          onClick={() =>
            window.open(
              "https://github.com/themagicalmammal/math-curve-loaders-react",
              "_blank",
            )
          }
          type="button"
        >
          <GithubIcon color="currentColor" size={16} />
        </button>
        <button
          aria-label="Support"
          className="support-link"
          onClick={() =>
            window.open("https://themagicallinks.vercel.app/", "_blank")
          }
          type="button"
        >
          <HeartIcon color="currentColor" size={18} />
        </button>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? (
            <MoonIcon color="currentColor" size={14} />
          ) : (
            <SunIcon color="currentColor" size={18} />
          )}
        </button>
      </div>
    </header>
  );
}

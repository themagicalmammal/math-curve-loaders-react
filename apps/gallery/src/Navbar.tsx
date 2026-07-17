import { useState, useRef, useEffect } from "react";
import GithubIcon from "./components/icons/GithubIcon";
import SunIcon from "./components/icons/SunIcon";
import MoonIcon from "./components/icons/MoonIcon";
import HeartIcon from "./components/icons/HeartIcon";

interface NavbarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
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
          type="button"
          className="github-link"
          onClick={() =>
            window.open(
              "https://github.com/themagicalmammal/math-curve-loaders-react",
              "_blank",
            )
          }
          aria-label="GitHub"
        >
          <GithubIcon size={16} color="currentColor" />
        </button>
        <button
          type="button"
          className="support-link"
          onClick={() =>
            window.open("https://themagicallinks.vercel.app/", "_blank")
          }
          aria-label="Support"
        >
          <HeartIcon size={18} color="currentColor" />
        </button>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? (
            <MoonIcon size={14} color="currentColor" />
          ) : (
            <SunIcon size={18} color="currentColor" />
          )}
        </button>
      </div>
    </header>
  );
}

import React, { useState, useEffect } from "react";
import style from "./ScrollToTop.module.scss";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import useScreenSize from "@/constants/screenSize/useScreenSize";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isMobile } = useScreenSize();
  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const winHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / winHeight) * 100;

      setScrollProgress(scrolled);
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const radius = isMobile ? 20 : 24;
  const stroke = 2;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <div>
      {isVisible && (
        <button onClick={scrollToTop} className={style["scroll-to-top"]}>
          <svg
            height={radius * 2}
            width={radius * 2}
            className={style["progress-ring"]}
          >
            <circle
              stroke="#fff"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              style={{
                strokeDasharray: `${circumference} ${circumference}`,
                strokeDashoffset,
                transition: "stroke-dashoffset 0s linear",
              }}
            />
          </svg>
          <ArrowUpwardIcon className={style.icon} />
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;

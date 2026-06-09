import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const getScrollKey = (location) =>
  location.key || `${location.pathname}${location.search}`;

const readScrollPosition = (key) => {
  const value = sessionStorage.getItem(`fya-scroll-${key}`);
  return value ? Number(value) : 0;
};

const saveScrollPosition = (key) => {
  sessionStorage.setItem(`fya-scroll-${key}`, String(window.scrollY));
};

export default function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  useEffect(() => {
    const key = getScrollKey(location);

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (navigationType === "POP") {
          window.scrollTo({ top: readScrollPosition(key), left: 0, behavior: "auto" });
          return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      saveScrollPosition(key);
    };
  }, [location, navigationType]);

  return null;
}

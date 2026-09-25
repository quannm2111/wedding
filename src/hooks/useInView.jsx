import { useState, useEffect, useRef } from "react";

function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);
  const { root = null, rootMargin = "0px", threshold = 0.15, once = false } =
    options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsInView(false);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold, once]);

  return [elementRef, isInView];
}

export default useInView;

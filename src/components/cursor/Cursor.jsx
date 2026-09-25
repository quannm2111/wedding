import { useEffect, useRef, useState } from "react";
import "./cursor.scss";

const Cursor = () => {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (hover: hover)");
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    let x = 0;
    let y = 0;

    const onMove = (event) => {
      x = event.clientX + 8;
      y = event.clientY + 8;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
        frame = 0;
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={ref} className="cursor" />;
};

export default Cursor;

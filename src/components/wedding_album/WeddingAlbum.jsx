import { useCallback, useEffect, useRef, useState } from 'react';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import useInView from '../../hooks/useInView';
import useMediaQuery from '../../hooks/useMediaQuery';
import { wedding } from '../../wedding';

const count = wedding.album.length;
// Boundary copies let the last photo move forward to the first, then rebase invisibly.
const slides = [wedding.album[count - 1], ...wedding.album, wedding.album[0]];
const logicalIndex = position => (position - 1 + count) % count;

export default function WeddingAlbum() {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const viewport = useRef(null);
  const positionRef = useRef(1);
  const pointer = useRef(null);
  const swiped = useRef(false);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const mobile = useMediaQuery('(max-width: 640px)');
  const [width, setWidth] = useState(0);
  const [position, setPosition] = useState(1);
  const [animated, setAnimated] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const index = logicalIndex(position);
  const slideWidth = mobile ? width * 0.84 : Math.min(width * 0.72, 400);
  const gap = mobile ? 14 : 24;

  const settle = useCallback(() => {
    const next = logicalIndex(positionRef.current) + 1;
    if (next !== positionRef.current) {
      setAnimated(false);
      positionRef.current = next;
      setPosition(next);
    }
  }, []);

  const move = useCallback((next, instant = false) => {
    const immediate = instant || reduced;
    const target = immediate ? logicalIndex(next) + 1 : next;
    if (target === positionRef.current) return;
    setAnimated(!immediate);
    positionRef.current = target;
    setPosition(target);
  }, [reduced]);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
      setAnimated(false);
      settle();
    });
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, [settle]);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Also settle if transitions are disabled mid-animation or a tab is suspended.
  useEffect(() => {
    if (reduced || hidden) { setAnimated(false); settle(); }
  }, [reduced, hidden, settle]);

  useEffect(() => {
    if (!playing || reduced || hovered || focused || hidden || !inView) return;
    const timer = window.setInterval(() => move(positionRef.current + 1), 2200);
    return () => window.clearInterval(timer);
  }, [playing, reduced, hovered, focused, hidden, inView, move]);

  const open = i => {
    setPlaying(false);
    setAnimated(false);
    move(i + 1, true);
    Fancybox.show(wedding.album.map(src => ({ src, type: 'image' })), { startIndex: i, Toolbar: { display: { left: [], middle: [], right: ['iterateZoom', 'close'] } } });
  };

  return <div className="wedding-carousel" ref={ref} role="region" aria-label="Album ảnh cưới" aria-roledescription="carousel"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocus={() => setFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className="album-viewport" ref={viewport}
      onPointerDown={event => { pointer.current = { x: event.clientX, y: event.clientY }; swiped.current = false; }}
      onPointerCancel={() => { pointer.current = null; swiped.current = true; }}
      onPointerUp={event => {
        if (!pointer.current) return;
        const dx = event.clientX - pointer.current.x;
        const dy = event.clientY - pointer.current.y;
        swiped.current = Math.abs(dx) > 12 || Math.abs(dy) > 12;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) move(positionRef.current + (dx < 0 ? 1 : -1));
        pointer.current = null;
      }}>
      <div className={`album-track ${animated ? 'is-animated' : ''}`}
        style={{ '--slide-width': `${slideWidth}px`, '--slide-gap': `${gap}px`, transform: `translate3d(${(width - slideWidth) / 2 - position * (slideWidth + gap)}px, 0, 0)` }}
        onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === 'transform') settle(); }}>
        {slides.map((src, physical) => {
          const i = logicalIndex(physical);
          const clone = physical === 0 || physical === count + 1;
          return <button key={physical} className={`album-slide ${i === index ? 'is-active' : ''}`} type="button"
            aria-label={`Phóng to ảnh ${i + 1}`} aria-hidden={clone ? true : undefined} tabIndex={!clone && i === index ? 0 : -1}
            onClick={event => { if (event.detail === 0 || !swiped.current) open(i); }}>
            <span className="album-photo"><img src={src} alt={clone ? '' : `Khoảnh khắc cưới ${i + 1} của Quân và Hường`} loading="lazy" decoding="async" draggable="false" /></span>
            <span className="album-zoom-hint" aria-hidden="true">⤢</span>
          </button>;
        })}
      </div>
    </div>
    <div className="album-dots" role="group" aria-label="Chọn ảnh album">{wedding.album.map((src, i) => <button key={src} type="button" aria-label={`Xem ảnh ${i + 1}`} aria-current={index === i ? 'true' : undefined}
      onClick={() => move(index === count - 1 && i === 0 ? count + 1 : index === 0 && i === count - 1 ? 0 : i + 1)}><span /></button>)}</div>
    <p className="album-hint">Chạm vào ảnh để xem lớn · Vuốt để khám phá</p>
  </div>;
}

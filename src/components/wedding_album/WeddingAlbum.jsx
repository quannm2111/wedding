import { useEffect, useRef, useState } from 'react';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import useInView from '../../hooks/useInView';
import useMediaQuery from '../../hooks/useMediaQuery';
import { wedding } from '../../wedding';

export default function WeddingAlbum() {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState(0);
  const [ready, setReady] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const strip = useRef(null);
  const pointer = useRef(null);
  const swiped = useRef(false);
  const count = wedding.album.length;
  const select = (next, manual = false) => {
    if (manual) setStopped(true);
    const target = (next + count) % count;
    if (target === index) return;
    setPrevious(index); setReady(false); setIndex(target);
  };
  useEffect(() => {
    const change = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', change);
    return () => document.removeEventListener('visibilitychange', change);
  }, []);
  useEffect(() => {
    if (!inView || reduced || stopped || hovered || focused || hidden || !ready || count < 2) return;
    const timer = setTimeout(() => { setPrevious(index); setReady(false); setIndex((index + 1) % count); }, 4500);
    return () => clearTimeout(timer);
  }, [inView, reduced, stopped, hovered, focused, hidden, ready, index, count]);
  useEffect(() => {
    const container = strip.current;
    const item = container?.children[index];
    if (item) container.scrollTo({ left: item.offsetLeft - (container.clientWidth - item.clientWidth) / 2, behavior: reduced ? 'instant' : 'smooth' });
  }, [index, reduced]);
  const open = () => {
    if (swiped.current) { swiped.current = false; return; }
    setStopped(true);
    Fancybox.show(wedding.album.map(src => ({ src, type: 'image' })), { startIndex: ready ? index : previous, Toolbar: { display: { left: [], middle: [], right: ['iterateZoom', 'close'] } } });
  };
  if (!count) return <p>Album ảnh cưới đang được cập nhật.</p>;
  return <div ref={ref} className="photo-gallery" role="region" aria-label="Album ảnh cưới"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocus={() => setFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className="gallery-stage">
      <img className="gallery-atmosphere" src={wedding.album[index]} alt="" aria-hidden="true" loading="lazy" />
      <button className="gallery-main" type="button" aria-label="Phóng to ảnh đang xem" aria-busy={!ready} onClick={open}
        onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); select(index + (event.key === 'ArrowRight' ? 1 : -1), true); } }}
        onPointerDown={event => { pointer.current = { x: event.clientX, y: event.clientY }; swiped.current = false; }}
        onPointerCancel={() => { pointer.current = null; swiped.current = true; }}
        onPointerUp={event => {
          if (!pointer.current) return;
          const dx = event.clientX - pointer.current.x; const dy = event.clientY - pointer.current.y;
          swiped.current = Math.abs(dx) > 12 || Math.abs(dy) > 12;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) select(index + (dx < 0 ? 1 : -1), true);
          pointer.current = null;
        }}>
        <img className="gallery-photo gallery-previous" src={wedding.album[previous]} alt="" aria-hidden="true" loading="lazy" draggable="false" />
        <img key={index} className={`gallery-photo gallery-current ${ready ? 'is-ready' : ''}`} src={wedding.album[index]} alt="Khoảnh khắc cưới của Quân và Hường" loading="lazy" draggable="false" onLoad={() => setReady(true)} />
        <span className="gallery-expand" aria-hidden="true">⤢</span>
      </button>
    </div>
    {/* <p className="gallery-instruction">Chạm ảnh để xem lớn <span aria-hidden="true">·</span> Vuốt để xem tiếp</p> */}
    <div ref={strip} className="gallery-thumbnails" role="group" aria-label="Chọn ảnh cưới">
      {wedding.album.map((src, i) => <button key={`${src}-${i}`} type="button" aria-label={`Xem ảnh ${i + 1}`} aria-current={i === index ? 'true' : undefined} className={i === index ? 'is-selected' : ''} onClick={() => select(i, true)}><img src={src} alt="" loading="lazy" draggable="false" /></button>)}
    </div>
  </div>;
}

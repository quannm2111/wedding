import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import useMediaQuery from '../hooks/useMediaQuery';
import { wedding, dateLabel } from '../wedding';
export default function InvitationEnvelope({ opened, onOpen }) {
  const [opening, setOpening] = useState(false);
  const [position, setPosition] = useState(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const trigger = useRef(null);
  const slot = useRef(null);
  const autoOpened = useRef(false);
  const ready = position !== null;
  useLayoutEffect(() => {
    if (opened || opening || !slot.current) return;
    const measure = () => {
      const rect = slot.current.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(slot.current.parentElement);
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, [opened, opening]);
  useEffect(() => {
    if (opened || !ready) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    trigger.current?.focus({ preventScroll: true });
    return () => { document.body.style.overflow = previous; };
  }, [opened, ready]);
  useEffect(() => {
    if (opening || opened || autoOpened.current) return;
    const timer = setTimeout(() => { autoOpened.current = true; setOpening(true); }, 900);
    return () => clearTimeout(timer);
  }, [opening, opened]);
  useEffect(() => {
    if (!opening || opened) return;
    const timer = setTimeout(() => {
      onOpen();
      requestAnimationFrame(() => { const heading = document.querySelector('.wedding-hero h1'); heading?.setAttribute('tabindex', '-1'); heading?.focus({ preventScroll: true }); });
    }, reduced ? 50 : 2400);
    return () => clearTimeout(timer);
  }, [opening, opened, onOpen, reduced]);
  const toggle = () => {
    autoOpened.current = true;
    if (!opening && !opened) setOpening(true);
  };
  return <>
    {!opened && <section className={`envelope-screen ${opening ? 'is-opening' : ''}`} aria-label="Mở cánh cửa thiệp cưới">
      <div className="invitation-door door-left" aria-hidden="true" />
      <div className="invitation-door door-right" aria-hidden="true" />
      <div className="door-copy">
        <p className="envelope-eyebrow">TRÂN TRỌNG KÍNH MỜI</p>
        <p className="door-names">{wedding.groom.shortName}<span>&</span>{wedding.bride.shortName}</p>
        <p className="door-date">{dateLabel}</p>
        <span ref={slot} className="envelope-seal-slot" aria-hidden="true" />
      </div>
    </section>}
    {position && !opened && <button ref={trigger} className={`envelope-seal persistent-seal ${opening ? 'is-leaving' : ''}`} style={{ '--seal-x': `${position.x}px`, '--seal-y': `${position.y}px` }}
      onClick={toggle} tabIndex={opening ? -1 : 0} aria-disabled={opening ? true : undefined} aria-label="Mở thiệp cưới" title="Mở thiệp cưới">
      <span aria-hidden="true">囍</span>
    </button>}
  </>;
}

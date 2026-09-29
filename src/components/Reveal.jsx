import useInView from '../hooks/useInView';
export default function Reveal({ children, className = '', delay = 0, mobileFrom = 'left', threshold = 0.12 }) {
  const [ref, visible] = useInView({ once: true, threshold });
  return <div ref={ref} data-mobile-from={mobileFrom} style={{ '--reveal-delay': `${delay}ms` }} className={`scroll-reveal ${visible ? 'is-visible' : ''} ${className}`}>{children}</div>;
}

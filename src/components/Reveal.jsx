import useInView from '../hooks/useInView';
export default function Reveal({ children, className = '', delay = 0 }) {
  const [ref, visible] = useInView({ once: true, threshold: 0.12 });
  return <div ref={ref} style={{ '--reveal-delay': `${delay}ms` }} className={`scroll-reveal ${visible ? 'is-visible' : ''} ${className}`}>{children}</div>;
}

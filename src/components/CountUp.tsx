import { useEffect, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

interface CountUpProps {
  to: number;
  duration?: number;
  className?: string;
}

export function CountUp({ to, duration = 1.4, className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const prevRef = useRef(0);

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const node = ref.current;
    const from = prevRef.current;
    prevRef.current = to;

    const controls = animate(from, to, {
      duration,
      ease: [0.22, 1, 0.36, 1], // spring-like cubic bezier
      onUpdate: (v) => { node.textContent = Math.round(v).toLocaleString(); },
    });
    return () => controls.stop();
  }, [isInView, to, duration]);

  return <span ref={ref} className={className}>0</span>;
}

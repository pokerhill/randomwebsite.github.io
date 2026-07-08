import { useState, useEffect } from 'react';

const useInView = (ref, { once = true, amount = 0.3 } = {}) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold: amount }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, once, amount]);

  return isInView;
};

export default useInView;

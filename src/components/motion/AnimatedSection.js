import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import useInView from './useInView';
import { ease, duration as dur } from '../../utils/motionTokens';

const directionOffsets = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: -40 },
  right: { x: 40 },
};

const AnimatedSection = ({
  children,
  direction = 'up',
  delay = 0,
  duration = dur.base,
  className = '',
  once = true,
  amount = 0.3,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  const offset = directionOffsets[direction] || directionOffsets.up;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{
        duration,
        delay,
        ease: ease.standard,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;

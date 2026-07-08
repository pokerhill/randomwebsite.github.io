import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import useInView from './useInView';
import { ease, duration as dur, stagger } from '../../utils/motionTokens';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.children,
      delayChildren: stagger.delay,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: dur.base,
      ease: ease.standard,
    },
  },
};

const StaggerContainer = ({ children, className = '', once = true, amount = 0.2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export { itemVariants };
export default StaggerContainer;

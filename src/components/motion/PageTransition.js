import React from 'react';
import { motion } from 'framer-motion';
import { ease, duration } from '../../utils/motionTokens';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: duration.fast, ease: ease.exit },
  },
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;

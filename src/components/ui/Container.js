import React from 'react';

const Container = ({ className = '', children }) => (
  <div className={`container mx-auto px-6 ${className}`}>{children}</div>
);

export default Container;

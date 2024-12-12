import React from 'react';

const Spinner = ({ size = 'medium', color = 'blue' }) => {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div
        className={`${sizes[size]} border-4 border-t-transparent border-${color}-500 rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Spinner;

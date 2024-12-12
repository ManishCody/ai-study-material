import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      {children}  
    </div>
  );
}

export default Layout;

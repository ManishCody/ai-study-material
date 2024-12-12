import DashboardHeader from '@/app/dashboard/_component/DashboardHeader';
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      <DashboardHeader />
      <div  className='flex justify-center items-center min-h-screen'>
        
      {children}   
      </div> 
    </div>
  );
}

export default Layout;

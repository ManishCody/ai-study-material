"use client";
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import React from 'react';

const WelcomeBanner = () => {
  const { user } = useUser();
    
  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="w-14 md:w-12  overflow-hidden rounded-full">
          <Image
            src={user?.imageUrl  || '/avatar.png'}
            alt="User Avatar"
            width={55}
            height={55}
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold truncate">
            Hello, {user?.fullName || "Guest"}!
          </h2>
          <p className="text-sm opacity-90">
            Welcome back! It's time to dive into your next learning adventure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;

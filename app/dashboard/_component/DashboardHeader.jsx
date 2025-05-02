"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import { LayoutDashboard, Menu, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'

const DashboardHeader = ({ toggleSidebar }) => {
  const { user } = useUser();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <div className="p-5 shadow-lg flex justify-between items-center sticky top-0 bg-white z-50">
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="block md:hidden p-2 bg-gray-200 rounded-md"
          >
            <Menu className="w-6 h-6 text-blue-600" />
          </button>
        )}

        <Link href="/">
          <LayoutDashboard className="w-8 h-8 cursor-pointer text-blue-600" />
        </Link>

        {user && (
          <Link className="hidden md:block ml-10" href="/dashboard">
            Dashboard
          </Link>
        )}

        {isHome && (
          <div className="hidden md:flex items-center gap-8 ml-10 font-bold">
            <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
            <a href="#why" className="text-gray-700 hover:text-blue-600">Why</a>
            <a href="#get-started" className="text-gray-700 hover:text-blue-600">Get Started</a>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">

        {user ? (
          <UserButton />
        ) : (
          <Link
            href="/sign-in"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
        )}

        {isHome && (
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 bg-gray-200 rounded-md"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-blue-600" /> : <Menu className="w-6 h-6 text-blue-600" />}
          </button>
        )}
      </div>

      {isHome && mobileMenuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white shadow-md flex flex-col items-start px-6 py-4 md:hidden z-40">
          <a href="#about" className="py-2 text-gray-700 hover:text-blue-600 w-full">About</a>
          <a href="#why" className="py-2 text-gray-700 hover:text-blue-600 w-full">Why</a>
          <a href="#get-started" className="py-2 text-gray-700 hover:text-blue-600 w-full">Get Started</a>
          {user && (
            <Link href="/dashboard" className="py-2 text-gray-700 hover:text-blue-600 w-full">
              Dashboard
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;

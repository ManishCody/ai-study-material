"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import { LayoutDashboard, Menu } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

const DashboardHeader = ({ toggleSidebar }) => {

  const { user } = useUser();

  return (
    <div className="p-5 shadow-lg flex justify-between items-center sticky top-0 bg-white z-50">
      <div className="flex items-center justify-evenly gap-4">
        {toggleSidebar &&
          <button
            onClick={toggleSidebar}
            className="block md:hidden p-2 bg-gray-200 rounded-md"
          >
            <Menu className="w-6 h-6 text-blue-600" />
          </button>}
        <Link href={'/'}>
          <LayoutDashboard className="w-8 h-8 cursor-pointer text-blue-600" />
        </Link>
        {user && <Link className=" hidden md:block ml-10 " href={'/dashboard'} >Dashboard</Link>}
      </div>
      {user && <Link className="md:hidden block" href={'/dashboard'} >Dashboard</Link>}
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
    </div>
  )
}

export default DashboardHeader

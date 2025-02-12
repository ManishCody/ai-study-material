"use client"
import React, {  useState } from 'react'
import Sidebar from './_component/Sidebar'
import DashboardHeader from './_component/DashboardHeader'
import ChatBot from './_component/ChatBot'


const layout = ({ children }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  

  return (
    <div>
      <DashboardHeader toggleSidebar={toggleSidebar} />
      <div className="flex">

        {/* Sidebar */}
        <div
          className={`fixed w-2/3 inset-y-0 left-0 bg-white shadow-lg z-40 transform transition-transform duration-300 md:w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}
        >
          <Sidebar />
        </div>
        {/* Content */}
        <div className={`flex-grow md:ml-64`}>
          <div className="p-10">
            {children}
            <ChatBot />
          </div>
        </div>
      </div>
    </div>
  )
}

export default layout
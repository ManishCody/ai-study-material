"use client"
import React, { useState } from 'react'
import DashboardHeader from '../dashboard/_component/DashboardHeader'

const layout = ({ children }) => {


    return (
        <div>
            <DashboardHeader />
            <div className="p-3">
                {children}
            </div>

        </div>
    )
}

export default layout
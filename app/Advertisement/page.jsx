"use client"
import React from 'react'
import AdvertisementForm from '../_compoents/AdvertisementForm'

const page = () => {
    return (
        <div className=''>
            <div className="text-center mb-4 mt-10">
                <h2 className="text-3xl font-extrabold text-blue-600">
                    Create Advertisement – <span className="text-green-500">StudyBeam</span>
                </h2>
                <p className="text-gray-500">
                    Boost your reach with StudyBeam! Create engaging advertisements to promote your courses.
                </p>
            </div>
            <AdvertisementForm />
        </div>

    )
}

export default page;
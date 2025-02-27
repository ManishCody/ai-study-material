"use client"
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CourseCard from './CourseCard'
import Spinner from '@/app/course/_components/Spinner'
import Link from 'next/link'

const CourseList = () => {

    const { user } = useUser();
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(true);

    const getCourseList = async () => {
        try {
            const res = await axios.post('/api/courses', { createdBy: user?.primaryEmailAddress?.emailAddress });
            setCourseList(res?.data?.result);
            localStorage.setItem("creditSc", res?.data?.result?.length);
        } catch (error) {
            console.log("Error fetching course list:", error);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        let isMounted = true;
        if (user) {
            getCourseList().finally(() => {
                if (isMounted) setLoading(false);
            });
        }
        return () => {
            isMounted = false; // Prevent state updates if unmounted
        };
    }, [user]);

    if (loading) {
        return <Spinner size="large" color="blue" />;
    }

    return (
        <div className='mt-10'>
            <h2 className='font-bold text-2xl mb-3'>Your Study Material</h2>
            <div >
                {courseList.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-5'>
                        {courseList?.map((it, idx) => (
                            <CourseCard courses={it} key={it?._id} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap  items-center justify-center gap-6  rounded-lg shadow-lg p-8">
                        {/* Image Section */}
                        <img
                            src="null.png"
                            alt="No Study Material"
                            className="w-40 h-40 bg-gradient-to-tr from-black to-gray-300 object-cover rounded-full shadow-md"
                            onError={(e) => {
                                e.currentTarget.src = '';
                                e.currentTarget.style.background = 'linear-gradient(to right, #f3f3f3, #ddd)';
                            }}
                        />
                        {/* Text and Button Section */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <h3 className="text-gray-800 font-bold text-2xl">No courses available</h3>
                            <p className="text-gray-600 mt-2 text-sm">
                                It seems you haven’t added any courses yet. Let’s create your first course today and start sharing your knowledge!
                            </p>
                            <Link href={'/create'}><button className="mt-4 px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-lg hover:opacity-90 shadow-lg transition">
                                Create Course
                            </button></Link>
                        </div>
                    </div>

                )}
            </div>
        </div>
    );
};

export default CourseList;

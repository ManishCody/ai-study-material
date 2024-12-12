import React from 'react'
import WelcomeBanner from './_component/WelcomeBanner'
import CourseList from './_component/CourseList'

const Dashboard = () => {
  return (
    <div>
        <WelcomeBanner />
        <CourseList />
    </div>
  )
}

export default Dashboard
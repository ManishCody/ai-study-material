"use client";
import React, { useEffect, useRef } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

import WelcomeBanner from "./_component/WelcomeBanner";
import CourseList from "./_component/CourseList";

const Dashboard = () => {
  const { user, isSignedIn } = useUser();
  const hasCalledAddUser = useRef(false);  // Ref to track if API has been called
  console.log(isSignedIn);
  
  useEffect(() => {
    if (isSignedIn && user && !hasCalledAddUser.current) {
      const addUser = async () => {
        try {
          const response = await axios.post(
            "/api/addUser",
            {
              email: user.primaryEmailAddress.emailAddress,
              name: user.fullName,
            }
          );

          console.log("User check response:", response.data);
          hasCalledAddUser.current = true;  // Set ref to true after the call is made
        } catch (error) {
          console.error(
            "Error adding user:",
            error.response?.data || error.message
          );
        }
      };

      addUser();
    }
  }, [isSignedIn, user]);

  return (
    <div>
      <WelcomeBanner />
      <CourseList />
    </div>
  );
};

export default Dashboard;

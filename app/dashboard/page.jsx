"use client";
import React, { useEffect, useRef } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

import WelcomeBanner from "./_component/WelcomeBanner";
import CourseList from "./_component/CourseList";

const Dashboard = () => {
  const { user, isSignedIn } = useUser();
  const prevUserId = useRef(null); // Track previous user ID

  useEffect(() => {
    if (isSignedIn && user && prevUserId.current !== user.id) {
      const addUser = async () => {
        try {
          const response = await axios.post("/api/addUser", {
            email: user.primaryEmailAddress.emailAddress,
            name: user.fullName ?? user.primaryEmailAddress.emailAddress.slice(0, 6),
          });

          console.log("User check response:", response.data);
          prevUserId.current = user.id; // Store the user ID to prevent duplicate calls
        } catch (error) {
          console.error("Error adding user:", error);
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

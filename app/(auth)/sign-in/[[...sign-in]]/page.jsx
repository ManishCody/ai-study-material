"use client"
import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import axios from "axios";

export default function Page() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const addUserToDatabase = async () => {
      if (isSignedIn && user) {
        try {
          // Call your API to add the user to the database
          await axios.post("/api/addUser", {
            name: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
          });
          console.log("User added to the database successfully.");
        } catch (error) {
          console.error("Error adding user to the database:", error);
        }
      }
    };

    addUserToDatabase();
  }, [isSignedIn, user]);

  return <SignIn />;
}

"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import UserContext from "./UserContext";
import axios from "axios";
import { Loader2 } from "lucide-react"; // Optional Loader Icon

const UserProvider = ({ children }) => {
  const { user, isSignedIn } = useUser();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUserData = async () => {
      if (isSignedIn && user) {
        const userEmail = user?.primaryEmailAddress?.emailAddress;

        try {
          setLoading(true); // Start loading before fetching data

          const userRes = await axios.get(`/api/user`, {
            params: { email: userEmail },
          });

          const planRes = await axios.get(`/api/currplan`, {
            params: { email: userEmail },
          });

          setUserInfo({
            id: user.id,
            email: userEmail,
            name: user.fullName,
            creditScore: userRes.data.user.creditScore,
            isPremium: userRes.data.user.isPremium,
            isElite: userRes.data.user.isElite,
            subscriptionEndDate: planRes.data.subscriptionEndDate,
            remainingDays: planRes.data.remainingDays,
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        } finally {
          setLoading(false); // Stop loading after data is fetched
        }
      } else {
        setLoading(false); // Stop loading if not signed in
      }
    };

    fetchUserData();
  }, [isSignedIn, user]);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
        {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

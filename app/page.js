"use client";
import { useEffect } from "react";
import { AboutAndGuide } from "./_componets/Pricing";
import { Hero } from "./_componets/Hero";
import { Footer } from "./_componets/Footer";
import DashboardHeader from "./dashboard/_component/DashboardHeader";
import { useClerk } from "@clerk/clerk-react";
import { useUserInfo } from "./context/UserContext/UserContext";
import AdContainer from "./_componets/AdContainer";

export default function Home() {
  const { user } = useClerk();
  const { userInfo } = useUserInfo();

  useEffect(() => {
    if (user) {
      localStorage.setItem("userEmail", user?.primaryEmailAddress?.emailAddress);
      localStorage.setItem("CLERK_USER_ID", user?.id);
    }
  }, [user]);

  return (
    <div>
      <DashboardHeader />
      <Hero />
      <AboutAndGuide />
      <Footer />
      {!userInfo?.isElite && !userInfo?.isPremium && <AdContainer />}
    </div>
  );
}

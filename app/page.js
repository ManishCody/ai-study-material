"use client"
import { useEffect } from "react";
import { AboutAndGuide } from "./_compoents/Pricing";
import { Hero } from "./_compoents/Hero";
import { Footer } from "./_compoents/Footer";
import DashboardHeader from "./dashboard/_component/DashboardHeader";
import { useClerk } from "@clerk/clerk-react";

export default function Home() {
  const { user } = useClerk(); 

  useEffect(() => {
    if (user) {
      localStorage.setItem("userEmail", user?.primaryEmailAddress?.emailAddress); 
    }
  }, [user]); 

  return (
    <div>
        <DashboardHeader />
        <Hero />
        <AboutAndGuide />
        <Footer />
    </div>
  );
}

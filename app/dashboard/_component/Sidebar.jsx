"use client";
import { useUserInfo } from "@/app/context/UserContext/UserContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";
import { LayoutDashboard, Shield, Gamepad } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = () => {
  const [creditSc, setCreditSc] = useState(0);
  const { user } = useUser();
  const path = usePathname();
  const { userInfo } = useUserInfo();

  const MenueList = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Upgrade", icon: Shield, path: "/dashboard/upgrade" },
    { name: "Dino", icon: Gamepad, path: "/dashboard/dino" },
  ];

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await axios.get("/api/check-credits", {
          params: { email: user?.primaryEmailAddress?.emailAddress },
        });
        setCreditSc(response.data.CrScore || 0);
      } catch (err) {
        console.log("Error fetching credit score:", err);
      }
    };

    if (user) {
      fetchCredits();
    }
  }, [user, path]);

  // Determine current credits based on user type
  const currentCredits = userInfo?.isPremium ? creditSc : userInfo?.creditScore ?? creditSc;

  // Determine button disabled state
  const isButtonDisabled =
    userInfo?.isElite
      ? false
      : userInfo?.isPremium
      ? currentCredits >= 20
      : currentCredits >= 5;

  return (
    <div className="h-screen mt-14 md:mt-14 relative shadow-lg p-5 m-0">
      <div className="flex justify-center items-center">
        <Image src="/logo.png" width={140} height={100} alt="LOGO" />
      </div>

      <div className="mt-10">
        {/* Create Button (Disabled based on conditions) */}
        <Link href={isButtonDisabled ? "#" : "/create"}>
          <Button
            className={`${isButtonDisabled ? "cursor-not-allowed grayscale" : ""} w-full`}
          >
            + Create New
          </Button>
        </Link>

        {/* Sidebar Menu */}
        <div className="flex mt-3 flex-col justify-center items-baseline">
          {MenueList.map((item, idx) => (
            <Link key={idx} href={item.path} className="w-full">
              <div
                className={`flex gap-3 items-center hover:bg-slate-200 rounded-lg cursor-pointer p-3 w-full ${
                  path === item.path && "bg-slate-200"
                }`}
              >
                <item.icon />
                <h2>{item.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Hide Credit Score for Elite Users */}
      {!userInfo?.isElite && (
        <div className="bg-slate-200 p-3 w-[85%] rounded-lg absolute bottom-[75px] md:bottom-18">
          <h2 className="text-lg mb-2">Available Credits</h2>
          <Progress value={(currentCredits / (userInfo?.isPremium ? 20 : 5)) * 100} />
          <h2 className="text-sm">{currentCredits} Out of {userInfo?.isPremium ? 20 : 5} Credits Used</h2>
          <Link className="text-sm mt-1 text-primary" href="/dashboard/upgrade">
            <h2>Upgrade to create more</h2>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

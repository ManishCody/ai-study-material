"use client"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { LayoutDashboard, Shield , Gamepad} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Sidebar = () => {
  const [creditSc, setCreditSc] = useState(0);
  const { user } = useUser();
  
  const MenueList = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Upgrade",
      icon: Shield,
      path: "/dashboard/upgrade",
    },
    {
      name: "Dino",
      icon: Gamepad,
      path: "/dashboard/dino",
    }
  ];

  const path = usePathname();

  useEffect(() => {
    const credits = localStorage.getItem("creditSc");
    setCreditSc(credits ? parseInt(credits, 10) : 0); // Parse stored credits as integer
  }, [path]);

  return (
    <div className='h-screen mt-14 md:mt-14 relative shadow-lg p-5 m-0'>
      <div className='flex justify-center items-center'>
        <Image src='/logo.png' width={140} height={100} alt='LOGO' />
      </div>
      <div className='mt-10'>
        <Link href={creditSc >= 5 ? '#' : '/create'}>
          <Button className={` ${creditSc >= 5 ? 'cursor-not-allowed  grayscale' : ''} w-full`}>
            + Create New
          </Button>
        </Link>
        <div className='flex mt-3 flex-col justify-center items-baseline'>
          {MenueList.map((item, idx) => {
            return item.onClick ? (
              <div
                key={idx}
                className='flex gap-3 items-center hover:bg-slate-200 rounded-lg cursor-pointer p-3 w-full'
                onClick={item.onClick} // Trigger logout on click
              >
                <item.icon />
                <h2>{item.name}</h2>
              </div>
            ) : (
              <Link key={idx} href={item.path} className='w-full'>
                <div
                  className={`flex gap-3 items-center hover:bg-slate-200 rounded-lg cursor-pointer p-3 w-full ${
                    path === item.path && 'bg-slate-200'
                  }`}
                >
                  <item.icon />
                  <h2>{item.name}</h2>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="bg-slate-200 p-3 w-[85%] rounded-lg absolute bottom-[75px] md:bottom-18">
        <h2 className="text-lg mb-2">Available Credits</h2>
        <Progress value={creditSc * 20} />
        <h2 className="text-sm">{creditSc} Out of 5 Credits Used</h2>
        <Link className="text-sm mt-1 text-primary" href={'/dashboard/upgrade'}>
          <h2>Upgrade to create more</h2>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

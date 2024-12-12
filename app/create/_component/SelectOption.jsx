import Image from "next/image";
import React, { useState } from "react";

const SelectOption = ({ setSteps, setSelected }) => {
  const Options = [
    { name: "Exam", icon: "/exam.png" },
    { name: "Job Interview", icon: "/interview.png" },
    { name: "Practice", icon: "/practice.png" },
    { name: "Coding Prep", icon: "/code-prep.png" },
    { name: "Other", icon: "/other.png" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
        For which purpose do you want to create your personal study material?
      </h2>
      <div className="flex justify-center items-center flex-wrap gap-4">
        {Options.map((it, idx) => (
          <div
            key={idx}
            className="flex flex-col w-[120px] h-[120px] justify-center items-center bg-white border rounded-lg p-4 shadow-md hover:shadow-lg hover:bg-slate-200 hover:scale-105 transition-all duration-300"
            onClick={() => {
              setSelected(it.name);
              setSteps(1);
            }}
          >
            <div className="w-16 h-16 flex justify-center items-center bg-gray-100 rounded-full mb-3">
              <Image
                src={it.icon}
                alt={it.name}
                width={60}
                height={60}
                className="rounded-md"
              />
            </div>
            <h2 className="text-sm font-medium text-gray-700">{it.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectOption;

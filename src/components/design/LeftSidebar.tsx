"use client";

import React, { useEffect, useState } from "react";
import { BiFolder } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { LuImage, LuLayoutTemplate, LuShapes } from "react-icons/lu";
import { MdCloudDownload } from "react-icons/md";
import { TbBackground } from "react-icons/tb";
import { TfiText } from "react-icons/tfi";

const LeftSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState("");

  const handleShowFeature = (state = "") => {
    setState(state);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const items = [
    {
      text: "Design",
      state: "design",
      icon: <LuLayoutTemplate />,
    },
    {
      text: "Shapes",
      state: "shape",
      icon: <LuShapes />,
    },
    {
      text: "Download",
      state: "download",
      icon: <MdCloudDownload />,
    },
    {
      text: "Text",
      state: "text",
      icon: <TfiText />,
    },
    {
      text: "Project",
      state: "project",
      icon: <BiFolder />,
    },
    {
      text: "Images",
      state: "image",
      icon: <LuImage />,
    },
    {
      text: "Background",
      state: "background",
      icon: <TbBackground />,
    },
  ];

  return (
    <aside className="w-20 bg-white relative shadow-md flex flex-col items-center py-4 space-y-6">
      {items.map((item, i) => (
        <button
          onClick={() => handleShowFeature(item.state)}
          key={i}
          className="w-auto hover:opacity-50 cursor-pointer items-center h-10 flex flex-col rounded-lg"
        >
          {item.icon}
          <p className="text-xs">{item.text}</p>
        </button>
      ))}

      <div
        className={`bg-white shadow-md w-72 absolute  h-full top-0 transition-all ease-in-out duration-500 ${
          isOpen ? "left-20" : "-left-[300px] -z-1"
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-[10px] top-1/2 transform -translate-y-1/2 bg-gray-100 active:scale-90 transition-all duration-300 h-20 rounded-r-lg"
        >
          <IoIosArrowBack />
        </button>
        {state}
      </div>
    </aside>
  );
};

export default LeftSidebar;

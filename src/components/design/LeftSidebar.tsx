"use client";
import dynamic from "next/dynamic";
import React, { ComponentType, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { BiFolder } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { LuImage, LuLayoutTemplate, LuShapes } from "react-icons/lu";
import { MdCloudDownload } from "react-icons/md";
import { TbBackground } from "react-icons/tb";
import { TfiText } from "react-icons/tfi";
import { motion } from "framer-motion";

interface SidebarComponentProps {
  createShapes: (name: string, type: string) => void;
}

const loader = () => (
  <div className="flex justify-center items-center h-full p-4">
    <AiOutlineLoading className="text-4xl animate-spin" />
  </div>
);

const components: Record<string, ComponentType<SidebarComponentProps>> = {
  design: dynamic(() => import("./DesignTemplate"), {
    ssr: false,
    loading: () => loader(),
  }),
  shape: dynamic(() => import("./ShapesTemplate"), {
    ssr: false,
    loading: () => loader(),
  }),
  download: dynamic(() => import("./DownloadContent"), {
    ssr: false,
    loading: () => loader(),
  }),
  text: dynamic(() => import("./FontTextLists"), {
    ssr: false,
    loading: () => loader(),
  }),
  project: dynamic(() => import("./ProjectContent"), {
    ssr: false,
    loading: () => loader(),
  }),
  image: dynamic(() => import("./ImageContent"), {
    ssr: false,
    loading: () => loader(),
  }),
  background: dynamic(() => import("./BackgroundContent"), {
    ssr: false,
    loading: () => loader(),
  }),
};

const LeftSidebar = ({createShapes} : {createShapes: (name: string, type:string) => void;}) => {
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

  const ComponentToRender = components[state] || components["design"];

  return (
    <main className="relative">
      <aside className="w-20 bg-white relative shadow-md flex z-50 flex-col items-center py-4 space-y-6 h-full">
        {items.map((item, i) => (
          <button
            onClick={() => handleShowFeature(item.state)}
            key={i}
            className={`relative w-full hover:opacity-50 cursor-pointer items-center p-4 h-auto flex flex-col rounded-lg transition-all duration-300 ${
              state === item.state && "text-white"
            }`}
          >
            {/* Animasi Indicator */}
            {state === item.state && (
              <motion.div
                layoutId="activeButton"
                className="absolute inset-0 bg-blue-500 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}

            <span className="relative z-10">{item.icon}</span>
            <p className="relative z-10 text-xs">{item.text}</p>
          </button>
        ))}
      </aside>
      <div
        className={`bg-white shadow-md w-72 absolute  h-full top-0 transition-all ease-in-out duration-500 z-30 ${
          isOpen ? "left-20" : "-left-[205px] -z-1"
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-[10px] top-1/2 transform -translate-y-1/2 bg-gray-100 active:scale-90 transition-all duration-300 h-20 rounded-r-lg"
        >
          <IoIosArrowBack
            className={`${
              isOpen ? "rotate-0" : "rotate-180"
            } transition-all duration-700`}
          />
        </button>
        {ComponentToRender && <ComponentToRender createShapes={createShapes}/>}
      </div>
    </main>
  );
};

export default LeftSidebar;

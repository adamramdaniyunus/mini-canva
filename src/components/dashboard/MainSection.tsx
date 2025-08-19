"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import SizeInput from "./SizeInput";

const MainSection = () => {
  const [showConfig, setConfig] = useState(false);
  const configRef = useRef<HTMLDivElement>(null);
  const btnConfigRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: "", height: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(e.target.value));
    setDimensions({
      ...dimensions,
      [e.target.name]: value,
    });
  };

  const handleShowConfig = () => {
    setConfig((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        configRef.current &&
        !configRef.current.contains(event.target as Node) &&
        btnConfigRef.current &&
        !btnConfigRef.current.contains(event.target as Node)
      ) {
        setConfig(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: WindowEventMap["keydown"]) => {
      if (e.key === "Escape") {
        setConfig(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative h-64 bg-gradient-to-tr flex items-center justify-center from-blue-500 to-white rounded-md">
      <h1 className="text-2xl text-white font-semibold drop-shadow-sm">
        What will you design today EDITED
      </h1>
      <div className="absolute right-4 top-4" ref={btnConfigRef}>
        <Button onClick={handleShowConfig}>Custom Size</Button>
      </div>
      <div
        ref={configRef}
        className="absolute right-10 top-14 flex items-center justify-center bg-opacity-50"
      >
        <div
          className={`bg-white text-black shadow-sm p-6 rounded-md w-72 ${
            showConfig ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-all duration-300`}
        >
        <SizeInput dimensions={dimensions} handleChange={handleChange}/>
        </div>
      </div>

      {/* Config Section */}
    </div>
  );
};

export default MainSection;

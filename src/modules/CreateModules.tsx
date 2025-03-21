"use client";
import { useDesignState } from "@/context/DesignContext";
import React, { useRef } from "react";

const CreateModules = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { state } = useDesignState();

  const obj = {
    name: "main_frame",
    type: "rect",
    id: Math.floor(Math.random() * 100 + 1),
    height: state?.height || 400,
    width: state?.width || 400,
    z_index: 1,
    color: "#DBDBDB",
    image: "",
  };

  const DesinComponent = () => {
    let html = <></>;
    if (obj.name == "main_frame") {
      html = (
        <div
          className="hover:border-[2px] hover:border-indigo-400 shadow-md"
          style={{
            width: obj.width,
            height: obj.height,
            background: obj.color,
            zIndex: obj.z_index,
          }}
        >
          {obj.image && (
            <img className="w-full h-full" src={obj.image} alt="image" />
          )}
        </div>
      );
    }

    return html;
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center relative">
      <div ref={ref} className="relative w-auto h-auto overflow-auto">
        <div>
            {DesinComponent()}
        </div>
      </div>
    </div>
  );
};

export default CreateModules;

"use client";
import React, { useRef } from "react";
import { ElementComponent } from "@/types/Element.type";


const CreateModules = ({ components, handleClickElement }: { components: ElementComponent[], handleClickElement: (element:ElementComponent) => void; }) => {
  const ref = useRef<HTMLDivElement>(null);

  const mainFrame = components.find((c) => c.name === "main_frame");
  const otherComponents = components.filter((c) => c.name !== "main_frame");

  if (!mainFrame) return <div>No main frame found.</div>;

  return (
    <div className="flex justify-center items-center relative">
      <div ref={ref} className="relative w-auto h-auto overflow-auto">
        <div
          className="relative hover:border-[2px] hover:border-indigo-400 shadow-md"
          style={{
            width: mainFrame.width,
            height: mainFrame.height,
            background: mainFrame.color,
            zIndex: mainFrame.z_index,
          }}
        >
          {/* If there's a background image */}
          {mainFrame.image && (
            <img
              className="w-full h-full object-cover"
              src={mainFrame.image}
              alt="canvas"
            />
          )}

          {/* Render shapes or other components inside main_frame */}
          {otherComponents.map((component) => {
            if (component.name === "rect" && component.type === "shape") {
              return (
                <div
                  onClick={() => handleClickElement(component)}
                  key={component.id}
                  className="absolute hover:border-[2px] hover:border-indigo-400"
                  style={{
                    width: component.width + "px",
                    height: component.height + "px",
                    background: component.color,
                    zIndex: component.z_index,
                    top: component.top,
                    left: component.left,
                  }}
                ></div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default CreateModules;

"use client";
import React, { useEffect, useRef } from "react";
import { ElementComponent } from "@/types/Element.type";
import Rect from "@/components/design/Rect";
import Circle from "@/components/design/Circle";
import Polygon from "@/components/design/Polygon";

const Canvas = ({
  components,
  handleClickElement,
  selectedElement,
  updateElementPosition,
  drawerPosition,
  setDrawerPosition,
  setSelectedElement,
  updateElementSize
}: {
  components: ElementComponent[],
  handleClickElement: (element: ElementComponent) => void;
  selectedElement: ElementComponent | null;
  updateElementPosition: (id: number, top: number, left: number) => void;
  drawerPosition: { top: number | null; left: number | null };
  setDrawerPosition: React.Dispatch<React.SetStateAction<{ top: number | null; left: number | null }>>
  setSelectedElement: React.Dispatch<React.SetStateAction<ElementComponent | null>>;
  updateElementSize: (id: number, width: number, height: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const mainFrame = components.find((c) => c.name === "main_frame");
  const otherComponents = components.filter((c) => c.name !== "main_frame");
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setSelectedElement(null);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  if (!mainFrame) return <div>No main frame found.</div>;
  
  return (
    <div className="flex justify-center items-center relative">
      <div ref={ref} className="relative w-auto h-auto overflow-auto">
        <div
          className="relative hover:border-[2px] hover:border-indigo-400 shadow-md"
          onMouseDown={() => setSelectedElement(null)} 
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
            const isSelected = selectedElement?.id === component.id;

            if (component.name === "rect" && component.type === "shape") {
              return <Rect
                component={component}
                dragOffset={dragOffset}
                handleClickElement={handleClickElement}
                isDragging={isDragging}
                updateElementPosition={updateElementPosition}
                isSelected={isSelected}
                ref={ref}
                key={component.id}
                setDrawerPosition={setDrawerPosition}
                updateElementSize={updateElementSize}
              />
            }

            if (component.name === "circle" && component.type === "shape") {
              return <Circle
                component={component}
                dragOffset={dragOffset}
                handleClickElement={handleClickElement}
                isDragging={isDragging}
                updateElementPosition={updateElementPosition}
                isSelected={isSelected}
                ref={ref}
                key={component.id}
                setDrawerPosition={setDrawerPosition}
              />
            }

            if (component.name === "polygon" && component.type === "shape") {
              return <Polygon
                component={component}
                dragOffset={dragOffset}
                handleClickElement={handleClickElement}
                isDragging={isDragging}
                updateElementPosition={updateElementPosition}
                isSelected={isSelected}
                ref={ref}
                key={component.id}
                setDrawerPosition={setDrawerPosition}
              />
            }

            return null;
          })}
          {
            drawerPosition.top !== null && (
              <div className="absolute border-t border-dashed left-0 w-full h-[1px] bg-indigo-500 pointer-events-none" style={{ top: drawerPosition.top }} />
            )
          }
          {
            drawerPosition.left !== null && (
              <div className="absolute border-l border-dashed top-0 h-full w-[1px] bg-indigo-500 pointer-events-none" style={{ left: drawerPosition.left }} />
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Canvas;

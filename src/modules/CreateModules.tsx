"use client";
import React, { useRef } from "react";
import { ElementComponent } from "@/types/Element.type";
import Rect from "@/components/design/Rect";
import Circle from "@/components/design/Circle";
import Polygon from "@/components/design/Polygon";

const CreateModules = ({
  components,
  handleClickElement,
  selectedElement,
  updateElementPosition
}: {
  components: ElementComponent[],
  handleClickElement: (element: ElementComponent) => void;
  selectedElement: ElementComponent | null;
  updateElementPosition: (id: number, top: number, left: number) => void
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const mainFrame = components.find((c) => c.name === "main_frame");
  const otherComponents = components.filter((c) => c.name !== "main_frame");
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

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
                key={component.id} />
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
              />
            }
            return null;
          })}

        </div>
      </div>
    </div>
  );
};

export default CreateModules;

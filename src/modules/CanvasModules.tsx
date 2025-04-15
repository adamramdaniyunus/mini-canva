"use client";
import React, { useRef } from "react";
import { ElementComponent } from "@/types/Element.type";
import Rect from "@/components/design/Rect";
import Circle from "@/components/design/Circle";
import Polygon from "@/components/design/Polygon";
import { throttle } from "lodash";

const THROTTLE_INTERVAL = 16; // 60 FPS

const Canvas = ({
  components,
  handleClickElement,
  selectedElement,
  updateElementPosition,
  drawerPosition,
  setDrawerPosition,
  setSelectedElement,
  updateElementSize,
  rightSidebarRef
}: {
  components: ElementComponent[],
  handleClickElement: (element: ElementComponent) => void;
  selectedElement: ElementComponent | null;
  updateElementPosition: (id: number, top: number, left: number) => void;
  drawerPosition: { top: number | null; left: number | null };
  setDrawerPosition: React.Dispatch<React.SetStateAction<{ top: number | null; left: number | null }>>
  setSelectedElement: React.Dispatch<React.SetStateAction<ElementComponent | null>>;
  updateElementSize: (id: number, width: number, height: number) => void;
  rightSidebarRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const mainFrame = components.find((c) => c.name === "main_frame");
  const otherComponents = components.filter((c) => c.name !== "main_frame");
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);


  // Function to handle mouse down event for dragging the element
  // This function is called when the user clicks on the element
  // It calculates the offset between the mouse position and the element's position
  // and sets up event listeners for mouse move and mouse up events
  const handleMouseDown = (e: React.MouseEvent, component: ElementComponent) => {
    // if (!selectedElement) return
    e.stopPropagation();
    handleClickElement(component);

    const startX = e.clientX;
    const startY = e.clientY;

    const elementRect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = {
      x: startX - elementRect.left,
      y: startY - elementRect.top,
    };

    isDragging.current = true;

    const handleMouseMove = throttle((moveEvent: MouseEvent) => {
      if (!isDragging.current) return;

      const newLeft = moveEvent.clientX - dragOffset.current.x;
      const newTop = moveEvent.clientY - dragOffset.current.y;

      const parentRect = ref.current?.getBoundingClientRect();
      const relativeLeft = newLeft - (parentRect?.left || 0);
      const relativeTop = newTop - (parentRect?.top || 0);

      updateElementPosition(component.id, relativeTop, relativeLeft);
      setDrawerPosition({ top: relativeTop, left: relativeLeft });
    }, THROTTLE_INTERVAL);


    const handleMouseUp = () => {
      isDragging.current = false;
      setDrawerPosition({ top: null, left: null }); // Clear drawer lines
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Function to handle resizing the element
  // This function is called when the user clicks and drags a resize handle
  // It calculates the new width and height based on the mouse movement
  // and updates the element's size accordingly
  const handleResize = (e: React.MouseEvent, direction: string) => {
    if (!selectedElement) return
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = selectedElement.width;
    const startHeight = selectedElement.height;
    const startTop = selectedElement.top;
    const startLeft = selectedElement.left;

    const onMouseMove = throttle((moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newTop = startTop || 0;
      let newLeft = startLeft || 0;

      if (direction.includes("right")) newWidth += dx; // Increase width
      if (direction.includes("bottom")) newHeight += dy; // Increase height
      if (direction.includes("left")) {
        newWidth -= dx; // Decrease width
        newLeft += dx; // Move left
      }
      if (direction.includes("top")) {
        newHeight -= dy; // Decrease height
        newTop += dy; // Move up
      }

      if (newWidth > 20 && newHeight > 20) {
        updateElementSize(selectedElement.id, newWidth, newHeight);
        updateElementPosition(selectedElement.id, newTop, newLeft);
      }
    }, THROTTLE_INTERVAL);

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // useEffect(() => {
  //   const handleClickOutside = (e: MouseEvent) => {
  //     if (
  //       selectedElement &&
  //       !ref.current?.contains(e.target as Node) &&
  //       !rightSidebarRef.current?.contains(e.target as Node)
  //     ) {
  //       setSelectedElement(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  if (!mainFrame) return <div>No main frame found.</div>;

  return (
    <div className="flex justify-center items-center relative">
      <div ref={ref} className="relative w-auto h-auto overflow-auto">
        <div
          className="relative hover:border-[2px] hover:border-indigo-400 shadow-md"
          onMouseDown={() => setSelectedElement(mainFrame)}
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
                handleClickElement={handleClickElement}
                isSelected={isSelected}
                key={component.id}
                handleMouseDown={handleMouseDown}
                handleResize={handleResize}
              />
            }

            if (component.name === "circle" && component.type === "shape") {
              return <Circle
                component={component}
                handleClickElement={handleClickElement}
                isSelected={isSelected}
                key={component.id}
                handleMouseDown={handleMouseDown}
                handleResize={handleResize}
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

"use client";
import React, { useRef, useState } from "react";
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
  updateElementRotation
}: {
  components: ElementComponent[],
  handleClickElement: (element: ElementComponent) => void;
  selectedElement: ElementComponent | null;
  updateElementPosition: (id: number, top: number, left: number) => void;
  drawerPosition: { top: number | null; left: number | null };
  setDrawerPosition: React.Dispatch<React.SetStateAction<{ top: number | null; left: number | null }>>
  setSelectedElement: React.Dispatch<React.SetStateAction<ElementComponent | null>>;
  updateElementSize: (id: number, width: number, height: number) => void;
  updateElementRotation: (id: number, rotation: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const mainFrame = components.find((c) => c.name === "main_frame");
  const otherComponents = components.filter((c) => c.name !== "main_frame");
  const dragOffset = useRef({ x: 0, y: 0 });
  const [rotate, setRotate] = useState(0);
  const isDragging = useRef(false);
  const isRotating = useRef(false);


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

  // Function to handle rotation of the element
  // This function is called when the user clicks and drags the rotate handle
  // It calculates the new angle based on the mouse movement
  // and updates the element's rotation accordingly
  const handleRotate = (e: React.MouseEvent) => {
    if (!selectedElement) return;
    e.preventDefault();
    e.stopPropagation();

    const target = document.getElementById(`element-${selectedElement.id}`);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const startX = e.clientX;
    const startY = e.clientY;

    const startAngle = Math.atan2(startY - centerY, startX - centerX);
    const initialRotation = parseFloat(target.dataset.rotation || "0");

    const snapAngle = (angle: number, increment: number = 15) => {
      return Math.round(angle / increment) * increment;
    };

    const mouseMove = throttle((ev: MouseEvent) => {
      isRotating.current = true;
      const currentAngle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
      const angleDiff = (currentAngle - startAngle) * (180 / Math.PI);
      let newRotation = initialRotation + angleDiff;

      // Normalisasi sudut
      newRotation = (newRotation + 360) % 360;

      target.style.transform = `rotate(${newRotation}deg)`;
      target.dataset.rotation = newRotation.toString();
      setRotate(newRotation);
    }, THROTTLE_INTERVAL);

    const mouseUp = () => {
      isRotating.current = false;
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);

      const finalRotation = parseFloat(target.dataset.rotation || "0");
      const snapped = snapAngle(finalRotation);

      target.style.transform = `rotate(${snapped}deg)`;
      target.dataset.rotation = snapped.toString();

      updateElementRotation(selectedElement.id, snapped);
      setRotate(snapped);
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
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
                handleRotate={handleRotate}
                isRotating={isRotating}
                rotate={rotate}
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
                handleRotate={handleRotate}
                isRotating={isRotating}
                rotate={rotate}
              />
            }

            if (component.name === "polygon" && component.type === "shape") {
              return <Polygon
                component={component}
                handleClickElement={handleClickElement}
                isSelected={isSelected}
                key={component.id}
                handleMouseDown={handleMouseDown}
                handleResize={handleResize}
                handleRotate={handleRotate}
                isRotating={isRotating}
                rotate={rotate}
              />
            }

            return null;
          })}
          {
            drawerPosition.top !== null && (
              <div
                className="absolute left-0 w-full h-[1px] pointer-events-none"
                style={{
                  top: drawerPosition.top,
                  backgroundImage: 'repeating-linear-gradient(to right, #6366f1 0 4px, transparent 4px 10px)',
                }}
              />
            )
          }
          {
            drawerPosition.left !== null && (
              <div
                className="absolute top-0 h-full w-[1px] pointer-events-none"
                style={{
                  left: drawerPosition.left,
                  backgroundImage: 'repeating-linear-gradient(to bottom, #6366f1 0 4px, transparent 4px 10px)',
                }}
              />
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Canvas;

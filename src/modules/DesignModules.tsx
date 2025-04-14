"use client";
import Header from "@/components/design/Header";
import LeftSidebar from "@/components/design/LeftSidebar";
import RightSidebar from "@/components/design/RightSidebar";
import Canvas from "./CanvasModules";
import { useDesignState } from "@/context/DesignContext";
import { useState } from "react";
import { ElementComponent } from "@/types/Element.type";

const SNAP_THRESHOLD = 5; // jarak maksimal untuk snap
export default function DesignModules() {
  const { state } = useDesignState();
  const [selectedElement, setSelectedElement] = useState<ElementComponent | null>(null);
  // drawer feature
  const [drawerPosition, setDrawerPosition] = useState<{ top: number | null, left: number | null }>({ top: null, left: null });

  // Function to get selected element
  const handleClickElement = (element: ElementComponent) => {
    if (element === selectedElement) {
      setSelectedElement(element);
    }
    else {
      setSelectedElement(element);
    }
  };

  const [components, setComponents] = useState([
    {
      name: "main_frame",
      type: "rect",
      id: Math.floor(Math.random() * 100 + 1),
      height: state?.height || 400,
      width: state?.width || 500,
      z_index: 1,
      color: "#DBDBDB",
      image: "",
      top: 0,
      left: 0,
    },
  ])

  const createShapes = (type: string, name: string) => {
    const newComponent = {
      name: name,
      type: type,
      id: components.length + 1,
      height: 90,
      width: 90,
      z_index: 1,
      color: "blue",
      image: "",
      top: 10,
      left: 10,
    };
    setComponents((prev) => [...prev, newComponent]);
  }

  const changeColor = (color: string) => {
    const updatedComponents = components.map((component) => {
      if (selectedElement && component.id === selectedElement.id) {
        return { ...component, color: color };
      }
      return component;
    });
    setComponents(updatedComponents);
  }


  const updateElementPosition = (id: number, newTop: number, newLeft: number) => {
    const movingElement = components.find(c => c.id === id);
    if (!movingElement) return;

    let snappedTop = newTop;
    let snappedLeft = newLeft;

    components.forEach((other) => {
      if (other.id === id) return;

      // Horizontal snapping (top)
      if (Math.abs(other.top - newTop) < SNAP_THRESHOLD) {
        snappedTop = other.top;
        setDrawerPosition((prev) => ({ ...prev, top: other.top }));
      }

      // Horizontal snapping (bottom)
      const otherBottom = other.top + other.height;
      const movingBottom = newTop + movingElement.height;
      if (Math.abs(otherBottom - movingBottom) < SNAP_THRESHOLD) {
        snappedTop = otherBottom - movingElement.height;
        setDrawerPosition((prev) => ({ ...prev, top: otherBottom }));
      }

      // Vertical snapping (left)
      if (Math.abs(other.left - newLeft) < SNAP_THRESHOLD) {
        snappedLeft = other.left;
        setDrawerPosition((prev) => ({ ...prev, left: other.left }));
      }

      // Vertical snapping (right)
      const otherRight = other.left + other.width;
      const movingRight = newLeft + movingElement.width;
      if (Math.abs(otherRight - movingRight) < SNAP_THRESHOLD) {
        snappedLeft = otherRight - movingElement.width;
        setDrawerPosition((prev) => ({ ...prev, left: otherRight }));
      }

      // Center X snapping
      const otherCenterX = other.left + other.width / 2;
      const movingCenterX = newLeft + movingElement.width / 2;
      if (Math.abs(otherCenterX - movingCenterX) < SNAP_THRESHOLD) {
        snappedLeft = otherCenterX - movingElement.width / 2;
        setDrawerPosition((prev) => ({ ...prev, left: otherCenterX }));
      }

      // Center Y snapping
      const otherCenterY = other.top + other.height / 2;
      const movingCenterY = newTop + movingElement.height / 2;
      if (Math.abs(otherCenterY - movingCenterY) < SNAP_THRESHOLD) {
        snappedTop = otherCenterY - movingElement.height / 2;
        setDrawerPosition((prev) => ({ ...prev, top: otherCenterY }));
      }
    });

    // Update posisi dengan snap jika ada
    setComponents((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, top: snappedTop, left: snappedLeft } : el
      )
    );
  };


  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <LeftSidebar createShapes={createShapes} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-4">
          {/* Canvas Area */}
          <div className="flex-1 flex justify-center items-center rounded-lg p-4">
            <div className="relative h-auto shadow-lg">
              <Canvas
                setDrawerPosition={setDrawerPosition}
                drawerPosition={drawerPosition}
                components={components}
                updateElementPosition={updateElementPosition}
                handleClickElement={handleClickElement}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
              />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        {selectedElement && <RightSidebar changeColor={changeColor} />}
      </div>
    </div>
  );
}

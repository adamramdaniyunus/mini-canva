"use client";
import Header from "@/components/design/Header";
import LeftSidebar from "@/components/design/LeftSidebar";
import RightSidebar from "@/components/design/RightSidebar";
import CreateModules from "./CreateModules";
import { useDesignState } from "@/context/DesignContext";
import { useState } from "react";
import { ElementComponent } from "@/types/Element.type";

export default function DesignModules() {
  const { state } = useDesignState();
  const [selectedElement, setSelectedElement] = useState<ElementComponent | null>(null);

  // Function to get selected element
  const handleClickElement = (element: ElementComponent) => {
    if(element === selectedElement) {
      setSelectedElement(null);
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

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <LeftSidebar createShapes={createShapes}/>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-4">
          {/* Canvas Area */}
          <div className="flex-1 flex justify-center items-center rounded-lg p-4">
            <div className="relative h-auto shadow-lg">
              <CreateModules components={components} handleClickElement={handleClickElement} selectedElement={selectedElement}/>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        {selectedElement && <RightSidebar changeColor={changeColor} />}
      </div>
    </div>
  );
}

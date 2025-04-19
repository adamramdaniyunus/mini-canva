"use client";
import Header from "@/components/design/Header";
import LeftSidebar from "@/components/design/LeftSidebar";
import FeaturePanel from "@/components/design/FeaturePanel";
import Canvas from "./CanvasModules";
import { useEffect, useRef, useState } from "react";
import { ElementComponent } from "@/types/Element.type";
import ColorPicker from "@/components/design/ColorPicker";
import { deleteImageBlob, getImageBlob, loadCanvas, loadDesign, saveCanvas, saveDesign } from "@/lib/indexDB";
import { debounce } from "lodash";
import { useParams } from "next/navigation";
import { CanvasType } from "@/types/CanvasType";

const SNAP_THRESHOLD = 5; // jarak maksimal untuk snap
export default function DesignModules() {
  const [selectedElement, setSelectedElement] = useState<ElementComponent | null>(null);
  const [selectedCanvas, setSelectedCanvas] = useState<CanvasType | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState("#000000");
  const [isLoadDesign, setIsLoadDesign] = useState(false);
  const params = useParams();
  const designId = params?.id;
  const newImageId = Math.floor(Math.random() * 100 + 1).toString();
  const [mainframe, setMainFrame] = useState<CanvasType | null>(null);

  // show color picker
  const handleShowColorPicker = () => {
    setShowColorPicker((prev) => !prev);
  };

  // handle color change
  const handleChangeColor = (color: string) => {
    setColor(color);

    if (selectedCanvas) {
      setMainFrame((prev) => {
        if (!prev) return null;
        return { ...prev, background_color: color };
      });
      return;
    }

    setComponents((prevComponents) =>
      prevComponents.map((component) => {
        if (selectedElement && component.id === selectedElement.id) {
          return { ...component, color: color };
        }
        return component;
      })
    );
  }


  // hide color picker when click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (canvasWrapperRef.current && !canvasWrapperRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // drawer feature
  const [drawerPosition, setDrawerPosition] = useState<{ top: number | null, left: number | null }>({ top: null, left: null });

  // Function to get selected element
  const handleClickElement = (element: ElementComponent | CanvasType | null) => {
    if (element && !('type' in element)) {
      setSelectedCanvas(element as CanvasType);
      setSelectedElement(null);
    }
    else {
      setSelectedCanvas(null);
      setSelectedElement(element as ElementComponent);
    }
  };

  const [components, setComponents] = useState<ElementComponent[]>([])

  const createShapes = (type: string, name: string) => {
    const newComponent = {
      name: name,
      type: type,
      id: components.length + 1,
      height: 90,
      width: 90,
      z_index: components.length + 1,
      color: "blue",
      image: "",
      top: 10,
      left: 10,
    };
    setComponents((prev) => [...prev, newComponent]);
  }

  const addImage = ({
    clientX,
    clientY,
    newWidth,
    newHeight,
    blobUrl,
  }: {
    clientX: number;
    clientY: number;
    newWidth: number;
    newHeight: number;
    blobUrl: string;
  }) => {
    const newImage = {
      id: Number(newImageId),
      type: "image",
      top: clientY,
      left: clientX,
      width: newWidth,
      height: newHeight,
      z_index: components.length + 1,
      color: "",
      image: blobUrl,
      rotation: 0,
      name: "image",
    };
    setComponents((prev) => [...prev, newImage]);
  }

  const measureTextDOM = (text: string, fontFamily: string, fontSize: number): { width: number, height: number } => {
    const div = document.createElement("div");

    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "nowrap";
    div.style.fontFamily = fontFamily;
    div.style.fontSize = `${fontSize}px`;
    div.style.lineHeight = "1.2";
    div.style.padding = "0";
    div.style.margin = "0";
    div.style.fontWeight = "normal";
    div.textContent = text;

    document.body.appendChild(div);

    const width = div.offsetWidth * 1.5;
    const height = div.offsetHeight;

    document.body.removeChild(div);

    return { width, height };
  };


  const addText = (text: string, fontFamily: string, fontSize: number) => {
    const { width, height } = measureTextDOM(text, fontFamily, fontSize);

    const newText: ElementComponent = {
      id: components.length + 1,
      type: "text",
      top: 10,
      left: 10,
      width,
      height,
      z_index: components.length + 1,
      color: "black",
      image: "",
      rotation: 0,
      name: text,
      font_family: fontFamily,
      font_size: fontSize,
      text: text,
    };

    setComponents((prev) => [...prev, newText]);
  };


  // element attribute update

  const updateElementPosition = (id: number, newTop: number, newLeft: number) => {
    const movingElement = components.find((c) => c.id === id);
    if (!movingElement) return;

    let snappedTop = newTop;
    let snappedLeft = newLeft;

    components.forEach((other) => {
      if (other.id === id) return;

      const otherTop = other.top ?? 0;
      const otherLeft = other.left ?? 0;
      const otherBottom = otherTop + (other.height ?? 0);
      const otherRight = otherLeft + (other.width ?? 0);
      const movingBottom = newTop + movingElement.height;
      const movingRight = newLeft + movingElement.width;

      // Horizontal snapping (top)
      if (Math.abs(otherTop - newTop) < SNAP_THRESHOLD) {
        snappedTop = otherTop;
        setDrawerPosition((prev) => ({ ...prev, top: otherTop }));
      }

      // Horizontal snapping (bottom)
      if (Math.abs(otherBottom - movingBottom) < SNAP_THRESHOLD) {
        snappedTop = otherBottom - movingElement.height;
        setDrawerPosition((prev) => ({ ...prev, top: otherBottom }));
      }

      // Vertical snapping (left)
      if (Math.abs(otherLeft - newLeft) < SNAP_THRESHOLD) {
        snappedLeft = otherLeft;
        setDrawerPosition((prev) => ({ ...prev, left: otherLeft }));
      }

      // Vertical snapping (right)
      if (Math.abs(otherRight - movingRight) < SNAP_THRESHOLD) {
        snappedLeft = otherRight - movingElement.width;
        setDrawerPosition((prev) => ({ ...prev, left: otherRight }));
      }

      // Center X snapping
      const otherCenterX = otherLeft + (other.width ?? 0) / 2;
      const movingCenterX = newLeft + movingElement.width / 2;
      if (Math.abs(otherCenterX - movingCenterX) < SNAP_THRESHOLD) {
        snappedLeft = otherCenterX - movingElement.width / 2;
        setDrawerPosition((prev) => ({ ...prev, left: otherCenterX }));
      }

      // Center Y snapping
      const otherCenterY = otherTop + (other.height ?? 0) / 2;
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


  const updateElementSize = (id: number, width: number, height: number, fontSize?:number) => {
    setComponents((prev) =>
      prev.map((el) => el.id === id ? { ...el, width, height } : el)
    );

    if(fontSize) {
      setComponents((prev) =>
        prev.map((el) => el.id === id ? { ...el, font_size: fontSize } : el)
      );
    }
  };

  const updateElementRotation = (id: number, rotation: number) => {
    setComponents((prev) =>
      prev.map((el) => el.id === id ? { ...el, rotation } : el)
    );
  };

  const updateElementZIndex = (id: number, z_index: number) => {
    setComponents((prev) =>
      prev.map((el) => el.id === id ? { ...el, z_index } : el)
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!canvasWrapperRef.current) return;
      const isOutsideCanvas = !canvasWrapperRef.current?.contains(e.target as Node);

      if (selectedElement && isOutsideCanvas) {
        setSelectedElement(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedElement]);


  // handle delete element
  const handleDeleteElement = (id: number) => {
    setComponents((prev) => {
      const toDelete = prev.find((el) => el.id === id);

      if (toDelete?.type === "image" && typeof toDelete.image === "string" && toDelete.image.startsWith("blob:")) {
        URL.revokeObjectURL(toDelete.image);
        deleteImageBlob(id);
      }

      return prev.filter((el) => el.id !== id);
    });
    setSelectedElement(null);
  }

  // handle updated z-index
  const handleZIndexChange = (id: number, z_index: number) => {
    updateElementZIndex(id, z_index);
  }


  useEffect(() => {
    if (!designId) return;
    const loadMainFrame = async () => {
      setIsLoadDesign(true);
      const storedElements = await loadCanvas(designId as string);
      if (!storedElements) return;
      setMainFrame(storedElements);
      setIsLoadDesign(false);
    }

    loadMainFrame();
  }, [designId])

  // indexedDB
  useEffect(() => {
    if (!designId) return;
    const saveElementsThrottle = debounce(() => {
      saveDesign(designId as string, components);
    }, 500)

    if (components) {
      saveElementsThrottle();
    }
  }, [components, designId]);

  useEffect(() => {
    if (!designId) return;
    const saveElementsThrottle = debounce(() => {
      saveCanvas(designId as string, mainframe as CanvasType);
    }, 500)

    if (mainframe) {
      saveElementsThrottle();
    }
  }, [mainframe, designId]);

  useEffect(() => {
    if (!designId) return;
    const loadDesigns = async () => {
      setIsLoadDesign(true);
      const storedElements = await loadDesign(designId as string);
      if (!storedElements) return;
      for (const el of storedElements) {
        if (el.type === "image") {
          const blob = await getImageBlob(el.id);
          const imageUrl = URL.createObjectURL(blob!);
          el.image = imageUrl;
        }
      }

      const fixedElements = storedElements.map(el => ({
        ...el,
        top: el.top ?? 0,
        left: el.left ?? 0,
      }));

      setComponents(fixedElements);
      setIsLoadDesign(false);
    }

    loadDesigns();
  }, [designId])

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <LeftSidebar
          createShapes={createShapes}
          addText={addText}
          addImage={addImage}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-4">
          {/* Canvas Area */}
          <div className="flex-1 flex justify-center items-center rounded-lg p-4">
            <div className={`relative h-auto shadow-lg ${isLoadDesign && 'blur-[5px] pointer-events-none transition-all duration-300 ease-in'}`} ref={canvasWrapperRef}>
              {showColorPicker && (
                <ColorPicker
                  handleShowColorPicker={handleShowColorPicker}
                  handleChangeColor={handleChangeColor}
                  color={color}
                />
              )}
              <Canvas
                setDrawerPosition={setDrawerPosition}
                drawerPosition={drawerPosition}
                components={components}
                updateElementPosition={updateElementPosition}
                handleClickElement={handleClickElement}
                selectedElement={selectedElement}
                updateElementSize={updateElementSize}
                updateElementRotation={updateElementRotation}
                addImage={addImage}
                newImageId={newImageId}
                mainFrame={mainframe}
              />
              {(selectedElement || selectedCanvas) && (
                <FeaturePanel
                  color={color}
                  handleShowColorPicker={handleShowColorPicker}
                  selectedElement={selectedElement}
                  handleDeleteElement={handleDeleteElement}
                  handleZIndexChange={handleZIndexChange}
                  selectedCanvas={selectedCanvas}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

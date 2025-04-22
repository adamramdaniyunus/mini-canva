"use client";
import Header from "@/components/design/Header";
import LeftSidebar from "@/components/design/LeftSidebar";
import FeaturePanel from "@/components/design/FeaturePanel";
import Canvas from "./CanvasModules";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ElementComponent } from "@/types/Element.type";
import ColorPicker from "@/components/design/ColorPicker";
import { deleteImageBlob, loadCanvas, loadDesign, saveCanvas, saveDesign } from "@/lib/indexDB";
import { debounce } from "lodash";
import { useParams } from "next/navigation";
import { CanvasType } from "@/types/CanvasType";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { toPng } from "html-to-image";
import { generatePreviewImage } from "@/lib/htmltoimage";
import { uploadPreviewImage } from "@/lib/supabase";

type MainFrameType = {
  elements: ElementComponent[];
  mainframe: CanvasType;
}

const SNAP_THRESHOLD = 5; // jarak maksimal untuk snap
export default function DesignModules() {
  const [selectedElement, setSelectedElement] = useState<ElementComponent | null>(null);
  const [selectedCanvas, setSelectedCanvas] = useState<CanvasType | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState("#000000");
  const [isLoadDesign, setIsLoadDesign] = useState(false);
  const [mainframe, setMainFrame] = useState<CanvasType | null>(null);
  const [components, setComponents] = useState<ElementComponent[]>([]);
  const [undoStack, setUndoStack] = useState<MainFrameType[]>([]);
  const [redoStack, setRedoStack] = useState<MainFrameType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const designId = params?.id;
  const newImageId = Math.floor(Math.random() * 100 + 1).toString();

  // show color picker
  const handleShowColorPicker = () => {
    setShowColorPicker((prev) => !prev);
  };

  // handle color change
  const handleChangeColor = (color: string) => {
    setColor(color);
    setUndoStack(prev => [
      ...prev,
      {
        elements: components,
        mainframe: JSON.parse(JSON.stringify(mainframe))
      }
    ]);
    if (selectedCanvas) {
      setMainFrame((prev) => {
        if (!prev) return null;
        return { ...prev, background_color: color };
      });
      debouncedSave(mainframe as CanvasType, components)
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
    debouncedSave(mainframe as CanvasType, components)
  }

  const handleIsTyping = () => {
    setIsTyping(prev => !prev);
  }

  const handleChange = () => {
    setUndoStack(prev => [
      ...prev,
      {
        elements: components,
        mainframe: JSON.parse(JSON.stringify(mainframe))
      }
    ]);
    setRedoStack([]);
    debouncedSave(mainframe as CanvasType, components)
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
      uuid: uuidv4(),
    };

    setUndoStack(prev => [
      ...prev,
      {
        elements: components,
        mainframe: JSON.parse(JSON.stringify(mainframe))
      }
    ]);
    setComponents((prev) => [...prev, newComponent]);
    setRedoStack([]);
    debouncedSave(mainframe as CanvasType, components)
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
      uuid: uuidv4(),
    };
    setUndoStack(prev => [
      ...prev,
      {
        elements: components,
        mainframe: JSON.parse(JSON.stringify(mainframe))
      }
    ]);
    setComponents((prev) => [...prev, newImage]);
    setRedoStack([]);
    debouncedSave(mainframe as CanvasType, components)
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
      uuid: uuidv4(),
    };

    setUndoStack(prev => [
      ...prev,
      {
        elements: components,
        mainframe: JSON.parse(JSON.stringify(mainframe))
      }
    ]);
    setComponents((prev) => [...prev, newText]);
    setRedoStack([]);
    debouncedSave(mainframe as CanvasType, components)
  };

  // change background
  const handleChangeBackground = (url: string) => {
    setUndoStack(prev => [
      ...prev,
      {
        elements: components,
        mainframe: JSON.parse(JSON.stringify(mainframe))
      }
    ]);
    setMainFrame((prev) => {
      if (!prev) return null;
      return { ...prev, background_image: url };
    });
    if (url === mainframe?.background_image) {
      setMainFrame((prev) => {
        if (!prev) return null;
        return { ...prev, background_image: "" };
      });
    }
    setRedoStack([]);
    debouncedSave(mainframe as CanvasType, components)
  }

  // element attribute update

  const updateElementPosition = (id: number, newTop: number, newLeft: number) => {
    const movingElement = components.find((c) => c.id === id);
    if (!movingElement) return;

    let snappedTop = newTop;
    let snappedLeft = newLeft;

    // snapping feature
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
    handleChange();
    // Update posisi dengan snap jika ada
    setComponents((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, top: snappedTop, left: snappedLeft } : el
      )
    );

    debouncedSave(mainframe as CanvasType, components);
  };

  const updateElementSize = (id: number, width: number, height: number, fontSize?: number) => {
    handleChange();
    setComponents((prev) =>
      prev.map((el) => el.id === id ? { ...el, width, height } : el)
    );

    if (fontSize) {
      setComponents((prev) =>
        prev.map((el) => el.id === id ? { ...el, font_size: fontSize } : el)
      );
    }
    debouncedSave(mainframe as CanvasType, components);
  };

  const updateElementRotation = (id: number, rotation: number) => {
    handleChange()
    setComponents((prev) =>
      prev.map((el) => el.id === id ? { ...el, rotation } : el)
    );
    debouncedSave(mainframe as CanvasType, components);
  };

  const updateElementZIndex = (id: number, z_index: number) => {
    setUndoStack(prev => [
      ...prev,
      {
        elements: components,
        mainframe: JSON.parse(JSON.stringify(mainframe))
      }
    ]);
    setComponents((prev) =>
      prev.map((el) => el.id === id ? { ...el, z_index } : el)
    );
    setRedoStack([]);
    debouncedSave(mainframe as CanvasType, components);
  };

  const updateTextValue = (id: number, text: string) => {
    setUndoStack(prev => [
      ...prev,
      {
        elements: components,
        mainframe: JSON.parse(JSON.stringify(mainframe))
      }
    ]);
    setComponents((prev) =>
      prev.map((el) => el.id === id ? { ...el, text } : el)
    );
    setRedoStack([]);
  }

  const updateFontSize = (id: number, fontSize: number) => {
    setComponents((prev) =>
      prev.map((el) => el.id === id ? { ...el, font_size: fontSize } : el)
    );
    debouncedSave(mainframe as CanvasType, components)
  };

  const updateFontFamily = (id: number, fontFamily: string) => {
    setUndoStack(prev => [
      ...prev,
      {
        elements: components,
        mainframe: JSON.parse(JSON.stringify(mainframe))
      }
    ]);
    setRedoStack([]);
    setComponents((prev) =>
      prev.map((el) => el.id === id ? { ...el, font_family: fontFamily } : el)
    );
    debouncedSave(mainframe as CanvasType, components)
  }

  const updateItalic = (id: number, fontItalic: boolean) => {
    setUndoStack(prev => [
      ...prev,
      {
        elements: components,
        mainframe: JSON.parse(JSON.stringify(mainframe))
      }
    ]);
    setRedoStack([]);
    setComponents((prev) =>
      prev.map((el) => el.id === id ? { ...el, font_italic: fontItalic } : el)
    );
    debouncedSave(mainframe as CanvasType, components)
  }

  const updateBold = (id: number, fontBold: boolean) => {
    setUndoStack(prev => [
      ...prev,
      {
        elements: components,
        mainframe: JSON.parse(JSON.stringify(mainframe))
      }
    ]);
    setRedoStack([]);
    setComponents((prev) =>
      prev.map((el) => el.id === id ? { ...el, font_bold: fontBold } : el)
    );
    debouncedSave(mainframe as CanvasType, components)
  }

  // update align text
  const updateAlign = (id: number, align: "left" | "center" | "right" | "justify") => {
    setUndoStack(prev => [
      ...prev,
      {
        elements: components,
        mainframe: JSON.parse(JSON.stringify(mainframe))
      }
    ]);
    setRedoStack([]);
    setComponents((prev) =>
      prev.map((el) => el.id === id ? { ...el, align } : el)
    );
    debouncedSave(mainframe as CanvasType, components)
  }

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
    debouncedSave(mainframe as CanvasType, components)
  }

  // handle updated z-index
  const handleZIndexChange = (id: number, z_index: number) => {
    updateElementZIndex(id, z_index);
  }

  // handle update font size
  const handleFontSizeChange = (id: number, fontSize: number) => {
    if (fontSize <= 8 || fontSize >= 100) return;
    updateFontSize(id, fontSize);
  }

  // handle update font family
  const handleFontFamilyChange = (id: number, fontFamily: string) => {
    updateFontFamily(id, fontFamily);
  }

  // handle update italic
  const handleFontItalicChange = (id: number, fontItalic: boolean) => {
    updateItalic(id, fontItalic);
  }

  // handle update bold
  const handleFontBoldChange = (id: number, fontBold: boolean) => {
    updateBold(id, fontBold);
  }

  // handle update align text
  const handleAlignTextChange = (id: number, align: "left" | "center" | "right" | "justify") => {
    updateAlign(id, align);
  }

  // handle export to png
  const handleExport = async () => {
    if (canvasRef.current === null) return;
    handleManualSave();
    try {
      setIsSaving(true);
      const dataUrl = await toPng(canvasRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = mainframe?.project_id || "" + '-' + Date.now();
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.log(error);
      toast.error("Failed to download design")
    }finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!designId || mainframe) return;
    const loadMainFrame = async () => {
      setIsLoadDesign(true);
      const storedElements = await loadCanvas(designId as string);
      if (!storedElements) {
        try {
          const response = await fetch(`/api/design?id=${designId}`);
          const rawData = await response.json();
          const data = rawData.data;
          setMainFrame(data);
        } catch (error) {
          console.log(error);
          toast.error("Something wrong, please try again later.")
        } finally {
          setIsLoadDesign(false)
          return;
        }
      };
      setMainFrame(storedElements);
      setIsLoadDesign(false);
    }

    loadMainFrame();
  }, [designId, mainframe])

  // indexedDB
  useEffect(() => {
    const saveElementsThrottle = debounce(() => {
      if (components) {
        saveDesign(designId as string, components);
      }
    }, 500);

    if (components) {
      saveElementsThrottle();
    }
  }, [components, designId]);

  useEffect(() => {
    const saveCanvasThrottle = debounce(() => {
      if (mainframe) {
        saveCanvas(designId as string, mainframe as CanvasType);
      }
    }, 500)

    if (mainframe) {
      saveCanvasThrottle();
    }
  }, [mainframe, designId]);



  useEffect(() => {
    if (!designId || !mainframe) return;
    const loadDesigns = async () => {
      setIsLoadDesign(true);
      const storedElements = await loadDesign(designId as string);
      if (!storedElements || storedElements.length == 0) {
        try {
          const response = await fetch(`/api/design/elements?id=${mainframe.id}`);
          const rawData = await response.json();
          const data = rawData.data;
          const fixedElements = data.map((el: {
            y: number;
            x: number;
            image_url: string;
            text_content: string;
            type: string;
            width: number;
            height: number;
            z_index: number;
            rotation: number;
            name: string;
            color: string;
            element_id: string
          }) => ({
            main_frame_id: mainframe.id,
            id: el.element_id,
            top: el.y,
            left: el.x,
            image: el.image_url ? el.image_url : "",
            text: el.text_content ? el.text_content : "",
            type: el.type,
            width: el.width,
            height: el.height,
            z_index: el.z_index,
            rotation: el.rotation,
            name: el.name,
            color: el.color,
            uuid: el.element_id,
          }));
          setComponents(fixedElements);
        } catch (error) {
          console.log(error);
          toast.error("Something wrong, please try again later.")
        } finally {
          setIsLoadDesign(false)
          return;
        }
      };
      const fixedElements = storedElements.map(el => ({
        ...el,
        top: el.top ?? 0,
        left: el.left ?? 0,
      }));

      setComponents(fixedElements);
      setIsLoadDesign(false);
    }

    loadDesigns();
  }, [designId, mainframe])


  // auto save 

  // const saveProjectToDB = () => {
  //   if (!mainframe || !components) return;
  //   // Debounced function to prevent rapid save calls
  //   const debouncedSave = debounce(async () => {
  //     if (hasUnsavedChanges.current) {
  //       console.log("Saving...");
  //       // Reset flag after saving
  //       hasUnsavedChanges.current = false;

  //       const blob = await generatePreviewImage("canvas-design");
  //       const fileName = `preview-${mainframe.id}.png`;
  //       const publicUrl = await uploadPreviewImage(blob as Blob, fileName);

  //       if (!publicUrl) console.warn("process generated preview fail");

  //       await fetch('/api/design', {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ mainFrame: mainframe, components, preview_url: publicUrl }),
  //       });

  //       // then give notif
  //       toast.success('All changes saved.', {
  //         position: 'bottom-center',
  //         style: {
  //           padding: '8px',
  //           color: '#713200',
  //         },
  //         iconTheme: {
  //           primary: '#713200',
  //           secondary: '#FFFAEE',
  //         },
  //       });
  //     }
  //   }, 1000);

  //   // Execute the debounced function
  //   debouncedSave(mainframe as CanvasType, components);
  // };

  // useEffect(() => {
  //   const interval = setInterval(saveProjectToDB, 10000);

  //   return () => clearInterval(interval);
  // }, [hasUnsavedChanges.current]);


  const handleManualSave = async () => {
    if (mainframe) {
      setIsSaving(true); // Mulai loading
      try {
        const blob = await generatePreviewImage("canvas-design");
        const fileName = `preview-${mainframe.id}.png`;
        const publicUrl = await uploadPreviewImage(blob as Blob, fileName);

        if (!publicUrl) {
          console.warn("process generated preview fail");
        }

        await fetch('/api/design', {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mainFrame: mainframe, components, preview_url: publicUrl }),
        });
      } catch (err) {
        console.error("Save failed", err);
        toast.error('Failed to save.');
      } finally {
        setIsSaving(false); // Selesai loading
      }
    }
  };



  const debouncedSave = useMemo(() =>
    debounce(async (mainframe: CanvasType, components: ElementComponent[]) => {
      if (!mainframe || !components || isTyping) return;

      console.log("Saving...");
      // const blob = await generatePreviewImage("canvas-design");
      // const fileName = `preview-${mainframe.id}.png`;
      // const publicUrl = await uploadPreviewImage(blob as Blob, fileName);

      // if (!publicUrl) console.warn("process generated preview fail");

      await fetch('/api/design', {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mainFrame: mainframe, components }),
      });

      toast.success('All changes saved.', {
        position: 'bottom-center',
        style: { padding: '8px', color: '#713200' },
        iconTheme: { primary: '#713200', secondary: '#FFFAEE' },
      });
    }, 5000),
    [isTyping]);

  // undo redo feature
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;

    const prevState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [
      ...prev,
      { elements: JSON.parse(JSON.stringify(components)), mainframe: JSON.parse(JSON.stringify(mainframe)) }
    ]);
    setComponents(() => {
      saveDesign(designId as string, prevState.elements);
      return prevState.elements;
    });

    setMainFrame(() => {
      saveCanvas(designId as string, prevState.mainframe);
      return prevState.mainframe;
    });
  }, [components, mainframe, undoStack, designId]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [
      ...prev,
      { elements: JSON.parse(JSON.stringify(components)), mainframe: JSON.parse(JSON.stringify(mainframe)) }
    ]);
    setComponents(() => {
      saveDesign(designId as string, nextState.elements);
      return nextState.elements;
    });

    setMainFrame(() => {
      saveCanvas(designId as string, nextState.mainframe);
      return nextState.mainframe;
    });
  }, [components, mainframe, redoStack, designId]);


  useEffect(() => {
    if (isTyping) return;
    const handleKeyShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        // 🔄 Undo
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        handleRedo();
      }
    }
    window.addEventListener('keydown', handleKeyShortcut);

    return () => {
      window.removeEventListener('keydown', handleKeyShortcut)
    }
  }, [handleUndo, handleRedo, isTyping])

  return (
    <div className="h-screen flex flex-col relative">
      <Header handleExport={handleExport} handleManualSave={handleManualSave} isSaving={isSaving} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <LeftSidebar
          createShapes={createShapes}
          handleChangeBackground={handleChangeBackground}
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
                  selectedElement={selectedElement}
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
                updateTextValue={updateTextValue}
                addImage={addImage}
                newImageId={newImageId}
                mainFrame={mainframe}
                handleIsTyping={handleIsTyping}
                handleChange={handleChange}
                canvasRef={canvasRef}
              />
              {(selectedElement || selectedCanvas) && (
                <FeaturePanel
                  color={color}
                  handleShowColorPicker={handleShowColorPicker}
                  selectedElement={selectedElement}
                  handleDeleteElement={handleDeleteElement}
                  handleZIndexChange={handleZIndexChange}
                  selectedCanvas={selectedCanvas}
                  handleFontSizeChange={handleFontSizeChange}
                  handleFontFamilyChange={handleFontFamilyChange}
                  handleAlignTextChange={handleAlignTextChange}
                  handleFontItalicChange={handleFontItalicChange}
                  handleFontBoldChange={handleFontBoldChange}
                />
              )}
            </div>

            {isSaving && (
              <div className="z-[99999] rounded-md bg-white p-4 shadow-md absolute h-[100px] w-[300px] bottom-10 right-10 flex flex-col items-center justify-center gap-3">
                <h1 className="text-left w-full font-semibold text-sm">Generating...</h1>
                <div className="saving-progress-bar rounded-full w-full h-2" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { ElementComponent } from "@/types/Element.type";
import Rect from "@/components/design/Rect";
import Circle from "@/components/design/Circle";
import Polygon from "@/components/design/Polygon";
import { throttle } from "lodash";
import ImageElement from "@/components/design/ImageElement";
import { saveImageBlob } from "@/lib/indexDB";
import { CanvasType } from "@/types/CanvasType";
import Text from "@/components/design/Text";
import { uploadToSupabase } from "@/lib/supabase";
import { previewScale } from "@/utils/scale";

const THROTTLE_INTERVAL = 16; // 60 FPS

const Canvas = ({
  components,
  handleClickElement,
  selectedElement,
  updateElementPosition,
  drawerPosition,
  setDrawerPosition,
  updateElementSize,
  updateElementRotation,
  addImage,
  newImageId,
  mainFrame,
  updateTextValue,
  handleIsTyping,
  handleChange,
  canvasRef,
  isPreview,
  isMobile
}: {
  components: ElementComponent[],
  handleClickElement: (element: ElementComponent | CanvasType | null) => void;
  selectedElement: ElementComponent | null;
  updateElementPosition: (id: number, top: number, left: number) => void;
  drawerPosition: { top: number | null; left: number | null };
  setDrawerPosition: React.Dispatch<React.SetStateAction<{ top: number | null; left: number | null }>>
  updateElementSize: (id: number, width: number, height: number, fontSize?: number) => void;
  updateElementRotation: (id: number, rotation: number) => void;
  addImage: ({ clientX, clientY, newWidth, newHeight, blobUrl }: {
    clientX: number;
    clientY: number;
    newWidth: number;
    newHeight: number;
    blobUrl: string;
  }) => void;
  newImageId: string;
  mainFrame: CanvasType | null;
  updateTextValue: (id: number, text: string) => void;
  handleIsTyping: () => void;
  handleChange: () => void;
  canvasRef?: RefObject<HTMLDivElement | null>;
  isPreview?: boolean;
  isMobile?: boolean;
}) => {
  // const mainFrame = components.find((c) => c.name === "main_frame");
  const otherComponents = components.filter((c) => c.name !== "main_frame");
  const dragOffset = useRef({ x: 0, y: 0 });
  const [rotate, setRotate] = useState(0);
  const isDragging = useRef(false);
  const isRotating = useRef(false);
  const [isLoading, setLoading] = useState(true)
  const scala = isPreview ? previewScale : isMobile ? 0.4 : 1;
  const componentsRef = useRef(components)
  
  useEffect(() => {
    componentsRef.current = components;
  }, [components]);

  useEffect(()=>{
    setInterval(() => {
      setLoading(false)
    }, 800);
  }, [])

  // Helper untuk mendapatkan koordinat dari mouse atau sentuhan
  const getClientCoords = (e: MouseEvent | TouchEvent) => {
    if ("touches" in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  // Function to handle mouse down event for dragging the element
  // This function is called when the user clicks on the element
  // It calculates the offset between the mouse position and the element's position
  // and sets up event listeners for mouse move and mouse up events
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, component: ElementComponent) => {
    e.stopPropagation();
    if (isPreview) return;
    handleClickElement(component);

    const { x: startX, y: startY } = getClientCoords(e.nativeEvent);

    const elementRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragOffset.current = {
      x: startX - elementRect.left,
      y: startY - elementRect.top,
    };

    isDragging.current = true;

    const handleInteractionMove = throttle((moveEvent: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;

      // Mencegah scroll saat drag di mobile
      if (moveEvent.type === 'touchmove') {
        moveEvent.preventDefault();
      }

      const { x: moveX, y: moveY } = getClientCoords(moveEvent);

      const newLeft = moveX - dragOffset.current.x;
      const newTop = moveY - dragOffset.current.y;

      const parentRect = canvasRef?.current?.getBoundingClientRect();
      const relativeLeft = newLeft - (parentRect?.left || 0);
      const relativeTop = newTop - (parentRect?.top || 0);

      updateElementPosition(component.id, relativeTop / scala, relativeLeft / scala);
      setDrawerPosition({ top: relativeTop / scala, left: relativeLeft / scala });
    }, THROTTLE_INTERVAL);


    const handleInteractionEnd = () => {
      if (isDragging.current) {
        handleChange();
      }
      isDragging.current = false;
      setDrawerPosition({ top: null, left: null }); // Clear drawer lines

      document.removeEventListener("mousemove", handleInteractionMove);
      document.removeEventListener("mouseup", handleInteractionEnd);
      document.removeEventListener("touchmove", handleInteractionMove);
      document.removeEventListener("touchend", handleInteractionEnd);
    };

    document.addEventListener("mousemove", handleInteractionMove);
    document.addEventListener("touchmove", handleInteractionMove, { passive: false });

    document.addEventListener("mouseup", handleInteractionEnd);
    document.addEventListener("touchend", handleInteractionEnd);
  };

  // Function to handle resizing the element
  // This function is called when the user clicks and drags a resize handle
  // It calculates the new width and height based on the mouse movement
  // and updates the element's size accordingly
  const handleResize = (
    e: React.MouseEvent | React.TouchEvent,
    direction: string
  ) => {
    if (!selectedElement || isPreview || !componentsRef) return;

    e.stopPropagation();
    // Panggil preventDefault untuk touch event agar tidak men-trigger scroll
    if (e.type === 'touchstart') {
      e.preventDefault();
    } else {
      e.preventDefault();
    }

    const currentElement = componentsRef.current.find(el => el.id === selectedElement.id);
    if (!currentElement) return;

    const { x: startX, y: startY } = getClientCoords(e.nativeEvent);
    const startWidth = currentElement.width;
    const startHeight = currentElement.height;
    const startTop = currentElement.top;
    const startLeft = currentElement.left;
    const startFontSize = currentElement.font_size || 16;

    const handleResizeMove = (moveEvent: MouseEvent | TouchEvent) => {
      const { x: moveX, y: moveY } = getClientCoords(moveEvent);
      const dx = moveX - startX;
      const dy = moveY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newTop = startTop || 0;
      let newLeft = startLeft || 0;

      const isCornerResize = direction.includes("top") && direction.includes("left") ||
        direction.includes("top") && direction.includes("right") ||
        direction.includes("bottom") && direction.includes("left") ||
        direction.includes("bottom") && direction.includes("right");

      if (direction.includes("right")) newWidth += dx;
      if (direction.includes("bottom")) newHeight += dy;
      if (direction.includes("left")) { newWidth -= dx; newLeft += dx; }
      if (direction.includes("top")) { newHeight -= dy; newTop += dy; }

      if (newWidth > 20 && newHeight > 20) {
        updateElementSize(selectedElement.id, newWidth, newHeight);
        updateElementPosition(selectedElement.id, newTop, newLeft);
      }

      if (selectedElement.type === "text" && isCornerResize) {
        const scale = newWidth / startWidth;
        const newFontSize = Math.max(8, Math.round(startFontSize * scale));
        updateElementSize(selectedElement.id, newWidth, newHeight, newFontSize);
      }

    };

    const handleResizeEnd = () => {
      // Cleanup: Hapus SEMUA listener dari window
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", handleResizeEnd);
      window.removeEventListener("touchmove", handleResizeMove);
      window.removeEventListener("touchend", handleResizeEnd);
      handleChange();
    };

    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", handleResizeEnd);
    window.addEventListener("touchmove", handleResizeMove);
    window.addEventListener("touchend", handleResizeEnd);
  };

  // Function to handle rotation of the element
  // This function is called when the user clicks and drags the rotate handle
  // It calculates the new angle based on the mouse movement
  // and updates the element's rotation accordingly
  const handleRotate = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPreview || !selectedElement) return;
    e.preventDefault();
    e.stopPropagation();

    const currentElement = componentsRef.current.find(el => el.id === selectedElement.id);
    if (!currentElement) return;

    const target = document.getElementById(`element-${selectedElement.id}`);
    if (!target) return;

    const { x: startX, y: startY } = getClientCoords(e.nativeEvent);

    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Perbaikan: Ambil rotasi awal dari state/ref yang terjamin terbaru, bukan dari DOM/dataset
    const initialRotation = currentElement.rotation || 0;
    const startAngle = Math.atan2(startY - centerY, startX - centerX);

    const snapAngle = (angle: number, increment: number = 15) => {
      return Math.round(angle / increment) * increment;
    };

    const handleRotateMove = throttle((moveEvent: MouseEvent | TouchEvent) => {
      isRotating.current = true;
      const { x: moveX, y: moveY } = getClientCoords(moveEvent);

      const currentAngle = Math.atan2(moveY - centerY, moveX - centerX);
      const angleDiff = (currentAngle - startAngle) * (180 / Math.PI);
      let newRotation = initialRotation + angleDiff;

      // Normalisasi sudut bisa di-handle di akhir saja agar tidak "loncat" saat melewati 360
      target.style.transform = `rotate(${newRotation}deg)`;
      setRotate(newRotation); // Untuk menampilkan angka di UI
    }, THROTTLE_INTERVAL);

    const handleRotateEnd = () => {
      isRotating.current = false;

      window.removeEventListener("mousemove", handleRotateMove);
      window.removeEventListener("mouseup", handleRotateEnd);
      window.removeEventListener("touchmove", handleRotateMove);
      window.removeEventListener("touchend", handleRotateEnd);

      const transform = target.style.transform;
      const match = transform.match(/rotate\(([-0-9.]+)deg\)/);
      const finalRotation = match ? parseFloat(match[1]) : initialRotation;

      const snapped = snapAngle(finalRotation);

      target.style.transform = `rotate(${snapped}deg)`;
      updateElementRotation(selectedElement.id, snapped);
      setRotate(snapped);
    };

    window.addEventListener("mousemove", handleRotateMove);
    window.addEventListener("touchmove", handleRotateMove, { passive: false });
    window.addEventListener("mouseup", handleRotateEnd);
    window.addEventListener("touchend", handleRotateEnd);
  };

  // handle drag and drop image
  // This function is called when the user drops an image onto the canvas

  const loadImage = (src: string, dropX: number, dropY: number) => {
    if (isPreview) return
    const img = new Image();
    img.src = src;

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      const maxWidth = 300;
      const maxHeight = 300;

      let newWidth = width;
      let newHeight = height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        newWidth = width * ratio;
        newHeight = height * ratio;
      }

      // on this calculation is for handling element always following cursor
      // when user drag n drop
      const finalLeft = dropX - (newWidth / 2);
      const finalTop = dropY - (newHeight / 2);

      addImage({
        blobUrl: src,
        clientX: finalLeft,
        clientY: finalTop,
        newWidth,
        newHeight,
      });
    };
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef || isPreview) return;

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    const dropX = e.clientX - (canvasRect?.left ?? 0);
    const dropY = e.clientY - (canvasRect?.top ?? 0);

    const file = e.dataTransfer.files[0];

    if (file && file.type.startsWith('image/')) {
      // Local file — langsung upload
      const blobUrl = URL.createObjectURL(file);
      loadImage(blobUrl, dropX, dropY);
      await saveImageBlob(Number(newImageId), file);
      const result = await uploadToSupabase(file, `local-${Date.now()}-${file.name}`);
      if (result) {
        console.log('Uploaded from local file:', result);
        loadImage(result, dropX, dropY);
      }
    } else {
      const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
      if (url && url.startsWith('http')) {
        loadImage(url, dropX, dropY);
      }
    }
  };

  return (
    <div className="flex justify-center items-center relative">
      <div className="relative w-auto h-auto">
        <div
          id="canvas-design"
          ref={canvasRef}
          onMouseDown={() => handleClickElement(mainFrame)}
          className={`${isLoading && 'blur-[5px] pointer-events-none transition-all duration-300 ease-in'}  overflow-hidden relative hover:border-[3px] hover:border-indigo-400 shadow-md ${selectedElement?.id === mainFrame?.id ? 'border-[3px] border-indigo-500' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{
            width: mainFrame ? mainFrame.width * scala : "100%",
            height: mainFrame ? mainFrame.height * scala : "100%",
            background: mainFrame ? mainFrame.background_color : "#DBDBDB",
            zIndex: 1,
            userSelect: 'none'
          }}
        >
          {/* If there's a background image */}
          {mainFrame && mainFrame.background_image && (
            <img
              draggable={false}
              className="w-full h-full object-cover"
              src={mainFrame.background_image}
              alt="canvas"
            />
          )}

          {/* Render shapes or other components inside main_frame */}
          {otherComponents.map((component, index) => {
            const isSelected = selectedElement?.id === component.id;

            if (component.name === "rect" && component.type === "shape") {
              return <Rect
                component={component}
                handleClickElement={handleClickElement}
                isSelected={isSelected}
                key={index}
                handleMouseDown={handleMouseDown}
                handleResize={handleResize}
                handleRotate={handleRotate}
                isRotating={isRotating}
                rotate={rotate}
                isPreview={isPreview}
                scala={scala}
              />
            }

            if (component.name === "circle" && component.type === "shape") {
              return <Circle
                component={component}
                handleClickElement={handleClickElement}
                isSelected={isSelected}
                key={index}
                handleMouseDown={handleMouseDown}
                handleResize={handleResize}
                handleRotate={handleRotate}
                isRotating={isRotating}
                rotate={rotate}
                isPreview={isPreview}
                scala={scala}
              />
            }

            if (component.name === "polygon" && component.type === "shape") {
              return <Polygon
                component={component}
                handleClickElement={handleClickElement}
                isSelected={isSelected}
                key={index}
                handleMouseDown={handleMouseDown}
                handleResize={handleResize}
                handleRotate={handleRotate}
                isRotating={isRotating}
                rotate={rotate}
                isPreview={isPreview}
                scala={scala}
              />
            }

            if (component.name === "image" && component.type === "image") {
              return (
                <ImageElement
                  component={component}
                  handleClickElement={handleClickElement}
                  isSelected={isSelected}
                  key={index}
                  handleMouseDown={handleMouseDown}
                  handleResize={handleResize}
                  handleRotate={handleRotate}
                  isRotating={isRotating}
                  rotate={rotate}
                  isPreview={isPreview}
                  scala={scala}
                />
              )
            }

            if (component.type === "text") {
              return <Text
                component={component}
                handleClickElement={handleClickElement}
                isSelected={isSelected}
                key={index}
                handleMouseDown={handleMouseDown}
                handleResize={handleResize}
                handleRotate={handleRotate}
                isRotating={isRotating}
                rotate={rotate}
                updateTextValue={updateTextValue}
                handleIsTyping={handleIsTyping}
                isPreview={isPreview}
                scala={scala}
              />
            }

            return null;
          })}
          {
            drawerPosition.top !== null && (
              <div
                className="absolute left-0 w-full h-[1px] pointer-events-none"
                style={{
                  top: drawerPosition.top * scala,
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
                  left: drawerPosition.left * scala,
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

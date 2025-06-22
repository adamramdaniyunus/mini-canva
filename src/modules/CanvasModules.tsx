"use client";
import React, { RefObject, useRef, useState } from "react";
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
  isPreview
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
  isPreview?:boolean;
}) => {
  // const mainFrame = components.find((c) => c.name === "main_frame");
  const otherComponents = components.filter((c) => c.name !== "main_frame");
  const dragOffset = useRef({ x: 0, y: 0 });
  const [rotate, setRotate] = useState(0);
  const isDragging = useRef(false);
  const isRotating = useRef(false);
  const isLoading = !mainFrame;
  const scala = isPreview ? previewScale : 1;

  // Function to handle mouse down event for dragging the element
  // This function is called when the user clicks on the element
  // It calculates the offset between the mouse position and the element's position
  // and sets up event listeners for mouse move and mouse up events
  const handleMouseDown = (e: React.MouseEvent, component: ElementComponent) => {
    // if (!selectedElement) return
    e.stopPropagation();
    if(isPreview) return
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

      const parentRect = canvasRef?.current?.getBoundingClientRect();
      const relativeLeft = newLeft - (parentRect?.left || 0);
      const relativeTop = newTop - (parentRect?.top || 0);

      updateElementPosition(component.id, relativeTop, relativeLeft);
      setDrawerPosition({ top: relativeTop, left: relativeLeft });
    }, THROTTLE_INTERVAL);


    const handleMouseUp = () => {
      handleChange();
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
    if (!selectedElement || isPreview) return
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = selectedElement.width;
    const startHeight = selectedElement.height;
    const startTop = selectedElement.top;
    const startLeft = selectedElement.left;
    const startFontSize = selectedElement.font_size || 16;

    const onMouseMove = throttle((moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newTop = startTop || 0;
      let newLeft = startLeft || 0;

      const isCornerResize = direction.includes("top") && direction.includes("left") ||
        direction.includes("top") && direction.includes("right") ||
        direction.includes("bottom") && direction.includes("left") ||
        direction.includes("bottom") && direction.includes("right");

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

      if (selectedElement.type === "text" && isCornerResize) {
        // Calculate the new font size based on the new width and height
        const scale = newWidth / startWidth;
        const newFontSize = Math.max(8, Math.round(startFontSize * scale));
        updateElementSize(selectedElement.id, newWidth, newHeight, newFontSize);
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
    if(isPreview) return
    e.preventDefault();
    e.stopPropagation();
    if (!selectedElement) return;

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



  // handle drag and drop image
  // This function is called when the user drops an image onto the canvas

  const loadImage = (src: string, dropX: number, dropY: number) => {
    if(isPreview) return
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
    if(!canvasRef || isPreview) return;

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
            width: mainFrame ? isPreview ? mainFrame.width * scala : mainFrame.width : 500 * scala,
            height: mainFrame ? isPreview ? mainFrame.height * scala :  mainFrame.height : 400 * scala,
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

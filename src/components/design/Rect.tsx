import { ElementComponent } from '@/types/Element.type';
import React from 'react'
import { throttle } from 'lodash';

const THROTTLE_INTERVAL = 16; // 60 FPS

const Rect = ({
    component,
    handleClickElement,
    dragOffset,
    isDragging,
    updateElementPosition,
    isSelected,
    ref,
    setDrawerPosition,
    updateElementSize
}: {
    component: ElementComponent,
    handleClickElement: (element: ElementComponent) => void,
    dragOffset: React.MutableRefObject<{ x: number; y: number; }>,
    isDragging: React.MutableRefObject<boolean>;
    updateElementPosition: (id: number, top: number, left: number) => void,
    isSelected: boolean,
    ref: React.RefObject<HTMLDivElement | null>;
    setDrawerPosition: React.Dispatch<React.SetStateAction<{ top: number | null; left: number | null }>>;
    updateElementSize: (id: number, width: number, height: number) => void;
}) => {
    // Function to handle mouse down event for dragging the element
    // This function is called when the user clicks on the element
    // It calculates the offset between the mouse position and the element's position
    // and sets up event listeners for mouse move and mouse up events
    const handleMouseDown = (e: React.MouseEvent) => {
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
        e.stopPropagation();
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = component.width;
        const startHeight = component.height;
        const startTop = component.top;
        const startLeft = component.left;

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
                updateElementSize(component.id, newWidth, newHeight);
                updateElementPosition(component.id, newTop, newLeft);
            }
        }, THROTTLE_INTERVAL);

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            key={component.id}
            className={`absolute hover:border-[2px] hover:border-indigo-400 ${isSelected ? "border-[2px] border-indigo-500" : ""
                }`}
            style={{
                width: component.width + "px",
                height: component.height + "px",
                background: component.color,
                zIndex: component.z_index,
                top: component.top,
                left: component.left,
                cursor: "move",
            }}
        >
            {/* Resize Handles */}
            {isSelected && (
                <>
                    {/* Corner Resizers */}
                    {["top-left", "top-right", "bottom-left", "bottom-right"].map((dir) => (
                        <div
                            key={dir}
                            onMouseDown={(e) => handleResize(e, dir)}
                            className={`w-2 h-2 bg-white border border-black absolute cursor-${dir === "top-left" || dir === "bottom-right" ? "nwse" : "nesw"}-resize`}
                            style={{
                                top: dir.includes("top") ? -4 : undefined,
                                bottom: dir.includes("bottom") ? -4 : undefined,
                                left: dir.includes("left") ? -4 : undefined,
                                right: dir.includes("right") ? -4 : undefined,
                            }}
                        />
                    ))}

                    {/* Side Resizers */}
                    {["top", "right", "bottom", "left"].map((dir) => (
                        <div
                            key={dir}
                            onMouseDown={(e) => handleResize(e, dir)}
                            className={`absolute bg-white border border-black ${dir == "right" || dir == "left" ? "cursor-e-resize" : "cursor-ns-resize"}`}
                            style={{
                                width: dir === "top" || dir === "bottom" ? "10px" : "4px",
                                height: dir === "left" || dir === "right" ? "10px" : "4px",
                                top: dir === "top" ? -4 : dir === "bottom" ? undefined : "50%",
                                bottom: dir === "bottom" ? -4 : undefined,
                                left: dir === "left" ? -4 : dir === "right" ? undefined : "50%",
                                right: dir === "right" ? -4 : undefined,
                                transform: "translate(-50%, -50%)",
                                cursor: `${dir}-resize`,
                            }}
                        />
                    ))}
                </>
            )}
        </div>
    );
}

export default Rect
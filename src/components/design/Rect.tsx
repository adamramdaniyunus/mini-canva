import { ElementComponent } from '@/types/Element.type';
import React from 'react'

const Rect = ({
    component,
    handleClickElement,
    dragOffset,
    isDragging,
    updateElementPosition,
    isSelected,
    ref
} : {
    component: ElementComponent,
    handleClickElement: (element: ElementComponent) => void,
    dragOffset: React.MutableRefObject<{ x: number; y: number; }>,
    isDragging: React.MutableRefObject<boolean>;
    updateElementPosition: (id: number, top: number, left: number) => void,
    isSelected: boolean,
    ref: React.RefObject<HTMLDivElement| null>;
}) => {
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

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!isDragging.current) return;

            const newLeft = moveEvent.clientX - dragOffset.current.x;
            const newTop = moveEvent.clientY - dragOffset.current.y;

            const parentRect = ref.current?.getBoundingClientRect();
            const relativeLeft = newLeft - (parentRect?.left || 0);
            const relativeTop = newTop - (parentRect?.top || 0);

            updateElementPosition(component.id, relativeTop, relativeLeft);
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
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
                <div className="absolute w-full h-full">
                    <div
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-2 h-2 bg-white border border-black absolute -top-1 -left-1 cursor-nwse-resize"
                    />
                    <div
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-2 h-2 bg-white border border-black absolute -top-1 -right-1 cursor-nesw-resize"
                    />
                    <div
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-2 h-2 bg-white border border-black absolute -bottom-1 -left-1 cursor-nesw-resize"
                    />
                    <div
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-2 h-2 bg-white border border-black absolute -bottom-1 -right-1 cursor-nwse-resize"
                    />
                </div>
            )}
        </div>
    );
}

export default Rect
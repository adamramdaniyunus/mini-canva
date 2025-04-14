import { ElementComponent } from '@/types/Element.type';
import React from 'react'
import { throttle } from 'lodash';
import ResizeButton from './ResizeButton';

const THROTTLE_INTERVAL = 16; // 60 FPS

const Polygon = ({
    component,
    handleClickElement,
    dragOffset,
    isDragging,
    updateElementPosition,
    isSelected,
    ref,
    setDrawerPosition
}: {
    component: ElementComponent,
    handleClickElement: (element: ElementComponent) => void,
    dragOffset: React.MutableRefObject<{ x: number; y: number; }>,
    isDragging: React.MutableRefObject<boolean>;
    updateElementPosition: (id: number, top: number, left: number) => void,
    isSelected: boolean,
    ref: React.RefObject<HTMLDivElement | null>;
    setDrawerPosition: React.Dispatch<React.SetStateAction<{ top: number | null; left: number | null }>>
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


    return (
        <div
            onMouseDown={handleMouseDown}
            key={component.id}
            className={`absolute group hover:border-[2px] hover:border-indigo-400 ${isSelected ? 'border-[2px] border-indigo-500' : ''}`}
            style={{
                width: component.width + "px",
                height: component.height + "px",
                zIndex: component.z_index,
                top: component.top,
                left: component.left,
            }}
        >
            <div
                className="w-full h-full"
                style={{
                    background: component.color,
                    clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
                }}
            ></div>
            {/* Resize Handles */}
            {isSelected && <ResizeButton />}
        </div>
    )
}

export default Polygon
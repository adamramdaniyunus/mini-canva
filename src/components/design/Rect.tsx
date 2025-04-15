import { ElementComponent } from '@/types/Element.type';
import React from 'react'
import ResizeButton from './ResizeButton';

const Rect = ({
    component,
    handleClickElement,
    isSelected,
    handleMouseDown,
    handleResize,
}: {
    component: ElementComponent,
    handleClickElement: (element: ElementComponent) => void,
    isSelected: boolean,
    handleMouseDown: (e: React.MouseEvent, component: ElementComponent) => void;
    handleResize: (e: React.MouseEvent, direction: string) => void;
}) => {

    return (
        <div
            onMouseDown={(e) => handleMouseDown(e, component)}
            onClick={() => handleClickElement(component)}
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
            {isSelected && <ResizeButton handleResize={handleResize} />}
        </div>
    );
}

export default Rect
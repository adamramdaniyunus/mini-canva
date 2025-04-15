import { ElementComponent } from '@/types/Element.type';
import React from 'react'
import ResizeButton from './ResizeButton';

const Circle = ({
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
            key={component.id}
            onClick={() => handleClickElement(component)}
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
                className="w-full h-full rounded-full"
                style={{
                    background: component.color,
                }}
            ></div>
            {/* Resize Handles */}
            {isSelected && <ResizeButton handleResize={handleResize} />}
        </div>
    )
}

export default Circle
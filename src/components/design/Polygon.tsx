import { ElementComponent } from '@/types/Element.type';
import React from 'react'
import ResizeButton from './ResizeButton';

const Polygon = ({
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
            {isSelected && <ResizeButton handleResize={handleResize} />}
        </div>
    )
}

export default Polygon
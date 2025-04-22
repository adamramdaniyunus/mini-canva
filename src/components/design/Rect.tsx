import { ElementComponent } from '@/types/Element.type';
import React, { RefObject } from 'react'
import ResizeButton from './ResizeButton';

const Rect = ({
    component,
    handleClickElement,
    isSelected,
    handleMouseDown,
    handleResize,
    handleRotate,
    isRotating,
    rotate,
}: {
    component: ElementComponent,
    handleClickElement: (element: ElementComponent) => void,
    isSelected: boolean,
    handleMouseDown: (e: React.MouseEvent, component: ElementComponent) => void;
    handleResize: (e: React.MouseEvent, direction: string) => void;
    handleRotate: (e: React.MouseEvent) => void;
    isRotating: RefObject<boolean>;
    rotate: number;
}) => {

    return (
        <div
            onMouseDown={(e) => handleMouseDown(e, component)}
            onClick={() => handleClickElement(component)}
            key={component.id}
            id={`element-${component.id}`}
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
                transform: `rotate(${component.rotation || 0}deg)`,
                transformOrigin: 'center',
            }}
        >
            {isRotating.current && isSelected && <p className='absolute -top-7 text-indigo-500 text-sm'
                style={{
                    transform: `rotate(-${component.rotation || 0}deg)`, // agar tidak ikut muter
                }}>{
                    Math.floor(rotate)}
            </p>}
            {/* Resize Handles */}
            {isSelected && <ResizeButton handleResize={handleResize} handleRotate={handleRotate} />}
        </div>
    );
}

export default Rect
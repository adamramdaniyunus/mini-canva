import { ElementComponent } from '@/types/Element.type';
import React, { RefObject } from 'react'
import ResizeButton from './ResizeButton';

const Text = ({
    component,
    handleClickElement,
    isSelected,
    handleMouseDown,
    handleResize,
    handleRotate,
    isRotating,
    rotate
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
    const isGradient = component.color?.includes("linear-gradient");
    return (
        <div
            onMouseDown={(e) => handleMouseDown(e, component)}
            onClick={() => handleClickElement(component)}
            onDoubleClick={() => console.log("double click")}
            key={component.id}
            id={`element-${component.id}`}
            className={`absolute flex items-center cursor-pointer ${isSelected ? 'border-2 border-indigo-500' : ''}`}
            style={{
                top: component.top,
                left: component.left,
                width: component.width,
                height: "auto",
                transform: `rotate(${rotate}deg)`,
                zIndex: component.z_index,
                fontFamily: component.font_family,
                fontSize: component.font_size,
                backgroundImage: isGradient ? component.color : undefined,
                WebkitBackgroundClip: isGradient ? "text" : undefined,
                WebkitTextFillColor: isGradient ? "transparent" : undefined,
                backgroundClip: isGradient ? "text" : undefined,
                color: isGradient ? "transparent" : component.color,
            }}
        >
            {isRotating.current && isSelected && <p className='absolute -top-7 text-indigo-500 text-sm'
                style={{
                    transform: `rotate(-${component.rotation || 0}deg)`, // agar tidak ikut muter
                }}>{
                    Math.floor(rotate)}
            </p>}
            {component.text}
            {/* Resize Handles */}
            {isSelected && <ResizeButton handleResize={handleResize} handleRotate={handleRotate} />}
        </div>
    );
}

export default Text
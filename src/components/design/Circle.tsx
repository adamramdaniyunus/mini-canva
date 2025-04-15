import { ElementComponent } from '@/types/Element.type';
import React, { RefObject } from 'react'
import ResizeButton from './ResizeButton';

const Circle = ({
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

    return (
        <div
            onMouseDown={(e) => handleMouseDown(e, component)}
            key={component.id}
            id={`element-${component.id}`}
            onClick={() => handleClickElement(component)}
            className={`absolute group hover:border-[2px] hover:border-indigo-400 ${isSelected ? 'border-[2px] border-indigo-500' : ''}`}
            style={{
                width: component.width + "px",
                height: component.height + "px",
                zIndex: component.z_index,
                top: component.top,
                left: component.left,
                transform: `rotate(${component.rotation || 0}deg)`,
                transformOrigin: 'center',
            }}
        >
            <div
                className="w-full h-full rounded-full"
                style={{
                    background: component.color,
                }}
            ></div>
            {isRotating.current && isSelected && <p className='absolute -top-7 text-indigo-500 text-sm'>{Math.floor(rotate)}</p>}
            {/* Resize Handles */}
            {isSelected && <ResizeButton handleResize={handleResize} handleRotate={handleRotate} />}
        </div>
    )
}

export default Circle
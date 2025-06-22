import { ElementComponent } from '@/types/Element.type';
import React, { RefObject, useEffect, useRef, useState } from 'react'
import ResizeButton from './ResizeButton';
import { previewScale } from '@/utils/scale';

const Text = ({
    component,
    handleClickElement,
    isSelected,
    handleMouseDown,
    handleResize,
    handleRotate,
    isRotating,
    rotate,
    updateTextValue,
    handleIsTyping,
    isPreview
}: {
    component: ElementComponent,
    handleClickElement: (element: ElementComponent) => void,
    isSelected: boolean,
    handleMouseDown: (e: React.MouseEvent, component: ElementComponent) => void;
    handleResize: (e: React.MouseEvent, direction: string) => void;
    handleRotate: (e: React.MouseEvent) => void;
    isRotating: RefObject<boolean>;
    rotate: number;
    updateTextValue: (id: number, value: string) => void;
    handleIsTyping: () => void;
    isPreview?:boolean;
}) => {
    const isGradient = component.color?.includes("linear-gradient");
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(component.text);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [isEditing]);


    return (
        <div
            onMouseDown={(e) => {
                if (!isEditing) handleMouseDown(e, component);
            }}
            onClick={() => {
                if(isPreview) return;
                handleClickElement(component)
            }}
            onDoubleClick={() => {
                setIsEditing(true)
                handleIsTyping()
            }}
            key={component.id}
            id={`element-${component.id}`}
            className={`absolute flex items-center cursor-pointer ${isSelected ? 'border-2 border-indigo-500' : ''}`}
            style={{
                width: isPreview ? component.width * previewScale : component.width + "px",
                // height: isPreview ? component.height * previewScale : component.height + "px",
                zIndex: component.z_index,
                top: isPreview ? component.top! * previewScale : component.top,
                left: isPreview ? component.left! * previewScale : component.left,
                height: "auto",
                transform: `rotate(${rotate}deg)`,
                fontFamily: component.font_family,
                fontSize: isPreview ? component.font_size! * previewScale : component.font_size,
                backgroundImage: isGradient ? component.color : undefined,
                WebkitBackgroundClip: isGradient ? "text" : undefined,
                WebkitTextFillColor: isGradient ? "transparent" : undefined,
                backgroundClip: isGradient ? "text" : undefined,
                color: isGradient ? "transparent" : component.color,
                fontStyle: component.font_italic ? 'italic' : 'normal',
                fontWeight: component.font_bold ? 'bold' : 'normal',
                textAlign: component.align,
            }}
        >
            {isRotating.current && isSelected && <p className='absolute -top-7 text-indigo-500 text-sm'
                style={{
                    transform: `rotate(-${component.rotation || 0}deg)`, // agar tidak ikut muter
                }}>{
                    Math.floor(rotate)}
            </p>}
            {isEditing ? (
                <textarea
                    value={value}
                    ref={textareaRef}
                    rows={component && component.text!.split('\n').length}
                    onChange={(e) => {
                        setValue(e.target.value);
                        updateTextValue(component.id, e.target.value); // Update value di parent
                        component.text = e.target.value;
                    }}
                    onBlur={() => {
                        setIsEditing(false)
                        handleIsTyping()
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            setIsEditing(false); // Enter tanpa Shift keluar dari edit mode
                            handleIsTyping()
                        }
                    }}
                    autoFocus
                    className={`bg-transparent border-none outline-none resize-none w-full h-full ${isGradient ? 'text-transparent' : ''}`}
                    style={{
                        fontFamily: component.font_family,
                        fontSize: component.font_size,
                        color: isEditing ? component.color : 'transparent', // tampilkan warna saat editing
                        backgroundImage: isGradient && !isEditing ? component.color : undefined,
                        WebkitBackgroundClip: isGradient && !isEditing ? "text" : undefined,
                        WebkitTextFillColor: isGradient && !isEditing ? "transparent" : undefined,
                        backgroundClip: isGradient && !isEditing ? "text" : undefined,
                        overflow: 'hidden',
                        minHeight: '1.5em',
                        caretColor: 'black',
                        textAlign: component.align,
                    }}
                />
            ) : (
                <p style={{ textAlign: component.align }} className={`w-full whitespace-pre-wrap ${isGradient ? 'text-transparent' : ''}`}>
                    {component.text}
                </p>
            )}
            {/* Resize Handles */}
            {!isPreview && isSelected && <ResizeButton handleResize={handleResize} handleRotate={handleRotate} />}
        </div>
    );
}

export default Text
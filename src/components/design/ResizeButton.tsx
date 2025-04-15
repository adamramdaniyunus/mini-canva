import React from 'react'
import { FaRotate } from 'react-icons/fa6';

const ResizeButton = ({ handleResize, handleRotate }:
    {
        handleResize: (e: React.MouseEvent, direction: string) => void;
        handleRotate: (e: React.MouseEvent) => void;
    }) => {
    return (
        <>
            <div
                onMouseDown={(e) => handleRotate(e)}
                className="absolute bg-white border border-black rounded-full cursor-pointer"
                style={{
                    top: -40, // di atas shape
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                <FaRotate/>
            </div>
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
    )
}

export default ResizeButton
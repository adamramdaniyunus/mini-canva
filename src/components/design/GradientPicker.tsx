import React from 'react'
import { HexColorPicker } from 'react-colorful'
import Button from '../Button'

const GradientPicker = ({
    gradientStart,
    gradientEnd,
    setGradientEnd,
    setGradientAngle,
    setGradientStart,
    gradientAngle,
    handleAddGradient
}: {
    gradientStart: string
    gradientEnd: string
    setGradientEnd: (color: string) => void
    setGradientAngle: (angle: number) => void
    setGradientStart: (color: string) => void
    gradientAngle: number
    handleAddGradient: () => void
}) => {
    return (
        <div className="space-y-1">
            <div>
                <label className="text-xs text-gray-500">From:</label>
                <HexColorPicker style={{height: 150}} color={gradientStart} className="h-32 w-32" onChange={setGradientStart} />
            </div>
            <div>
                <label className="text-xs text-gray-500">To:</label>
                <HexColorPicker style={{height: 150}} color={gradientEnd} className="h-32 w-32" onChange={setGradientEnd} />
            </div>
            <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500">Angle:</label>
                <input
                    type="range"
                    min="0"
                    max="360"
                    value={gradientAngle}
                    onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                    className="w-full"
                />
                <span className="text-xs">{gradientAngle}°</span>
            </div>

            <div className="mt-2 flex items-center gap-2">
                <div
                    className="w-10 h-8 rounded-full border shadow"
                    style={{
                        background: `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd})`
                    }}
                />
                <Button onClick={handleAddGradient}>Add Gradient</Button>
            </div>
        </div>
    )
}

export default GradientPicker
import { HexColorPicker } from "react-colorful";
import { FaPlus } from "react-icons/fa6";
import Button from "@/components/Button";
import { IoColorPaletteOutline } from "react-icons/io5";
import { CgClose, CgColorBucket } from "react-icons/cg";
import { useState } from "react";
import GradientPicker from "./GradientPicker";
import { ElementComponent } from "@/types/Element.type";

const defaultColors = ["#000000", "#2B2710", "#B34721", "#DDD0C0", "#EDE6DE"];
const colorData = [
    { name: "Red", hex: "#E74C3C" },
    { name: "Purple", hex: "#8E44AD" },
    { name: "Light Blue", hex: "#3498DB" },
    { name: "Turquoise", hex: "#1ABC9C" },
    { name: "Light Green", hex: "#2ECC71" },
    { name: "Gold Yellow", hex: "#F1C40F" },
    { name: "Bright Orange", hex: "#E67E22" },
    { name: "Dark Blue", hex: "#34495E" },
    { name: "Teal Green", hex: "#16A085" },
    { name: "Soft Green", hex: "#27AE60" },
    { name: "Deep Blue", hex: "#2980B9" },
    { name: "Deep Orange", hex: "#D35400" },
    { name: "Dark Red", hex: "#C0392B" },
    { name: "Neutral Gray", hex: "#7F8C8D" },
    { name: "Light Gray", hex: "#BDC3C7" },
    { name: "Silver Gray", hex: "#95A5A6" },
    { name: "Orange Yellow", hex: "#F39C12" },
    { name: "Bright Purple", hex: "#9B59B6" },
    { name: "Blue Gray", hex: "#5D6D7E" },
    { name: "Soft Purple", hex: "#A569BD" }
];

const gradientColors = [
    {
        label: "Sunset",
        gradient: "linear-gradient(to right, #ff7e5f, #feb47b)",
        colors: ["#ff7e5f", "#feb47b"]
    },
    {
        label: "Ocean Blue",
        gradient: "linear-gradient(to right, #2193b0, #6dd5ed)",
        colors: ["#2193b0", "#6dd5ed"]
    },
    {
        label: "Mojito",
        gradient: "linear-gradient(to right, #1d976c, #93f9b9)",
        colors: ["#1d976c", "#93f9b9"]
    },
    {
        label: "Lavender",
        gradient: "linear-gradient(to right, #b993d6, #8ca6db)",
        colors: ["#b993d6", "#8ca6db"]
    },
    {
        label: "Peach",
        gradient: "linear-gradient(to right, #ffecd2, #fcb69f)",
        colors: ["#ffecd2", "#fcb69f"]
    },
    {
        label: "Aqua Sky",
        gradient: "linear-gradient(to right, #13547a, #80d0c7)",
        colors: ["#13547a", "#80d0c7"]
    },
    {
        label: "Bloody Mary",
        gradient: "linear-gradient(to right, #f85032, #e73827)",
        colors: ["#f85032", "#e73827"]
    },
    {
        label: "Mango Twist",
        gradient: "linear-gradient(to right, #ffe259, #ffa751)",
        colors: ["#ffe259", "#ffa751"]
    },
    {
        label: "Night Fade",
        gradient: "linear-gradient(to right, #a18cd1, #fbc2eb)",
        colors: ["#a18cd1", "#fbc2eb"]
    },
    {
        label: "Forest",
        gradient: "linear-gradient(to right, #5a3f37, #2c7744)",
        colors: ["#5a3f37", "#2c7744"]
    },
    {
        label: "Pink Dream",
        gradient: "linear-gradient(to right, #ff9a9e, #fad0c4)",
        colors: ["#ff9a9e", "#fad0c4"]
    },
    {
        label: "Twilight",
        gradient: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
        colors: ["#0f2027", "#203a43", "#2c5364"]
    },
    {
        label: "Skyline",
        gradient: "linear-gradient(to right, #1488cc, #2b32b2)",
        colors: ["#1488cc", "#2b32b2"]
    },
    {
        label: "Fresh Lime",
        gradient: "linear-gradient(to right, #dce35b, #45b649)",
        colors: ["#dce35b", "#45b649"]
    },
    {
        label: "Berry",
        gradient: "linear-gradient(to right, #e96443, #904e95)",
        colors: ["#e96443", "#904e95"]
    },
    {
        label: "Deep Space",
        gradient: "linear-gradient(to right, #000000, #434343)",
        colors: ["#000000", "#434343"]
    },
    {
        label: "Coral Candy",
        gradient: "linear-gradient(to right, #f6d365, #fda085)",
        colors: ["#f6d365", "#fda085"]
    },
    {
        label: "Cold Flame",
        gradient: "linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)",
        colors: ["#3a1c71", "#d76d77", "#ffaf7b"]
    },
    {
        label: "Dark Ocean",
        gradient: "linear-gradient(to right, #373b44, #4286f4)",
        colors: ["#373b44", "#4286f4"]
    },
    {
        label: "Rose Water",
        gradient: "linear-gradient(to right, #e55d87, #5fc3e4)",
        colors: ["#e55d87", "#5fc3e4"]
    }
];


const ColorPicker = ({
    handleShowColorPicker,
    handleChangeColor,
    color: pickColor,
    selectedElement
}: {
    handleShowColorPicker: () => void;
    handleChangeColor: (color: string) => void;
    color: string;
    selectedElement: ElementComponent | null;
}) => {
    const [colors, setColors] = useState(defaultColors);
    const [showPicker, setShowPicker] = useState(false);
    const [newColor, setNewColor] = useState("#000000");
    const [gradientStart, setGradientStart] = useState("#ff0000");
    const [gradientEnd, setGradientEnd] = useState("#0000ff");
    const [gradientAngle, setGradientAngle] = useState(90);
    const [colorPalettes, setColorPalettes] = useState("basic");

    const handleAddGradient = () => {
        const gradient = `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd})`;
        setColors([...colors, gradient]);
        setShowPicker(false);
    };


    const handleAddColor = () => {
        setColors([...colors, newColor]);
        setShowPicker(false);
    };


    const colorPalettesRender = ({ color, index }: { color: string; index: number }) => {
        return (
            <div
                onClick={() => handleChangeColor(color)}
                key={index}
                className={`w-10 h-10 rounded-full cursor-pointer ${color == pickColor ? 'border-2 border-indigo-500' : ''}`}
                style={{ background: color }}
            />
        )
    }

    return (
        <div className="p-2 z-[999999] left-20 fixed h-full w-64 rounded shadow top-[68px] bg-white overflow-auto">
            <div className="flex justify-between w-full pb-2">
                <p className="text-sm font-semibold">Color</p>
                <button className="cursor-pointer" onClick={handleShowColorPicker}>
                    <CgClose />
                </button>
            </div>
            <h2 className="font-semibold text-sm mb-2 flex items-center gap-2"> <span><CgColorBucket /> </span> Custom Color</h2>
            <div className="flex gap-2 flex-wrap items-center">
                {/* Button "+" */}
                <div className="relative">
                    <button
                        onClick={() => setShowPicker(!showPicker)}
                        className="w-10 h-10 cursor-pointer rounded-full flex items-center justify-center bg-white"
                        style={{ background: "conic-gradient(red, orange, yellow, green, cyan, blue, violet, red)" }}
                    >
                        <span className="bg-white rounded-full p-[2px] text-xs font-bold flex items-center justify-center"><FaPlus /></span>
                    </button>

                    {/* Color Picker Popup */}
                    {showPicker && (
                        <div className="absolute top-8 left-0 z-10 p-2 bg-white shadow rounded">
                            <div className="flex gap-4">
                                <button onClick={() => setColorPalettes("basic")} className={`text-xs font-semibold px-2 cursor-pointer py-3 ${colorPalettes == 'basic' && 'border-indigo-500 border-b-2'}`}>Basic Color</button>
                                {selectedElement?.type !== 'text' && <button onClick={() => setColorPalettes("gradient")} className={`text-xs font-semibold px-2 cursor-pointer py-3 ${colorPalettes == 'gradient' && 'border-indigo-500 border-b-2'}`}>Gradient</button>}
                            </div>
                            {colorPalettes === "basic" ? (
                                <div className="mt-3">
                                    <HexColorPicker style={{ height: 150 }} color={newColor} onChange={setNewColor} />
                                    <div className="mt-2">
                                        <Button onClick={handleAddColor}>
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            ) : selectedElement?.type !== 'text' && (
                                <div>
                                    <GradientPicker
                                        gradientStart={gradientStart}
                                        gradientEnd={gradientEnd}
                                        setGradientStart={setGradientStart}
                                        setGradientEnd={setGradientEnd}
                                        gradientAngle={gradientAngle}
                                        setGradientAngle={setGradientAngle}
                                        handleAddGradient={handleAddGradient}
                                    />
                                </div>
                            )}

                        </div>
                    )}
                </div>

                {/* Daftar warna */}
                {colors.map((color, index) => (
                    colorPalettesRender({ color, index })
                ))}

                <div className="flex-col flex gap-4 mt-5">
                    <h2 className="font-semibold text-sm flex items-center gap-2"><span><IoColorPaletteOutline /></span> Basic Color</h2>
                    <div className="flex flex-wrap gap-2">
                        {colorData.map((color, index) => (
                            colorPalettesRender({ color: color.hex, index })
                        ))}
                    </div>
                </div>

                {selectedElement?.type !== 'text' && <div className="flex-col flex gap-4 mt-5">
                    <h2 className="font-semibold text-sm flex items-center gap-2"><span><IoColorPaletteOutline /></span> Gradient Color</h2>
                    <div className="flex flex-wrap gap-2">
                        {gradientColors.map((color, index) => (
                            colorPalettesRender({ color: color.gradient, index })
                        ))}
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default ColorPicker
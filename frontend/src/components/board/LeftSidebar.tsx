"use client";

import { useToolStore } from "@/store/toolStore";
import { FaPencilAlt, FaCircle, FaEraser, FaSquare, FaSlash } from "react-icons/fa";

export default function LeftSidebar() {
    const { tool, setTool, color, setColor, thickness, setThickness } = useToolStore();

    return (
        <aside className="w-64 bg-gray-100 shadow-inner p-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold mb-2">Tools</h2>

            <div className="flex flex-col gap-2">
                {/* <button
                    onClick={() => setTool("pencil")}
                    className={`flex items-center gap-2 px-3 py-2 rounded ${tool === "pencil" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                >
                    <FaPencilAlt /> Pencil
                </button> */}

                <button
                    onClick={() => setTool("circle")}
                    className={`flex items-center gap-2 px-3 py-2 rounded ${tool === "circle" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                >
                    <FaCircle /> Circle
                </button>

                <button
                    onClick={() => setTool("rectangle")}
                    className={`flex items-center gap-2 px-3 py-2 rounded ${tool === "rectangle" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                >
                    <FaSquare /> Rectangle
                </button>

                <button
                    onClick={() => setTool("line")}
                    className={`flex items-center gap-2 px-3 py-2 rounded ${tool === "line" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                >
                    <FaSlash /> Line
                </button>

                <button
                    onClick={() => setTool("eraser")}
                    className={`flex items-center gap-2 px-3 py-2 rounded ${tool === "eraser" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                >
                    <FaEraser /> Eraser
                </button>
            </div>

            <div className="flex flex-col gap-1 mt-4">
                <label className="font-medium text-sm">Color</label>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </div>

            <div className="flex flex-col gap-1 mt-2">
                <label className="font-medium text-sm">Thickness</label>
                <input
                    type="range"
                    min={1}
                    max={20}
                    value={thickness}
                    onChange={(e) => setThickness(parseInt(e.target.value))}
                />
            </div>
        </aside>
    );
}

import { create } from "zustand";
import { ToolState } from "./types";


export const useToolStore = create<ToolState>((set) => ({
    tool: "circle",
    color: "#000000",
    thickness: 2,
    setTool: (tool) => set({ tool }),
    setColor: (color) => set({ color }),
    setThickness: (thickness) => set({ thickness }),
}));

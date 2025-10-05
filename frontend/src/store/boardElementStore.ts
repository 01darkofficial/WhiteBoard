// store/boardElementsStore.ts
import { create } from "zustand";
import { getBoardElementsApi, addBoardElementApi, removeBoardElementApi } from "@/services/boardElementService";
import { BoardElementState, User, BoardElement } from "@/store/types";

export const useBoardElementsStore = create<BoardElementState>((set, get) => ({
    elements: [],

    // Fetch all elements for a specific board
    fetchElements: async (user: User, boardId: string) => {
        try {
            const result = await getBoardElementsApi(user, boardId);
            set({ elements: result.data || [] });
        } catch (err) {
            console.error("Failed to fetch board elements:", err);
        }
    },

    // Add a new element (stroke/shape) to the board
    addElement: async (user: User, type: string, elementData: Partial<BoardElement>, boardId: string) => {
        try {
            const result = await addBoardElementApi(user, type, elementData, boardId);
            if (result.data) {
                set({ elements: [...get().elements, result.data] });
            }
        } catch (err) {
            console.error("Failed to add board element:", err);
        }
    },

    // Remove an element by its ID
    removeElement: async (user: User, elementId: string, boardId: string) => {
        try {
            const result = await removeBoardElementApi(user, elementId, boardId);
            if (result.data) {
                set({ elements: get().elements.filter(el => el._id !== elementId) });
            }
        } catch (err) {
            console.error("Failed to remove board element:", err);
        }
    },
}));

import { create } from "zustand";
import {
    getBoardElementsApi,
    addBoardElementApi,
    eraseBoardElementPointsApi,
} from "@/services/boardElementService";
import { BoardElementState, User, BoardElement } from "@/store/types";
import { api } from "@/services/authService";

export const useBoardElementsStore = create<BoardElementState>((set, get) => ({
    elements: [],

    // Fetch all elements for a specific board
    fetchElements: async (user: User, boardId: string) => {
        const res = await getBoardElementsApi(user, boardId);
        if (res.success && res.data) {
            set({ elements: res.data });
        } else {
            console.error("Failed to fetch board elements:", res.error);
        }
    },

    // Add a new element (stroke/shape) to the board
    addElement: async (user: User, type: string, elementData: Partial<BoardElement>, boardId: string) => {
        const res = await addBoardElementApi(user, type, elementData, boardId);
        if (res.success && res.data) {
            set({ elements: [...get().elements, res.data] });
        } else {
            console.error("Failed to add board element:", res.error);
        }
    },

    // Remove an element by its ID
    removeElement: async (user: User, boardId: string, elementId: string) => {
        try {
            await api.delete(`/api/board/${boardId}/removeElement/${elementId}`, { data: { user } });
            set((state) => ({
                elements: state.elements.filter((el) => el._id !== elementId)
            }));
        } catch (err) {
            console.error("Failed to erase element:", err);
        }
    },

    // ⚡ Directly modify elements from socket (no backend call)
    addElementDirectly: (element: BoardElement) => set(state => ({ elements: [...state.elements, element] })),
    updateElementDirectly: (elementId: string, changes: Partial<BoardElement>) =>
        set(state => ({ elements: state.elements.map(el => el._id === elementId ? { ...el, ...changes } : el) })),
    removeElementDirectly: (elementId: string) =>
        set(state => ({ elements: state.elements.filter(el => el._id !== elementId) })),
}));

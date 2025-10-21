// store/boardElementsStore.ts
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
        try {
            const result = await getBoardElementsApi(user, boardId);
            set({ elements: result.data || [] });
        } catch (err) {
            console.error("Failed to fetch board elements:", err);
        }
    },

    // Add a new element (stroke/shape) to the board
    addElement: async (
        user: User,
        type: string,
        elementData: Partial<BoardElement>,
        boardId: string
    ) => {
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
    removeElement: async (user: User, boardId: string, elementId: string) => {
        try {
            // call backend to delete the element by ID
            await api.delete(`/api/board/${boardId}/removeElement/${elementId}`, { data: { user } });

            // remove from local state
            set((state) => ({
                elements: state.elements.filter((el) => el._id !== elementId)
            }));
        } catch (err) {
            console.error("Failed to erase element:", err);
        }
    },

    // ⚡ Add element directly from socket (no backend call)
    addElementDirectly: (element: BoardElement) => {
        set((state) => ({
            elements: [...state.elements, element],
        }));
    },

    // ⚡ Update element directly from socket
    updateElementDirectly: (elementId: string, changes: Partial<BoardElement>) => {
        set((state) => ({
            elements: state.elements.map((el) =>
                el._id === elementId ? { ...el, ...changes } : el
            ),
        }));
    },

    // ⚡ Remove element directly from socket
    removeElementDirectly: (elementId: string) => {
        set((state) => ({
            elements: state.elements.filter((el) => el._id !== elementId),
        }));
    },
}));

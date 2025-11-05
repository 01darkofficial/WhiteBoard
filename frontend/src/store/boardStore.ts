// store/boardStore.ts
import { create } from "zustand";
import { api } from "@/services/authService";
import { createBoardApi, getBoardApi, getBoardByIdApi } from "@/services/boardService";
import { BoardState, User } from "@/store/types";
import { Board } from "@/store/types";

export const useBoardStore = create<BoardState>((set, get) => ({
    boards: [],

    fetchBoards: async (user) => {
        const result = await getBoardApi(user);
        set({ boards: result.data || [] });
    },

    addBoard: async (user: User, name: string) => {
        const res = await createBoardApi(user, name);
        if (res.data) {
            set({ boards: [...get().boards, res.data] });
        } else {
            throw new Error("Failed to create board");
        }
    },

    deleteBoard: async (boardId: string) => {
        try {
            await api.delete(`/api/boards/${boardId}`);
            set({ boards: get().boards.filter(b => b._id !== boardId) });
        } catch (err) {
            console.error("Failed to delete board:", err);
        }
    },

    getBoardById: async (boardId: string) => {
        try {
            const res = await getBoardByIdApi(boardId);
            if (res.data) {
                const existingBoards = get().boards;
                const boardExists = existingBoards.some(b => b._id === boardId);

                if (boardExists) {
                    // ✅ Safely update existing board
                    const updatedBoards = existingBoards.map(b =>
                        b._id === boardId ? res.data : b
                    ) as Board[];

                    set({ boards: updatedBoards });
                } else {
                    // ✅ Add new board safely
                    set({ boards: [...existingBoards, res.data] });
                }
                return res.data
            }
            return null;
        } catch (err) {
            console.error("Failed to fetch board:", err);
            return null;
        }
    },

}));

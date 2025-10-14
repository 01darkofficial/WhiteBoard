// store/boardStore.ts
import { create } from "zustand";
import { api } from "@/services/authService";
import { createBoardApi, getBoardApi } from "@/services/boardService";
import { BoardState, User } from "@/store/types";

export const useBoardStore = create<BoardState>((set, get) => ({
    boards: [],

    fetchBoards: async (user) => {
        const result = await getBoardApi(user);
        // console.log(result);
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
}));

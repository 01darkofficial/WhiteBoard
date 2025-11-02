import { create } from "zustand";
import { ChatStore } from "./types";
import { getBoardChatApi, updateBoardChatApi } from "@/services/boardChatService";

export const useChatStore = create<ChatStore>((set, get) => ({
    messages: [],

    // Fetch messages from server
    fetchMessages: async (boardId: string) => {
        const result = await getBoardChatApi(boardId);
        // console.log(result);
        if (result.success) {
            set({ messages: result.data });
        }
    },

    // Add a message locally and to the server
    addMessage: async (boardId: string, username: string, msg: string) => {
        const result = await updateBoardChatApi(boardId, username, msg);
        if (result.success) {
            set({ messages: result.data }); // replace messages with updated array from server
        }
        // return result;
    },

    removeMessage: (id: string) =>
        set((state) => ({ messages: state.messages.filter((m) => m._id !== id) })),

    clearMessages: () => set({ messages: [] }),
}));

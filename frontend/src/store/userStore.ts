import { create } from "zustand";
import { api } from "@/services/authService";
import { User, UserStore } from "./types";

export const useUserStore = create<UserStore>((set, get) => ({
    user: null,
    loading: false,

    fetchUser: async () => {
        if (get().user) return; // already fetched
        try {
            set({ loading: true });
            const response = await api.get("/api/auth/user");
            set({ user: response.data });
            console.log("User fetched:", response.data);
        } catch (err) {
            console.error("Failed to fetch user:", err);
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },

    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));

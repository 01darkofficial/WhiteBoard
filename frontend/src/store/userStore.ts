import { create } from "zustand";
import { api } from "@/services/authService";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, UserStore } from "./types";

export const useUserStore = create<UserStore>()(persist((set, get) => ({
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
}),
    {
        name: "user-store", // key in localStorage
        storage: createJSONStorage<{ user: User | null }>(() => localStorage), // (optional) default is localStorage anyway
        partialize: (state) => ({ user: state.user }), // only persist "user", not "loading"
    }
));

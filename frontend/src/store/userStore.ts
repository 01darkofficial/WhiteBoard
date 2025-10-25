import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { deleteUserApi, getUserApi, logoutApi, updateUserApi } from "@/services/authService";
import { User, UserStore } from "./types";

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            user: null,
            loading: false,

            fetchUser: async () => {
                if (get().user) return; // already fetched
                set({ loading: true });

                const response = await getUserApi();
                if (response.success) {
                    set({ user: response.data });
                    console.log("User fetched:", response.data);
                } else {
                    console.error("Failed to fetch user:", response.error);
                    set({ user: null });
                }

                set({ loading: false });
            },

            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),

            logoutUser: async () => {
                const res = await logoutApi();
                if (res.success) set({ user: null });
                else console.error("Logout failed:", res.error);
            },

            updateUser: async (data: { name?: string; password?: string; avatar?: string }) => {
                const res = await updateUserApi(data);
                if (res.success) set({ user: res.data });
                else console.error("Update user failed:", res.error);
            },

            deleteUser: async () => {
                const res = await deleteUserApi();
                if (res.success) {
                    set({ user: null });
                    return { success: true };
                } else {
                    console.error("Delete user failed:", res.error);
                    return { success: false, error: res.error || "Failed to delete account" };
                }
            },
        }),
        {
            name: "user-store",
            storage: createJSONStorage<{ user: User | null }>(() => localStorage),
            partialize: (state) => ({ user: state.user }), // only persist user
        }
    )
);

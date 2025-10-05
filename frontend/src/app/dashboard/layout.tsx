// /layouts/DashboardLayout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import { useUserStore } from "@/store/userStore";
import { useBoardStore } from "@/store/boardStore";
import { getSocket } from "@/utils/scoket";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const fetchUser = useUserStore(state => state.fetchUser);
    const user = useUserStore(state => state.user);
    const loading = useUserStore(state => state.loading);
    const fetchBoards = useBoardStore((state) => state.fetchBoards);
    const clearUser = useUserStore(state => state.clearUser);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (user) {
            fetchBoards(user);
        }
    }, [user]);

    // useEffect(() => {
    //     const socket = getSocket();
    //     socket.connect();

    //     socket.on("connect", () => console.log("Connected to socket:", socket.id));

    //     return () => {
    //         socket.disconnect();
    //     };
    // }, []);


    const handleLogout = () => clearUser();

    if (loading) return <p className="p-6 text-center">Loading user...</p>;

    return (
        <div className="min-h-screen flex flex-col">
            <Header user={user} onLogout={handleLogout} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}

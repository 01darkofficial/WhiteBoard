// /components/dashboard/Header.tsx
"use client";

import { FaCog, FaSignOutAlt } from "react-icons/fa";

interface HeaderProps {
    user: { name: string; avatar: string } | null;
    onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
    return (
        <header className="flex justify-between items-center p-4 bg-emerald-100 shadow-md">
            <div className="text-2xl font-bold text-emerald-700 cursor-pointer">
                CollabBoard
            </div>
            <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-emerald-200 transition">
                    <FaCog size={18} className="text-emerald-700" />
                </button>
                <div className="flex items-center space-x-2">
                    <img
                        src={user?.avatar}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full border border-emerald-300"
                    />
                    <span className="font-medium text-emerald-900">{user?.name}</span>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center space-x-1 px-3 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
}

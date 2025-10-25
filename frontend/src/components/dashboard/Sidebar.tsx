"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";


interface SidebarProps {
    menuItems?: { name: string; path: string }[];
}

export default function Sidebar({
    menuItems = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Profile", path: "/dashboard/profile" },
        { name: "Settings", path: "/dashboard/settings" },
    ],
}: SidebarProps) {
    const pathname = usePathname();
    const logoutUser = useUserStore((state) => state.logoutUser);
    const router = useRouter();

    const handleLogout = () => {
        logoutUser()
        router.push('/');
    };

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-emerald-200 p-4 space-y-4">
            <nav className="space-y-2 flex-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`
                                block px-4 py-2 rounded transition font-medium
                                ${isActive ? "bg-emerald-300 text-gray-900" : "text-gray-700 hover:bg-emerald-100"}
                            `}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout at bottom */}
            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition font-semibold"
            >
                <FaSignOutAlt className="mr-2" />
                Logout
            </button>
        </aside>
    );
}

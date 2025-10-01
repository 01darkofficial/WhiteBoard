// /components/dashboard/Sidebar.tsx
"use client";

interface SidebarProps {
    menuItems?: string[];
}

export default function Sidebar({ menuItems = ["Dashboard", "Boards", "Profile", "Settings"] }: SidebarProps) {
    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-emerald-200 p-4 space-y-4">
            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item}
                        className="w-full text-left px-4 py-2 rounded hover:bg-emerald-100 transition text-gray-700 font-medium"
                    >
                        {item}
                    </button>
                ))}
            </nav>
        </aside>
    );
}

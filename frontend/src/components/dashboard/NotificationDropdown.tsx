"use client";

import { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { Notification } from "@/store/types";
import { useUserStore } from "@/store/userStore";

interface NotificationDropdownProps {
    notifications: Notification[];
    loading: Boolean,
    onMarkRead: (id: string) => void;
    onMarkAllRead: () => void;
    onRefresh: () => void;
    onRespondToInvite: (notficationId: string, response: "accept" | "decline", userEmail: string) => void;
}

export default function NotificationDropdown({
    notifications,
    loading,
    onMarkRead,
    onMarkAllRead,
    onRefresh,
    onRespondToInvite,
}: NotificationDropdownProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user } = useUserStore();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const unreadCount = notifications.filter((n) => !n.read).length;

    // if (loading) {
    //     return (
    //         <div className="p-4 text-center text-gray-500 text-sm">
    //             Loading notifications...
    //         </div>
    //     );
    // }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* 🔔 Notification Icon */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="relative p-2 rounded-full hover:bg-emerald-200 transition"
            >
                <FaBell size={18} className="text-emerald-700" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* 📩 Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-emerald-200 overflow-hidden z-50">
                    <div className="flex justify-between items-center p-2 border-b border-emerald-100 bg-emerald-50">
                        <span className="text-sm font-semibold text-emerald-700">
                            Notifications
                        </span>
                        <div className="flex space-x-2">
                            <button
                                onClick={onMarkAllRead}
                                className="text-xs text-emerald-600 hover:underline"
                            >
                                Mark all read
                            </button>
                            <button
                                onClick={onRefresh}
                                className="text-xs text-emerald-600 hover:underline"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-3 border-b border-emerald-100 cursor-pointer hover:bg-emerald-50 ${notif.read ? "opacity-70" : "bg-emerald-50"
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold text-emerald-800 text-sm">
                                                {notif.title}
                                            </div>
                                            <div className="text-sm text-gray-600">{notif.message}</div>
                                        </div>

                                        {/* Actions depending on type */}
                                        {notif.type === "invite" && (
                                            <div className="flex flex-col gap-1 ml-2">
                                                <button
                                                    onClick={() => onRespondToInvite(notif.id, "accept", user!.email)}
                                                    className="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => onRespondToInvite(notif.id, "decline", user!.email)}
                                                    className="px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* For other types, just mark read on click */}
                                    {notif.type !== "invite" && !notif.read && (
                                        <button
                                            onClick={() => onMarkRead(notif.id)}
                                            className="mt-2 text-xs text-emerald-600 hover:underline"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

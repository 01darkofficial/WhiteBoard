"use client";

import { FaUserCircle } from "react-icons/fa";
import NotificationDropdown from "./NotificationDropdown";
import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";

interface HeaderProps {
    user: { name: string; avatar: string } | null;
}

export default function Header({ user }: HeaderProps) {
    const {
        notifications,
        loading,
        fetchNotifications,
        respondToNotification,
        markRead,
        markAllRead,
    } = useNotificationStore();

    useEffect(() => {
        fetchNotifications(false);
    }, [fetchNotifications]);

    return (
        <header className="flex justify-between items-center p-4 bg-emerald-100 shadow-md">
            <div className="text-2xl font-bold text-emerald-700 cursor-pointer">
                CollabBoard
            </div>

            <div className="flex items-center space-x-4">
                {/* Notification Dropdown */}
                <NotificationDropdown
                    notifications={notifications}
                    loading={loading}
                    onMarkRead={markRead}
                    onMarkAllRead={markAllRead}
                    onRespondToInvite={respondToNotification}
                    onRefresh={() => fetchNotifications(false)}
                />

                {/* User Avatar Only */}
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full border border-emerald-300"
                    />
                ) : (
                    <FaUserCircle className="w-10 h-10 text-emerald-500" />
                )}


            </div>
        </header>
    );
}

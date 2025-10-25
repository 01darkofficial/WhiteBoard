"use client";

import StatCard from "@/components/dashboard/StatCard";
import { useUserStore } from "@/store/userStore";
import { FaUserCircle } from "react-icons/fa";
export default function ProfilePage() {
    const user = useUserStore((state) => state.user);

    if (!user) return <p className="p-6 text-center">Loading user...</p>;

    const createdDate = new Date(user.createdAt).toLocaleDateString();
    const updatedDate = new Date(user.updatedAt).toLocaleDateString();

    const recentActivity = user.recentActivity || [];


    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start bg-white shadow rounded p-6 space-y-4 sm:space-y-0 sm:space-x-6">
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-24 h-24 rounded-full object-cover shadow"
                    />
                ) : (
                    <FaUserCircle className="w-24 h-24 text-emerald-500" />
                )}
                <div className="flex-1 space-y-2">
                    <h1 className="text-2xl font-semibold text-gray-800">{user.name}</h1>
                    <p className="text-gray-500">{user.email}</p>
                    <div className="text-gray-600 space-y-1">
                        <p><strong>Created:</strong> {createdDate}</p>
                        <p><strong>Last Updated:</strong> {updatedDate}</p>
                    </div>
                </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Boards Created" value={user.boardsCreated} />
                <StatCard title="Joined Boards" value={user.joinedBoards} />
                <StatCard title="Active Boards" value={user.activeBoards} />
            </div>

            {/* Optional: Recent Activity / Bio */}
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                {recentActivity.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {user.recentActivity.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No recent activity yet.</p>
                )}
            </div>
        </div>
    );
}

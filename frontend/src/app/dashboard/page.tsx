"use client";

import StatCard from "@/components/dashboard/StatCard";
import BoardCard from "@/components/dashboard/BoardCard";
import AddBoardForm from "@/components/dashboard/BoardForm";
import { useBoardStore } from "@/store/boardStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardPage() {
    const router = useRouter();
    const boards = useBoardStore((state) => state.boards);
    const [showForm, setShowForm] = useState(false);


    const handleCreateBoardClick = () => setShowForm(true);
    const handleJoinBoard = (id: string) => router.push(`/board/${id}`);

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Boards Created" value={boards.length} />
                <StatCard title="Active Users" value={boards.reduce((acc, b) => acc + b.members.length, 0)} />
                <StatCard title="Recent Activity" value={`${boards.length} Boards`} />
            </div>

            {/* Boards header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Your Boards</h2>
                <button
                    onClick={handleCreateBoardClick}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition font-semibold shadow"
                >
                    + Create New Board
                </button>
            </div>

            {/* Add Board Form */}
            {showForm && <AddBoardForm onClose={() => setShowForm(false)} />}

            {/* Boards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {boards.map((board) => (
                    <BoardCard
                        key={board._id}
                        id={board._id}
                        name={board.name}
                        createdAt={new Date(board.createdAt).toLocaleDateString()}
                        membersCount={board.members.length}
                        onClick={handleJoinBoard}
                    />
                ))}
            </div>
        </div>
    );
}

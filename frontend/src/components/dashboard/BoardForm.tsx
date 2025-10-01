"use client";
import { useState } from "react";
import { useBoardStore } from "@/store/boardStore";
import { useUserStore } from "@/store/userStore";

interface BoardFormProps {
    onClose: () => void;
}

export default function BoardForm({ onClose }: BoardFormProps) {
    const [name, setName] = useState("");
    const addBoard = useBoardStore((state) => state.addBoard);
    const user = useUserStore((state) => state.user);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            addBoard(user, name);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2 p-4 bg-white rounded shadow-md w-64">
            <input
                type="text"
                placeholder="Board Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
            />
            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                >
                    Add
                </button>
            </div>
        </form>
    );
}

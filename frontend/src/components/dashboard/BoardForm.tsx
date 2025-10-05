"use client";

import { useState } from "react";
import { useBoardStore } from "@/store/boardStore";
import { useUserStore } from "@/store/userStore";
import { z } from "zod";

// Zod schema
const boardSchema = z.object({
    name: z.string().min(3, "Board name must be at least 3 characters"),
});

interface BoardFormProps {
    onClose: () => void;
}

export default function BoardForm({ onClose }: BoardFormProps) {
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const addBoard = useBoardStore((state) => state.addBoard);
    const user = useUserStore((state) => state.user);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            boardSchema.parse({ name });
            setError(null);

            if (user) {
                await addBoard(user, name);
                onClose();
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.issues[0].message);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 h-full flex items-center justify-center">
            {/* Overlay - keeps background visible */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal form */}
            <form
                onSubmit={handleSubmit}
                className="relative bg-white/95 p-6 rounded-2xl shadow-2xl w-96 flex flex-col space-y-4"
            >
                <h2 className="text-xl font-semibold text-gray-800 text-center">
                    Create New Board
                </h2>

                <input
                    type="text"
                    placeholder="Board Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    );
}

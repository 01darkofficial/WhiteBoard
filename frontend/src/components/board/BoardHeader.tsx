"use client"

interface BoardHeaderProps {
    boardName: string;
    onInvite: () => void;
    onDelete: () => void;
}

export default function BoardHeader({ boardName, onInvite, onDelete }: BoardHeaderProps) {
    return (
        <header className="flex justify-between items-center px-6 py-4 bg-emerald-100 shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">{boardName}</h1>
            <div className="flex space-x-3">
                <button
                    onClick={onInvite}
                    className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
                >
                    Invite User
                </button>
                <button
                    onClick={onDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Delete Board
                </button>
            </div>
        </header>
    );
}

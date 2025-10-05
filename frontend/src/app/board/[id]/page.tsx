"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BoardHeader from "@/components/board/BoardHeader";
import LeftSidebar from "@/components/board/LeftSidebar";
import RightSidebar from "@/components/board/RightSidebar";
import Canvas from "@/components/board/Canvas";
import { useBoardStore } from "@/store/boardStore";

export default function BoardPage() {
    const params = useParams();
    const boardId = Array.isArray(params.id) ? params.id[0] : params.id;
    console.log("boardId: ", boardId);
    const boards = useBoardStore((state) => state.boards);
    const [board, setBoard] = useState(() => boards.find(b => b._id === boardId));
    const [members, setMembers] = useState(board?.members || []);

    useEffect(() => {
        if (!board) {
            // Fetch board if not in store
            const found = boards.find(b => b._id === boardId);
            if (found) {
                setBoard(found);
                setMembers(found.members);
            }
            // else: fetch from API
        }
    }, [boardId, boards, board]);

    const handleInvite = () => alert("Invite User Modal (Coming Soon)");
    const handleDelete = () => alert("Delete Board Confirmation (Coming Soon)");

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <BoardHeader
                boardName={board?.name || "Loading..."}
                onInvite={handleInvite}
                onDelete={handleDelete}
            />
            <div className="flex flex-1 overflow-hidden">
                <LeftSidebar />
                <Canvas boardId={boardId || ""} />
                <RightSidebar members={members} />
            </div>
        </div>
    );
}

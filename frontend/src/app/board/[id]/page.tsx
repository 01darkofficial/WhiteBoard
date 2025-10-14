"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BoardHeader from "@/components/board/BoardHeader";
import LeftSidebar from "@/components/board/LeftSidebar";
import RightSidebar from "@/components/board/RightSidebar";
import Canvas from "@/components/board/Canvas";
import InviteModal from "@/components/board/InviteModal";
import { useUserStore } from "@/store/userStore";
import { useBoardStore } from "@/store/boardStore";

export default function BoardPage() {
    const params = useParams();
    const boardId = Array.isArray(params.id) ? params.id[0] : params.id;
    const user = useUserStore((state) => state.user);
    const boards = useBoardStore((state) => state.boards);

    const [board, setBoard] = useState(() => boards.find(b => b._id === boardId));
    const [members, setMembers] = useState(board?.members || []);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    useEffect(() => {
        if (!board) {
            const found = boards.find(b => b._id === boardId);
            if (found) {
                setBoard(found);
                setMembers(found.members);
            }
        }
    }, [boardId, boards, board]);

    const handleInvite = () => setIsInviteModalOpen(true);
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

            {/* Invite Modal */}
            <InviteModal
                boardId={boardId || ""}
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />
        </div>
    );
}

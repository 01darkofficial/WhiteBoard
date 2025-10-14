import { useEffect } from "react";
import { socket, connectSocket, disconnectSocket } from "@/lib/scoket";

interface BoardSocketOptions {
    onElementAdded?: (data: any) => void;
    onElementUpdated?: (data: any) => void;
    onElementDeleted?: (data: any) => void;
    onCursorMoved?: (data: any) => void;
    onUserTyping?: (data: any) => void;
    onError?: (err: any) => void;
}

export function useBoardSocket(boardId: string, options: BoardSocketOptions = {}) {
    useEffect(() => {
        if (!boardId) return;
        console.log("hello");
        const s = connectSocket();

        s.emit("join-board", boardId, (ack: any) => {
            if (ack?.success) console.log(`✅ Joined board ${boardId}`);
            else console.warn(`❌ Failed to join board ${boardId}:`, ack?.message);
        });

        // Listeners
        s.on("element:added", options.onElementAdded || (() => { }));
        s.on("element:updated", options.onElementUpdated || (() => { }));
        s.on("element:deleted", options.onElementDeleted || (() => { }));
        s.on("cursor:moved", options.onCursorMoved || (() => { }));
        s.on("user:typing", options.onUserTyping || (() => { }));
        s.on("error", options.onError || ((err: any) => console.error("Socket error:", err)));

        return () => {
            s.emit("leave-board", boardId);
            s.off("element:added");
            s.off("element:updated");
            s.off("element:deleted");
            s.off("cursor:moved");
            s.off("user:typing");
            s.off("error");
            disconnectSocket();
        };
    }, [boardId]);
}

// Utility emitters
export const emitAddElement = (boardId: string, element: any) =>
    socket?.emit("element:add", { boardId, element });

export const emitUpdateElement = (boardId: string, elementId: string, changes: any) =>
    socket?.emit("element:update", { boardId, elementId, changes });

export const emitDeleteElement = (boardId: string, elementId: string) =>
    socket?.emit("element:delete", { boardId, elementId });

export const emitCursorMove = (boardId: string, userId: string, position: { x: number; y: number }) =>
    socket?.emit("cursor:move", { boardId, userId, position });

export const emitUserTyping = (boardId: string, userId: string) =>
    socket?.emit("user:typing", { boardId, userId });

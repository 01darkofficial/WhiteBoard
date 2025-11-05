import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface BoardSocketOptions {
    onElementAdded?: (data: any) => void;
    onElementUpdated?: (data: any) => void;
    onElementDeleted?: (data: any) => void;
    onMembersUpdated?: (data: any) => void;
    onChatsUpdated?: (data: any) => void;
    onCursorMoved?: (data: any) => void;
    onUserTyping?: (data: any) => void;
    onError?: (err: any) => void;
}

export function useBoardSocket(boardId: string, options: BoardSocketOptions = {}): Socket | null {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!boardId) return;

        // Create a new socket instance for this board
        const s = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"); // replace with your backend URL
        setSocket(s);

        // Join board once connected
        s.on("connect", () => {
            s.emit("join-board", boardId, (ack: any) => {
                if (ack?.success) console.log(`✅ Joined board ${boardId}`);
                else console.warn(`❌ Failed to join board ${boardId}:`, ack?.message);
            });
        });

        // Listeners
        s.on("element:added", options.onElementAdded || (() => { }));
        s.on("element:updated", options.onElementUpdated || (() => { }));
        s.on("element:deleted", options.onElementDeleted || (() => { }));

        s.on("members:updated", options.onMembersUpdated || (() => { }));

        s.on("chats:updated", (data) => {
            console.log("📩 Chat update:", data);
            (options.onChatsUpdated || (() => { }))(data);
        });

        s.on("cursor:moved", options.onCursorMoved || (() => { }));

        s.on("user:typing", options.onUserTyping || (() => { }));

        s.on("error", options.onError || ((err) => console.error("Socket error:", err)));

        return () => {
            if (s.connected) {
                s.emit("leave-board", boardId);
                s.disconnect();
            }
        };
    }, [boardId]);

    return socket;
}

// Utility emitters accepting a specific socket
export const emitAddElement = (socket: Socket | null, boardId: string, element: any) =>
    socket?.emit("element:add", { boardId, element });

export const emitUpdateElement = (socket: Socket | null, boardId: string, elementId: string, changes: any) =>
    socket?.emit("element:update", { boardId, elementId, changes });

export const emitDeleteElement = (socket: Socket | null, boardId: string, elementId: string) =>
    socket?.emit("element:delete", { boardId, elementId });

export const emitUpdateMembers = (socket: Socket | null, boardId: string, memberId: string, changes: any) =>
    socket?.emit("members:update", { boardId, memberId, changes });

export const emitUpdateChats = (socket: Socket | null, boardId: string, changes: any) =>
    socket?.emit("chats:update", { boardId, changes });

export const emitCursorMove = (socket: Socket | null, boardId: string, userId: string, position: { x: number; y: number }) =>
    socket?.emit("cursor:move", { boardId, userId, position });

export const emitUserTyping = (socket: Socket | null, boardId: string, userId: string) =>
    socket?.emit("user:typing", { boardId, userId });

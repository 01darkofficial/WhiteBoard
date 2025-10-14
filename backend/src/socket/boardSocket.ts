import { Server, Socket } from "socket.io";

export default function boardSocket(io: Server, socket: Socket) {
    // Join a board
    socket.on("join-board", (boardId: string, callback?: (ack: { success: boolean; message?: string }) => void) => {
        if (!boardId) {
            callback?.({ success: false, message: "Invalid board ID" });
            return;
        }
        socket.join(boardId);
        console.log(`✅ User ${socket.id} joined board ${boardId}`);
        callback?.({ success: true, message: "Joined successfully" });
    });

    // Leave board
    socket.on("leave-board", (boardId: string, callback?: (ack: { success: boolean; message?: string }) => void) => {
        if (!boardId) {
            callback?.({ success: false, message: "Invalid board ID" });
            return;
        }
        socket.leave(boardId);
        console.log(`👋 User ${socket.id} left board ${boardId}`);
        callback?.({ success: true, message: "Left successfully" });
    });

    // Add, update, delete, cursor, typing handlers — all correct ✅
    socket.on("element:add", ({ boardId, element }) => {
        if (!boardId) return socket.emit("error", { message: "Missing boardId" });
        socket.to(boardId).emit("element:added", { element });
    });

    socket.on("element:update", ({ boardId, elementId, changes }) => {
        if (!boardId) return socket.emit("error", { message: "Missing boardId" });
        socket.to(boardId).emit("element:updated", { elementId, changes });
    });

    socket.on("element:delete", ({ boardId, elementId }) => {
        if (!boardId) return socket.emit("error", { message: "Missing boardId" });
        socket.to(boardId).emit("element:deleted", { elementId });
    });

    socket.on("cursor:move", ({ boardId, userId, position }) => {
        if (!boardId) return;
        socket.to(boardId).emit("cursor:moved", { userId, position });
    });

    socket.on("user:typing", ({ boardId, userId }) => {
        if (!boardId) return;
        socket.to(boardId).emit("user:typing", { userId });
    });
}

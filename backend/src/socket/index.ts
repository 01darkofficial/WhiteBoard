import { Server, Socket } from "socket.io";
import boardSocket from "./boardSocket";

export const initSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log(`🔌 User connected: ${socket.id}`);

        // attach board events
        boardSocket(io, socket);

        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });
};

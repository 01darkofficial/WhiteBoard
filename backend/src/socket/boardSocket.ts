import { Server, Socket } from "socket.io";

export default function boardSocket(io: Server, socket: Socket) {
    socket.on("join-board", (boardId: string) => {
        socket.join(boardId);
        console.log(`User ${socket.id} joined board ${boardId}`);
    });

    socket.on("element:add", async (payload) => {
        try {
            // TODO: validate payload before saving
            const { boardId } = payload;

            // Save to DB (call controller)
            // const element = await BoardElement.create(payload);

            // Broadcast to everyone else in the board
            io.to(boardId).emit("element:added", payload);
        } catch (err) {
            socket.emit("error", { message: "Failed to add element" });
        }
    });
}

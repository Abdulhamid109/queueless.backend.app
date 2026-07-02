let io;


export const intializeSocketConnection = (socketio) => {
    io = socketio;
    io.on('connection', (socket) => {
        console.log("Connection established from backend");
        socket.on("JoinBusiness", (bid) => {
            socket.join(bid);
            console.log(`user ${socket.id} joined ${bid}`);
            console.log("Rooms for this socket:", socket.rooms);
            console.log("Emitting to room:", bid, "clients in room:", io.sockets.adapter.rooms.get(bid));
            for (const room of socket.rooms) {
                if (room !== socket.id) socket.leave(room);
            }
        })
    })
}

export const getIO = () => {
    if (!io) {
        throw new Error("Socket io not initialized!");
    }

    return io;
}
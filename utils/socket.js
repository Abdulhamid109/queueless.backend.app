let io;


export const intializeSocketConnection = (socketio)=>{
    io = socketio;
    io.on('connection',(socket)=>{
        console.log("Connection established");
    })
}

export const getIO = () =>{
    if(!io){
        throw new Error("Socket io not initialized!");
    }

    return io;
}
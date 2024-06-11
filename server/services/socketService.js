const { Server } = require('socket.io')

let emailToSocketIdMap = new Map()
let socketIdToEmailMap = new Map()

module.exports = class SocketService {
    constructor () {
        if(!this.io)
        {
            this._io = new Server(8000, {
                cors : true
            } )
        }
    }

    get io() {
        return this._io
    }

    initializeSocketServer() {
        console.log("Socket Server is initialized")
        const io = this.io

        io.on('connection' , (socket) => {
            console.log("socket connection successful", socket.id)

            socket.on("room:join", ({room, email}) => {

                socketIdToEmailMap.set(socket.id, email)
                emailToSocketIdMap.set(email, socket.id)
                io.to(room).emit("user:joined", {email, id: socket.id})
                socket.join(room)
                io.to(socket.id).emit('room:join', {email, id: socket.id, room})
            })

            socket.on("user:call", ({to, offer}) => {
                io.to(to).emit("call:incoming", { from:socket.id , offer})
            })

            socket.on("call:accepted", ({to, ans})=>{
                io.to(to).emit("call:accepted", {from: socket.id, ans})
            })

            socket.on("peer:nego:need", ({to, offer})=>{
               
                io.to(to).emit("peer:nego:need", {from: socket.id, offer})
            })

            socket.on("peer:nego:done", ({to, ans})=>{
                console.log("peer:nego:done" , ans)
                io.to(to).emit("peer:nego:done", {from: socket.id, ans})
            })


        })

        
    }
}
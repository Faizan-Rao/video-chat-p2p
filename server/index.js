const {  createServer } = require('http')
const SocketService = require('./services/socketService')

async function run () {
    const server = createServer()
    
    let socketService = new SocketService()

    server.listen(8001, () => {
        console.log( " Server is running on port ", 8001)
        socketService.initializeSocketServer()
    })


}


run()
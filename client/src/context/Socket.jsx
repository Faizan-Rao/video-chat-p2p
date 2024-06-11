
import React, {createContext , useContext, useEffect, useMemo} from "react";
import * as io from 'socket.io-client'

const SocketContext = createContext(null)

export const getSocket = () => {
    const state = useContext(SocketContext)
    return state
}

let socketConnection = io.connect('http://localhost:8000')

const SocketProvider = ({children}) => {
    let socket = useMemo(() => socketConnection, [])
  return (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
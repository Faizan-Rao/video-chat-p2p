
import React , {useState, useCallback, useEffect} from "react";

import { getSocket } from "./context/Socket";
import { useNavigate } from "react-router-dom";

export default function App() {

  const[ email, setEmail] = useState("")
  const [room, setRoom] = useState("")
  const socket = getSocket()
  const navigate = useNavigate()

  const handleSubmitForm = useCallback( (e) => {
      e.preventDefault()
      
      
     socket.emit("room:join", {email, room})
  }, [email, room, socket])

  const handleJoinRoom = useCallback( (data) => {
    const { room } = data
    navigate(`${room}`)
  }, [navigate])

  useEffect(() => {
     socket.on('room:join', handleJoinRoom)

     return ()=>{
      socket.off('room:join', handleJoinRoom)

     }
  }, [handleJoinRoom, socket])

  return (
   
      <>
        <div className={`flex justify-center items-center flex-col gap-4 h-screen`}>
            <h1 className="text-3xl font-semibold">Welcome WebRTC</h1>
            <h4 className="text-2xl">Login</h4>

            
                <input className={`text-lg border-2 p-1 rounded-md`} onChange={(e)=>setEmail(e.target.value)} type="email" name="email" id="email" placeholder="Enter Email"/>

                <input className={`text-lg border-2 p-1 rounded-md`} onChange={(e)=>setRoom(e.target.value)} type="text" name="room" id="room" placeholder="Enter Room Id" />

                <button onClick={handleSubmitForm} className=" px-4 py-1 rounded-md bg-emerald-500 hover:bg-emerald-700 text-white">Login</button>
        </div>
      </>
  );
}

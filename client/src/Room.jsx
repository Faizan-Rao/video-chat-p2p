import React, {useCallback, useState, useEffect} from 'react'
import { getSocket } from './context/Socket'
import ReactPlayer from 'react-player'
import peer from './services/peer'

const Room = () => {
    const socket = getSocket()
    const [myStream, setMyStream] = useState(null)
    const [remoteSocId, setRemoteSocId] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)

    const handleUserJoined = useCallback((data) => {
        console.log(`Email ${data.email} is Joined`)
        setRemoteSocId(data.id)
    }, [])

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
        const offer = await peer.getOffer()
        socket.emit("user:call", {to: remoteSocId, offer})
        setMyStream(stream)
    }, [remoteSocId, socket])
    
    const handleCallIncoming = useCallback(async ({from , offer}) => {
        
        setRemoteSocId(from)
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
        setMyStream(stream)
        const ans = await peer.getAnswer(offer)
        socket.emit("call:accepted", {to: from, ans})
    }, [socket])


    const sendStream = useCallback (() => {
            console.log("Send Stream")
        for( const track of myStream.getTracks())
        {
            peer.peer.addTrack(track, myStream)
        }
    }, [myStream])

    const handleNegoNeeded = useCallback(async ()=>{
       const offer = await peer.getOffer()
       console.log("negonNEed", offer)
       socket.emit('peer:nego:need', {to: remoteSocId, offer})
       
    }, [remoteSocId, socket])

    useEffect(()=>{
        peer.peer.addEventListener('negotiationneeded', handleNegoNeeded)
        return () =>{
            peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded)
        }
    }, [handleNegoNeeded])

    const getTracks = useCallback(async ev => {
        console.log("Got Tracks")
        const remoteStreams = ev.streams;
        setRemoteStream(remoteStreams[0])
    }, [])

    useEffect(()=> {
        peer.peer.addEventListener("track", getTracks )
        
       
    }, [getTracks])

    const handleNegoIncoming = useCallback(async ({
        from, offer
    }) => {
        if(offer)
        {
            console.log("NegoNeedIncome", offer)
            const ans = await peer.getAnswer(offer)
           
            socket.emit('peer:nego:done' , {to: from , ans})
        }
    }, [socket])

    const handleNegoDone = useCallback(async ({
        from, ans
    }) => {
        if(!ans) console.log("Handle nego done :", ans)
       
        console.log("negoDone",ans)
        await peer.setLocalDescription(ans)
      
        
    }, [])

    const handleCallAccepted = useCallback(async ({
        from, ans
    }) => {
        await peer.setLocalDescription(ans)
        console.log(ans)
    }, [])

    useEffect(()=>{
        socket.on("user:joined", handleUserJoined)
        socket.on("call:incoming", handleCallIncoming)
        socket.on("call:accepted", handleCallAccepted)
        socket.on("peer:nego:need", handleNegoIncoming )
        socket.on("peer:nego:done", handleNegoDone )
        return () => {
            socket.off("user:joined", handleUserJoined)
            socket.off("call:incoming", handleCallIncoming)
            socket.off("call:accepted", handleCallAccepted)
            socket.off("peer:nego:need", handleNegoIncoming )
            socket.off("peer:nego:done", handleNegoDone)
        }
    },[handleCallAccepted, handleCallIncoming, handleNegoDone, handleNegoIncoming, handleUserJoined, socket])

   
   
    return (
        <div>
            <h1>Room</h1>
        {remoteSocId ? "Connected" : "No one in room"}
        { remoteSocId && <button onClick={handleCallUser}>Call</button>}
        { myStream && <button onClick={sendStream}>Send Stream</button>}
        {
            myStream && <>
                <h1>My Stream</h1>
                <ReactPlayer playing muted height={300} width={300} url={myStream} />
            </>
        }
       
         {
            remoteStream && <>
                <h1>Remote Stream</h1>
                <ReactPlayer playing muted height={300} width={300} url={remoteStream} />
            </>
        }
        </div>
    )
}

export default Room
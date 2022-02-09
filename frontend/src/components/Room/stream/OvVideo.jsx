// import { useRef } from "react";
import {useState, useEffect,useRef} from "react";

function OvVideo({user, mutedSound}) {
    const videoRef = useRef();
    useEffect(()=>{
        console.log("들어왔느냐");
        if(user.streamManager && !!videoRef){
            user.getStreamManager().addVideoElement(videoRef.current);
        }
        if(user.streamManager.session && user && !!videoRef.current){
            user.streamManager.session.on('signal:userChanged', (e)=>{
                const data = JSON.parse(e.data);
                if(data.isScreenShareActive !== undefined){
                    user.getStreamManager().addVideoElement(videoRef.current);
                }
            })
        }
    });


    return (
        <video
            autoPlay={true}
            id={'video-'+ user.getStreamManager().stream.streamId}
            ref={videoRef}
            muted={mutedSound}
            style={
                {
                    width : "100%",
                    height : "100%"
                }
            }
        />
    )

}

export default OvVideo;
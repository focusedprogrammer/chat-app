import { useRef, useEffect } from "react";
import socket from "../socket";

export default function useWebRTC(
  friend,
  currentUser,
  myVideo,
  userVideo
) {
  const peerRef = useRef(null);
  const streamRef = useRef(null);

  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    peer.ontrack = (event) => {
      if (userVideo.current) {
        userVideo.current.srcObject =
          event.streams[0];
      }
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          receiverId: friend.id,
          candidate: event.candidate,
        });
      }
    };

    return peer;
  };

  const startCall = async (
    callType = "video"
  ) => {
    const media =
      await navigator.mediaDevices.getUserMedia({
        video: callType === "video",
        audio: true,
      });

    streamRef.current = media;

    if (myVideo.current) {
      myVideo.current.srcObject = media;
    }

    const peer = createPeer();

    media.getTracks().forEach((track) => {
      peer.addTrack(track, media);
    });

    const offer =
      await peer.createOffer();

    await peer.setLocalDescription(
      offer
    );

    socket.emit("call-user", {
      callerId: currentUser,
      receiverId: friend.id,
      offer,
      callType,
    });

    peerRef.current = peer;
  };

  useEffect(() => {
    socket.on(
      "incoming-call",
      async (data) => {
        const media =
          await navigator.mediaDevices.getUserMedia({
            video:
              data.callType ===
              "video",
            audio: true,
          });

        streamRef.current = media;

        if (myVideo.current) {
          myVideo.current.srcObject =
            media;
        }

        const peer =
          createPeer();

        media
          .getTracks()
          .forEach((track) => {
            peer.addTrack(
              track,
              media
            );
          });

        await peer.setRemoteDescription(
          new RTCSessionDescription(
            data.offer
          )
        );

        const answer =
          await peer.createAnswer();

        await peer.setLocalDescription(
          answer
        );

        socket.emit(
          "answer-call",
          {
            callerId:
              data.callerId,
            answer,
          }
        );

        peerRef.current =
          peer;
      }
    );

    socket.on(
      "call-answered",
      async (data) => {
        if (
          peerRef.current
        ) {
          await peerRef.current.setRemoteDescription(
            new RTCSessionDescription(
              data.answer
            )
          );
        }
      }
    );

    socket.on(
      "ice-candidate",
      async (
        candidate
      ) => {
        if (
          peerRef.current
        ) {
          await peerRef.current.addIceCandidate(
            new RTCIceCandidate(
              candidate
            )
          );
        }
      }
    );

    socket.on(
      "call-ended",
      () => {
        endCall();
      }
    );

    return () => {
      socket.off(
        "incoming-call"
      );

      socket.off(
        "call-answered"
      );

      socket.off(
        "ice-candidate"
      );

      socket.off(
        "call-ended"
      );
    };
  }, []);

  const endCall = () => {
    streamRef.current
      ?.getTracks()
      .forEach((track) =>
        track.stop()
      );

    peerRef.current?.close();

    peerRef.current = null;

    socket.emit(
      "end-call",
      {
        receiverId:
          friend.id,
      }
    );
  };

  return {
    startCall,
    endCall,
  };
}
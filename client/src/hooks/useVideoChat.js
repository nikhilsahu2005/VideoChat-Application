import { useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:5000");

export default function useVideoChat(username) {
  const [joined, setJoined] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [peers, setPeers] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const userVideo = useRef();
  const peersRef = useRef([]);
  const streamRef = useRef();

  const handleJoin = async () => {
    if (!username.trim()) return;

    setJoined(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    streamRef.current = stream;
    userVideo.current.srcObject = stream;

    socket.emit("join", username);

    socket.on("all-users", (users) => {
      const peersArr = [];
      users.forEach((userID) => {
        const peer = addPeer(userID, stream);
        peersRef.current.push({ peerID: userID, peer });
        peersArr.push({ peerID: userID, peer });
      });
      setPeers(peersArr);
    });

    socket.on("user-joined", (payload) => {
      const peer = createPeer(payload.id, stream);
      peersRef.current.push({ peerID: payload.id, peer });
      setPeers((old) => [...old, { peerID: payload.id, peer }]);
    });

    socket.on("signal", (payload) => {
      if (!payload.signal) return;
      const item = peersRef.current.find((p) => p.peerID === payload.from);
      if (item) item.peer.signal(payload.signal);
    });

    socket.on("participants", (names) => setParticipants(names));

    socket.on("user-left", (id) => {
      setPeers((old) => old.filter((p) => p.peerID !== id));
      const idx = peersRef.current.findIndex((p) => p.peerID === id);
      if (idx !== -1) {
        const peerObj = peersRef.current[idx];
        try {
          if (peerObj?.peer && !peerObj.peer.destroyed) {
            peerObj.peer.destroy();
          }
        } catch {}
        peersRef.current.splice(idx, 1);
      }
    });
  };

  function createPeer(userToSignal, stream) {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (signal) =>
      socket.emit("signal", { to: userToSignal, signal })
    );
    return peer;
  }

  function addPeer(userID, stream) {
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (signal) =>
      socket.emit("signal", { to: userID, signal })
    );
    return peer;
  }

  const toggleAudio = () => {
    if (!streamRef.current) return;
    const enabled = !audioEnabled;
    setAudioEnabled(enabled);
    streamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  };

  const toggleVideo = () => {
    if (!streamRef.current) return;
    const enabled = !videoEnabled;
    setVideoEnabled(enabled);
    streamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });
  };

  return {
    joined,
    userVideo,
    participants,
    peers,
    handleJoin,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
  };
}

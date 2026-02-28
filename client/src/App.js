import React, { useState } from "react";
import useVideoChat from "./hooks/useVideoChat";
import JoinScreen from "./components/JoinScreen";
import Controls from "./components/Controls";
import Video from "./components/Video";
import ParticipantsSidebar from "./components/ParticipantsSidebar";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [showParticipants, setShowParticipants] = useState(false);

  const {
    joined,
    userVideo,
    participants,
    peers,
    handleJoin,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
  } = useVideoChat(username);

  return (
    <div className="container">
      {!joined ? (
        <JoinScreen
          username={username}
          setUsername={setUsername}
          handleJoin={handleJoin}
        />
      ) : (
        <>
          {/* Local Video */}
          <div className="local-video-container">
            <video ref={userVideo} autoPlay muted className="local-video" />
          </div>

          {/* Controls */}
          <Controls
            audioEnabled={audioEnabled}
            videoEnabled={videoEnabled}
            toggleAudio={toggleAudio}
            toggleVideo={toggleVideo}
            showParticipants={showParticipants}
            setShowParticipants={setShowParticipants}
          />

          {/* Main Content */}
          <div className={`main-content ${showParticipants ? "with-sidebar" : ""}`}>
            <div className="remote-videos-container">
              {peers.map((p) => (
                <Video key={p.peerID} peer={p.peer} />
              ))}
            </div>

            {showParticipants && (
              <ParticipantsSidebar participants={participants} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;

import React from "react";

export default function Controls({
  audioEnabled,
  videoEnabled,
  toggleAudio,
  toggleVideo,
  showParticipants,
  setShowParticipants,
}) {
  return (
    <div className="controls">
      <button
        onClick={toggleAudio}
        style={{ backgroundColor: audioEnabled ? "#1e8e3e" : "#fc6c85" }}
      >
        {audioEnabled ? "🔊" : "🔇"}
      </button>

      <button
        onClick={toggleVideo}
        style={{ backgroundColor: videoEnabled ? "#1e8e3e" : "#fc6c85" }}
      >
        {videoEnabled ? "📷" : "🚫"}
      </button>

      <button
        onClick={() => setShowParticipants(!showParticipants)}
        style={{ backgroundColor: showParticipants ? "#3a3b42" : "#24252b" }}
      >
        👥
      </button>
    </div>
  );
}

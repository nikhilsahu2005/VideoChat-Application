import React from "react";

export default function JoinScreen({ username, setUsername, handleJoin }) {
  return (
    <div className="join-container">
      <input
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
}

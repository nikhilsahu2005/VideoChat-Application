import React from "react";

export default function ParticipantsSidebar({ participants }) {
  return (
    <div className="participants">
      <h3>Participants:</h3>
      <ul>
        {participants.map((name, idx) => (
          <li key={idx}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

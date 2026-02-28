import React, { useEffect, useRef } from "react";

export default function Video({ peer }) {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return (
    <video ref={ref} autoPlay style={{ width: "300px", marginTop: "10px" }} />
  );
}

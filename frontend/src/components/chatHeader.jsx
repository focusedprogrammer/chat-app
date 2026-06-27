import React from "react";

function ChatHeader({
  friend,
  startCall,
  endCall,
  myVideo,
  userVideo,
}) {
  return (
    <div
      className="text-white p-3 shadow-sm"
      style={{
        background: "#075E54",
      }}
    >
      {/* Header Row */}
      <div
        className="
          d-flex
          justify-content-between
          align-items-center
        "
      >
        {/* Left Side */}
        <h5 className="mb-0">
          {friend?.name}
        </h5>

        </div>

        {/* Right Side */}
        <div>
          <button
            className="btn btn-light btn-sm me-2"
            onClick={() =>
              startCall("audio")
            }
          >
            📞
          </button>

          <button
            className="btn btn-light btn-sm me-2"
            onClick={() =>
              startCall("video")
            }
          >
            📹
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={endCall}
          >
            ❌
          </button>
        
      </div>

      {/* Video Preview */}
      <div
        className="
          d-flex
          gap-2
          mt-2
        "
      >
        <video
          ref={myVideo}
          autoPlay
          muted
          playsInline
          width="150"
          style={{
            borderRadius: "8px",
            background: "#000",
          }}
        />

        <video
          ref={userVideo}
          autoPlay
          playsInline
          width="150"
          style={{
            borderRadius: "8px",
            background: "#000",
          }}
        />
      </div>
    </div>
  );
}

export default ChatHeader;
function MessageBubble({ message, currentUser }) {
  const isMine =
    Number(message.sender_id) === Number(currentUser);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
        marginBottom: "12px",
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: isMine
            ? "16px 16px 0px 16px"
            : "16px 16px 16px 0px",
          background: isMine ? "#DCF8C6" : "#FFFFFF",
          color: "#000",
          boxShadow: "0 1px 3px rgba(0,0,0,.15)",
          wordBreak: "break-word",
        }}
      >
        <div>{message.message}</div>

        <div
          style={{
            fontSize: "11px",
            color: "#666",
            textAlign: "right",
            marginTop: "4px",
          }}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
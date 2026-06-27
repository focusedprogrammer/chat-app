function ChatInput({
  text,
  setText,
  sendMessage,
  currentUser,
  friend,
  socket,
  typingTimeoutRef,
}) {
  return (
    <div
      className="
      p-3
      border-top
      bg-white
      "
    >
      <div className="input-group">

        <input
          type="text"
          className="form-control"
          value={text}
          placeholder="Type a message..."
          onChange={(e) => {

            setText(
              e.target.value
            );

            if (
              !friend?.id
            )
              return;

            socket.emit(
              "typing",
              {
                senderId:
                  currentUser,
                receiverId:
                  friend.id,
              }
            );

            clearTimeout(
              typingTimeoutRef.current
            );

            typingTimeoutRef.current =
              setTimeout(
                () => {

                  socket.emit(
                    "stopTyping",
                    {
                      senderId:
                        currentUser,
                      receiverId:
                        friend.id,
                    }
                  );

                },
                1000
              );
          }}
          onKeyDown={(e) => {

            if (
              e.key ===
              "Enter"
            ) {

              sendMessage();

            }

          }}
        />

        <button
          className="btn"
          style={{
            background:
              "#075E54",
            color:
              "#fff",
          }}
          onClick={
            sendMessage
          }
        >
          Send
        </button>

      </div>
    </div>
  );
}

export default ChatInput;
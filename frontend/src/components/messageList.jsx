import MessageBubble from "./MessageBubble";

function MessageList({
  messages,
  currentUser,
  selectedMessage,
  setSelectedMessage,
  editMessage,
  deleteMessage,
  messagesEndRef,
  formatDate,
}) {

  return (
    <div
      className="flex-grow-1"
      style={{
        overflowY: "auto",
        padding: "20px",
        background: "#e5ddd5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages.map(
        (msg, index) => {

          const currentDate =
            formatDate(
              msg.created_at
            );

          const previousDate =
            index > 0
              ? formatDate(
                  messages[
                    index - 1
                  ].created_at
                )
              : null;

          const showDate =
            currentDate !==
            previousDate;

          return (
            <div key={msg.id}>

              {showDate && (
                <div
                  style={{
                    textAlign:
                      "center",
                    margin:
                      "15px 0",
                  }}
                >
                  <span
                    style={{
                      background:
                        "#ddd",
                      padding:
                        "5px 12px",
                      borderRadius:
                        "15px",
                      fontSize:
                        "12px",
                    }}
                  >
                    {currentDate}
                  </span>
                </div>
              )}

              <MessageBubble
                message={msg}
                currentUser={
                  currentUser
                }
                selectedMessage={
                  selectedMessage
                }
                setSelectedMessage={
                  setSelectedMessage
                }
                editMessage={
                  editMessage
                }
                deleteMessage={
                  deleteMessage
                }
              />

            </div>
          );
        }
      )}

      <div
        ref={messagesEndRef}
      />
    </div>
  );
}

export default MessageList;
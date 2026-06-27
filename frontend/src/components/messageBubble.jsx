// function MessageBubble({
//   message,
//   currentUser,
//   selectedMessage,
//   setSelectedMessage,
//   editMessage,
//   deleteMessage,
// }) {
//   const isMine = Number(message.sender_id) === Number(currentUser);

//   const isSelected = selectedMessage === message.id;

//   return (
//     <div
//       onClick={() => setSelectedMessage(isSelected ? null : message.id)}
//       style={{
//         display: "flex",
//         justifyContent: isMine ? "flex-end" : "flex-start",
//         marginBottom: "12px",
//         width: "100%",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: "70%",
//           padding: "10px 14px",
//           borderRadius: isMine ? "16px 16px 0px 16px" : "16px 16px 16px 0px",
//           background: isSelected ? "#b8e6ff" : isMine ? "#DCF8C6" : "#FFFFFF",
//           color: "#000",
//           boxShadow: "0 1px 3px rgba(0,0,0,.15)",
//           wordBreak: "break-word",
//         }}
//       >
//         <div>{message.message}</div>

//         <div
//           style={{
//             fontSize: "11px",
//             color: "#666",
//             textAlign: "right",
//             marginTop: "4px",
//           }}
//         >
//           {new Date(message.created_at).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })}

          
//         </div>
        
//       </div>
      
//     </div>
//   );
// }

// export default MessageBubble;


function MessageBubble({
  message,
  currentUser,
  selectedMessage,
  setSelectedMessage,
  editMessage,
  deleteMessage,
}) {
  const isMine = Number(message.sender_id) === Number(currentUser);

  const isSelected = selectedMessage === message.id;

  return (
    <div
      onClick={() => setSelectedMessage(isSelected ? null : message.id)}
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
          background: isSelected
            ? "#b8e6ff"
            : isMine
            ? "#DCF8C6"
            : "#FFFFFF",
          color: "#000",
          boxShadow: "0 1px 3px rgba(0,0,0,.15)",
          wordBreak: "break-word",
          position: "relative",
        }}
      >
        {/* Message Text */}
        <div>{message.message}</div>
       

        {/* Time */}
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

        {/* Show buttons only when selected and own message */}
        {isSelected && isMine && (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
            }}
          >
            <button
              className="btn btn-sm btn-warning"
              onClick={(e) => {
                e.stopPropagation();
                editMessage(message.id, message.message);
              }}
            >
              Edit
            </button>

            <button
              className="btn btn-sm btn-danger"
              onClick={(e) => {
                e.stopPropagation();

                if (
                  window.confirm(
                    "Are you sure you want to delete this message?"
                  )
                ) {
                  deleteMessage(message.id);
                }
              }}
            >
              Delete
            </button>
          </div>

          
        )}
      </div>
      
    </div>
  );
}

export default MessageBubble;
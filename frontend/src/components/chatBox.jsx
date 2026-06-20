import { useEffect, useState, useRef } from "react";

import API from "../services/api";
import socket from "../socket";

import MessageBubble from "./MessageBubble";

function ChatBox({ friend, currentUser }) {
  const typingTimeoutRef = useRef(null);
  const [conversationId, setConversationId] = useState(null);

  const [messages, setMessages] = useState([]);

  const [text, setText] = useState("");

  const messagesEndRef = useRef(null);

  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (friend) {
      startConversation();
    }
  }, [friend]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentUser) {
      socket.emit("join", currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    socket.on("typing", () => {
      setTyping(true);
    });

    socket.on("stopTyping", () => {
      setTyping(false);
    });

    return () => {
      socket.off("typing");

      socket.off("stopTyping");
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const startConversation = async () => {
    try {
      const res = await API.post("/chat/start", {
        friendId: friend.id,
      });

      setConversationId(res.data.id);

      loadMessages(res.data.id);
    } catch (err) {
      console.log(err);
    }
  };

  const loadMessages = async (id) => {
    try {
      const res = await API.get(`/chat/messages/${id}`);

      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !conversationId) return;

    try {
      await API.post("/chat/send", {
        conversationId,
        message: text,
      });

      socket.emit("stopTyping", {
        senderId: currentUser,
        receiverId: friend?.id,
      });

      setText("");

      loadMessages(conversationId);
    } catch (err) {
      console.log(err);
    }
  };

  if (!friend) {
    return (
      <div
        className="
        h-100
        d-flex
        justify-content-center
        align-items-center
        "
      >
        <h4 className="text-muted">Select Friend To Start Chat</h4>
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column"
      style={{
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}

      <div
        className="text-white p-3 shadow-sm"
        style={{
          background: "#075E54",
        }}
      >
        <h5 className="mb-0">{friend.name}</h5>
      </div>

      {typing && (
        <div
          className="
px-3
py-1
small
text-success
"
        >
          Typing...
        </div>
      )}

      {/* MESSAGES */}

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
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} currentUser={currentUser} />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BOX */}

      <div
        className="
        p-3
        border-top
        bg-white
        "
      >
        <div
          className="
          input-group
          "
        >
          <input
            type="text"
            className="
            form-control
            "
            placeholder="
            Type a message...
            "
            value={text}
            onChange={(e) => {
              setText(e.target.value);

              if (!friend?.id) return;

              socket.emit("typing", {
                senderId: currentUser,
                receiverId: friend.id,
              });

              clearTimeout(typingTimeoutRef.current);

              typingTimeoutRef.current = setTimeout(() => {
                socket.emit("stopTyping", {
                  senderId: currentUser,
                  receiverId: friend.id,
                });
              }, 1000);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            className="btn"
            style={{
              background: "#075E54",
              color: "#fff",
            }}
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;

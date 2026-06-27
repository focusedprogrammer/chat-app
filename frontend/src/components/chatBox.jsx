import { useEffect, useState, useRef } from "react";

import API from "../services/api";
import socket from "../socket";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./chatInput";

import useWebRTC from "../hooks/useWebRTC";

function ChatBox({
  friend,
  currentUser,
}) {

  const typingTimeoutRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  const myVideo =
    useRef(null);

  const userVideo =
    useRef(null);

  const [
    conversationId,
    setConversationId
  ] = useState(null);

  const [
    messages,
    setMessages
  ] = useState([]);

  const [
    text,
    setText
  ] = useState("");

  const [
    typing,
    setTyping
  ] = useState(false);

  const [
    selectedMessage,
    setSelectedMessage
  ] = useState(null);

  const {
    startCall,
    endCall,
  } = useWebRTC(
    friend,
    currentUser,
    myVideo,
    userVideo
  );

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

      socket.emit(
        "join",
        currentUser
      );

    }

  }, [currentUser]);

  useEffect(() => {

    const handleReceiveMessage =
      (newMessage) => {

        setMessages(
          (prev) => [
            ...prev,
            newMessage
          ]
        );

      };

    socket.on(
      "receiveMessage",
      handleReceiveMessage
    );

    return () => {

      socket.off(
        "receiveMessage",
        handleReceiveMessage
      );

    };

  }, []);

  useEffect(() => {

    const handleTyping =
      () => {

        setTyping(true);

      };

    const handleStopTyping =
      () => {

        setTyping(false);

      };

    socket.on(
      "typing",
      handleTyping
    );

    socket.on(
      "stopTyping",
      handleStopTyping
    );

    return () => {

      socket.off(
        "typing",
        handleTyping
      );

      socket.off(
        "stopTyping",
        handleStopTyping
      );

    };

  }, []);

  const scrollToBottom =
    () => {

      messagesEndRef
        ?.current
        ?.scrollIntoView({
          behavior:
            "smooth",
        });

    };

  const startConversation =
    async () => {

      try {

        const res =
          await API.post(
            "/chat/start",
            {
              friendId:
                friend.id,
            }
          );

        setConversationId(
          res.data.id
        );

        loadMessages(
          res.data.id
        );

      } catch (err) {

        console.log(err);

      }

    };

  const loadMessages =
    async (id) => {

      try {

        const res =
          await API.get(
            `/chat/messages/${id}`
          );

        setMessages(
          res.data
        );

      } catch (err) {

        console.log(err);

      }

    };

  const sendMessage =
    async () => {

      if (
        !text.trim() ||
        !conversationId
      ) {
        return;
      }

      try {

        await API.post(
          "/chat/send",
          {
            conversationId,
            message: text,
          }
        );

        socket.emit(
          "stopTyping",
          {
            senderId:
              currentUser,
            receiverId:
              friend.id,
          }
        );

        setText("");

        loadMessages(
          conversationId
        );

      } catch (err) {

        console.log(err);

      }

    };

  const deleteMessage =
    async (id) => {

      try {

        await API.delete(
          `/chat/message/${id}`
        );

        setMessages(
          (prev) =>
            prev.filter(
              (msg) =>
                msg.id !== id
            )
        );

        setSelectedMessage(
          null
        );

      } catch (err) {

        console.log(err);

      }

    };

  const editMessage =
    async (
      id,
      oldText
    ) => {

      const newText =
        prompt(
          "Edit Message",
          oldText
        );

      if (!newText) {
        return;
      }

      try {

        await API.put(
          `/chat/message/${id}`,
          {
            text:
              newText,
          }
        );

        setMessages(
          (prev) =>
            prev.map(
              (msg) =>
                msg.id === id
                  ? {
                      ...msg,
                      message:
                        newText,
                    }
                  : msg
            )
        );

        setSelectedMessage(
          null
        );

      } catch (err) {

        console.log(err);

      }

    };

  const formatDate =
    (date) => {

      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day:
            "numeric",
          month:
            "long",
          year:
            "numeric",
        }
      );

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
        <h4 className="text-muted">
          Select Friend To Start Chat
        </h4>
      </div>
    );

  }

  return (
    <div
      className="
      d-flex
      flex-column
      "
      style={{
        height: "100%",
        overflow:
          "hidden",
      }}
    >

      <ChatHeader
        friend={friend}
        startCall={
          startCall
        }
        endCall={
          endCall
        }
        myVideo={
          myVideo
        }
        userVideo={
          userVideo
        }
      />

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

      <MessageList
        messages={
          messages
        }
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
        messagesEndRef={
          messagesEndRef
        }
        formatDate={
          formatDate
        }
      />

      <ChatInput
        text={text}
        setText={setText}
        sendMessage={
          sendMessage
        }
        currentUser={
          currentUser
        }
        friend={friend}
        socket={socket}
        typingTimeoutRef={
          typingTimeoutRef
        }
      />

    </div>
  );
}

export default ChatBox;
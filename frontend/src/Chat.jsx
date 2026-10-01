import { useEffect, useState, useRef } from "react";
import { socket } from "./socket";
import "./chat.css";

function Chat({ username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Join the chat room on load
  useEffect(() => {
    socket.emit("join_chat", { username, room: "global" });
  }, [username]);

  // Receive messages
  useEffect(() => {
    const receiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };
    socket.on("receive_message", receiveMessage);
    return () => socket.off("receive_message", receiveMessage);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", { text: message });
    setMessage("");
  };

  return (
    <div className="chat-page">
      {/* Header */}
      <header className="chat-header">
        <div className="header-info">
          <div className="avatar">{username[0].toUpperCase()}</div>
          <div className="username">{username}</div>
        </div>
      </header>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message-wrapper ${
              msg.user === username ? "me" : "other"
            }`}
          >
            {msg.user !== username && msg.user !== "system" && (
              <div className="avatar">{msg.user[0].toUpperCase()}</div>
            )}
            <div
              className={`message ${
                msg.user === username ? "me" : "other"
              } ${msg.user === "system" ? "system" : ""}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

export default Chat;

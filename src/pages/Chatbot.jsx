import React, { useState } from "react";
import styles from "./Chatbot.module.css";
import { FaRobot, FaTrash, FaTimes, FaPaperPlane } from "react-icons/fa";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm Fixora Assistant. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChatbot = () => setIsOpen(!isOpen);
  const clearChat = () => setMessages([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      // Call Django API (GET request with query param)
      const response = await fetch(
        `http://127.0.0.1:8000/chatbot/?question=${encodeURIComponent(
          userMessage
        )}`
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.answer || "⚠️ No reply." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Could not connect to server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button className={styles.chatbotFloatBtn} onClick={toggleChatbot}>
        <FaRobot />
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className={styles.chatbotContainer}>
          {/* Header */}
          <div className={styles.chatbotHeader}>
            <div className={styles.headerContent}>
              <div className={styles.botAvatar}>
                <FaRobot />
              </div>
              <div className={styles.headerInfo}>
                <h1>Fixora Assistant</h1>
                <p>How can I help you today?</p>
              </div>
              <div className={styles.headerActions}>
                <button className={styles.clearBtn} onClick={clearChat} title="Clear Chat">
                  <FaTrash />
                </button>
                <button className={styles.closeBtn} onClick={toggleChatbot} title="Close">
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.chatMessages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.message} ${
                  msg.sender === "bot" ? styles.botMessage : styles.userMessage
                }`}
              >
                {msg.sender === "bot" && (
                  <div className={styles.messageAvatar}>
                    <FaRobot />
                  </div>
                )}
                <div className={styles.messageContent}>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.messageAvatar}>
                  <FaRobot />
                </div>
                <div className={styles.messageContent}>
                  <p>...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className={styles.chatInputContainer}>
            <div className={styles.chatInputWrapper}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                autoComplete="off"
              />
              <button className={styles.sendBtn} onClick={sendMessage}>
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;

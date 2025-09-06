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

  // Mock responses for when backend is not available
  const getMockResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! Welcome to Fixora! How can I help you today?";
    } else if (message.includes('service') || message.includes('services')) {
      return "We offer various services including plumbing, electrical work, cleaning, gardening, and more. You can browse our services on the main page!";
    } else if (message.includes('price') || message.includes('cost')) {
      return "Our pricing varies depending on the service. Please contact us directly for a personalized quote!";
    } else if (message.includes('book') || message.includes('appointment')) {
      return "You can book our services through our website. Just select the service you need and choose your preferred time slot!";
    } else if (message.includes('worker') || message.includes('job')) {
      return "Interested in joining our team? You can register as a worker through our worker registration page!";
    } else if (message.includes('contact') || message.includes('phone')) {
      return "You can contact us at +94 71 234 5678 or email us at Fixora@info.lk";
    } else {
      return "I'm here to help! You can ask me about our services, pricing, booking, or how to become a worker. What would you like to know?";
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      // Try to connect to Django API first
      const response = await fetch(
        `http://127.0.0.1:8000/chatbot/?question=${encodeURIComponent(
          userMessage
        )}`,
        { timeout: 5000 } // 5 second timeout
      );

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.answer || "⚠️ No reply." },
        ]);
      } else {
        throw new Error('Server not responding');
      }
    } catch (error) {
      // Fallback to mock response
      const mockResponse = getMockResponse(userMessage);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `🤖 ${mockResponse}` },
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

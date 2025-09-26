import React, { useState, useEffect, useRef } from "react";
import styles from "./Chatbot.module.css";
import { FaRobot, FaTrash, FaTimes, FaPaperPlane, FaUser } from "react-icons/fa";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "Hello! I'm Fixora Assistant. How can I help you today? 😊",
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => setIsOpen(!isOpen);
  const clearChat = () => {
    setMessages([
      { 
        sender: "bot", 
        text: "Chat cleared! How can I help you today? 🎯",
        timestamp: new Date()
      }
    ]);
  };

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock responses for when backend is not available
  const getMockResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! Welcome to Fixora! 🏡 How can I assist you today?";
    } else if (message.includes('service') || message.includes('services')) {
      return "We offer a wide range of services including:\n🔧 Plumbing\n⚡ Electrical work\n🧹 Cleaning\n🌿 Gardening\n🔨 Carpentry\n📱 Device Repair\n\nYou can browse all services on our main page!";
    } else if (message.includes('price') || message.includes('cost')) {
      return "Our pricing varies based on the service type and complexity. 💰 For accurate pricing, please contact us directly or book a consultation!";
    } else if (message.includes('book') || message.includes('appointment')) {
      return "Booking is easy! 📅\n1. Visit our services page\n2. Select your preferred service\n3. Choose date & time\n4. Confirm booking\n\nWould you like me to guide you through the process?";
    } else if (message.includes('worker') || message.includes('job')) {
      return "Interested in joining our team? 🛠️\nYou can register as a service provider through our worker registration portal. We're always looking for skilled professionals!";
    } else if (message.includes('contact') || message.includes('phone')) {
      return "You can reach us at:\n📞 +94 71 234 5678\n📧 Fixora@info.lk\n📍 123 Service Lane, Colombo\n\nWe're available 24/7 for emergencies!";
    } else if (message.includes('emergency') || message.includes('urgent')) {
      return "For urgent matters, please call our emergency hotline: 🚨 +94 71 911 9111\nOur team will respond immediately!";
    } else if (message.includes('thank')) {
      return "You're welcome! 😊 Is there anything else I can help you with?";
    } else {
      return "I'm here to help! 💪 You can ask me about:\n• Our services\n• Pricing information\n• Booking process\n• Becoming a worker\n• Contact details\n\nWhat would you like to know?";
    }
  };

  const simulateTyping = async () => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    setIsTyping(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user", 
      text: input,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      await simulateTyping();
      
      // Try to connect to Django API first
      const response = await fetch(
        `http://127.0.0.1:8000/chatbot/?question=${encodeURIComponent(input)}`,
        { 
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(5000)
        }
      );

      if (response.ok) {
        const data = await response.json();
        const botResponse = {
          sender: "bot", 
          text: data.answer || "I'm not sure how to respond to that. Can you try asking differently?",
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        throw new Error('Server not responding');
      }
    } catch (error) {
      // Fallback to mock response
      const mockResponse = getMockResponse(input);
      const botResponse = {
        sender: "bot", 
        text: mockResponse,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const quickReplies = [
    "What services do you offer?",
    "How do I book a service?",
    "What are your prices?",
    "How to become a worker?",
    "Contact information"
  ];

  return (
    <>
      {/* Floating Button */}
      <button 
        className={`${styles.chatbotFloatBtn} ${isOpen ? styles.btnActive : ''}`} 
        onClick={toggleChatbot}
        aria-label="Open chat"
      >
        <FaRobot className={styles.chatIcon} />
        {!isOpen && <span className={styles.notificationDot}></span>}
      </button>

      {/* Chatbot Window */}
      <div className={`${styles.chatbotContainer} ${isOpen ? styles.containerOpen : ''}`}>
        {/* Header */}
        <div className={styles.chatbotHeader}>
          <div className={styles.headerContent}>
            <div className={styles.botInfo}>
              <div className={styles.botAvatar}>
                <FaRobot />
                <span className={styles.statusIndicator}></span>
              </div>
              <div className={styles.headerInfo}>
                <h1>Fixora Assistant</h1>
                <p>{isTyping ? "Typing..." : "Online • Ready to help"}</p>
              </div>
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
              {msg.sender === "bot" ? (
                <div className={styles.messageAvatar}>
                  <FaRobot />
                </div>
              ) : (
                <div className={styles.messageAvatar}>
                  <FaUser />
                </div>
              )}
              <div className={styles.messageContent}>
                <p>{msg.text}</p>
                <span className={styles.messageTime}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className={`${styles.message} ${styles.botMessage}`}>
              <div className={styles.messageAvatar}>
                <FaRobot />
              </div>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className={styles.quickReplies}>
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              className={styles.quickReplyBtn}
              onClick={() => {
                setInput(reply);
                setTimeout(() => sendMessage(), 100);
              }}
            >
              {reply}
            </button>
          ))}
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
              disabled={loading}
            />
            <button 
              className={styles.sendBtn} 
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && <div className={styles.backdrop} onClick={toggleChatbot}></div>}
    </>
  );
};

export default Chatbot;
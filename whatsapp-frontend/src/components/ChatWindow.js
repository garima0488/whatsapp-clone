
// import React, { useEffect, useState } from 'react';
// import MessageBubble from './MessageBubble';

// function ChatWindow({ wa_id }) {
//   const [messages, setMessages] = useState([]);

//   const loadMessages = () => {
//     if (!wa_id) {
//       setMessages([]);
//       return;
//     }
//     const api = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
//     fetch(`${api}/chats/${encodeURIComponent(wa_id)}/messages`)
//       .then(res => res.json())
//       .then(setMessages)
//       .catch(err => console.error(err));
//   };

//   useEffect(() => {
//     loadMessages();
//     const handler = (e) => {
//       if (!wa_id) return;
//       if (!e?.detail || e.detail.wa_id === wa_id) loadMessages();
//     };
//     window.addEventListener('reload-messages', handler);
//     return () => window.removeEventListener('reload-messages', handler);
//   }, [wa_id]);

//   return (
//     <div style={{flex:1, padding: '1rem', display:'flex', flexDirection:'column'}}>
//       {!wa_id && <div style={{textAlign:'center', marginTop:50}}>Select a chat</div>}
//       <div style={{flex:1, overflowY:'auto'}}>
//         {messages.map(m => <MessageBubble key={m._id} message={m} />)}
//       </div>
//     </div>
//   );
// }

// export default ChatWindow;

// import React, { useState, useEffect, useRef } from "react";
// import "./ChatWindow.css";

// const ChatWindow = ({ selectedChat, messages, onSendMessage }) => {
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     // Auto-scroll to bottom when messages change
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   if (!selectedChat) {
//     return (
//       <div className="chat-window">
//         <div className="chat-placeholder">Select a chat to start messaging</div>
//       </div>
//     );
//   }

//   const handleSend = () => {
//     if (newMessage.trim() !== "") {
//       onSendMessage(selectedChat.id, newMessage);
//       setNewMessage("");
//     }
//   };

//   return (
//     <div className="chat-window">
//       {/* Chat Header */}
//       <div className="chat-header">
//         <span className="chat-contact-name">{selectedChat.name}</span>
//       </div>

//       {/* Messages */}
//       <div className="chat-messages">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`chat-message ${msg.sender === "me" ? "sent" : "received"}`}
//           >
//             {msg.text}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Message Input */}
//       <div className="chat-input-container">
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyPress={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;


import React, { useEffect, useState, useRef } from "react";
import "./ChatWindow.css";

function ChatWindow({ selectedChat }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const messagesRef = useRef(null);
  const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // load messages when selectedChat changes
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }
    setLoading(true);
    fetch(`${apiBase}/chats/${encodeURIComponent(selectedChat.wa_id)}/messages`)
      .then(res => res.json())
      .then(data => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
        // scroll after small delay
        setTimeout(() => scrollToBottom(), 50);
      })
      .catch(err => {
        console.error("Failed to load messages:", err);
        setLoading(false);
      });
  }, [selectedChat]);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // send message (optimistic)
  const handleSend = async () => {
    if (!selectedChat || !text.trim()) return;

    // create optimistic message object (temp id)
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      _id: tempId,
      wa_id: selectedChat.wa_id,
      name: selectedChat.name,
      text: text,
      timestamp: new Date().toISOString(),
      status: "sent",
      direction: "outbound",
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setText("");
    scrollToBottom();

    try {
      const res = await fetch(`${apiBase}/chats/${encodeURIComponent(selectedChat.wa_id)}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: optimisticMsg.text, name: selectedChat.name })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const saved = await res.json();
      // replace optimistic message with saved message from server
      setMessages(prev => prev.map(m => (m._id === tempId ? saved : m)));
      setTimeout(() => scrollToBottom(), 50);
    } catch (err) {
      console.error("Send failed:", err);
      // mark the optimistic message as failed
      setMessages(prev => prev.map(m => (m._id === tempId ? { ...m, status: "failed" } : m)));
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="chat-window">
      <header className="chat-header">
        {selectedChat ? selectedChat.name : "Select a chat"}
      </header>

      <div className="chat-messages" ref={messagesRef}>
        {loading && <div className="loading">Loading messages...</div>}
        {!loading && messages.length === 0 && <div className="empty">No messages yet</div>}
        {messages.map(m => {
          const isOutgoing = m.direction === "outbound" || m.status === "sent" || m.status === "delivered" || m.status === "read";
          return (
            <div key={m._id} className={`message-row ${isOutgoing ? 'outgoing' : 'incoming'}`}>
              <div className={`message-bubble ${isOutgoing ? 'bubble-out' : 'bubble-in'}`}>
                <div className="message-text">{m.text}</div>
                <div className="message-meta">
                  <span className="msg-time">{new Date(m.timestamp).toLocaleString()}</span>
                  <span className={`msg-status ${m.status}`}>{m.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* fixed input bar */}
      <div className="chat-input-bar">
        <textarea
          className="chat-input"
          placeholder="Type a message"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button className="send-btn" onClick={handleSend}>Send</button>
      </div>
    </main>
  );
}

export default ChatWindow;


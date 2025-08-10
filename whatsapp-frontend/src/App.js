

// import React, { useState, useEffect } from 'react';
// import Sidebar from './components/Sidebar';
// import ChatWindow from './components/ChatWindow';
// import SendMessage from './components/SendMessage';
// import './App.css';

// function App() {
//   const [selectedUser, setSelectedUser] = useState(null);

//   // simple listener to reload chat window when a message is sent
//   useEffect(() => {
//     const handler = (e) => {
//       if (e?.detail?.wa_id === selectedUser) {
//         // trigger a small event that ChatWindow listens for to reload
//         window.dispatchEvent(new CustomEvent('reload-messages', { detail: { wa_id: selectedUser } }));
//       }
//     };
//     window.addEventListener('message-sent', handler);
//     return () => window.removeEventListener('message-sent', handler);
//   }, [selectedUser]);

//   return (
//     <div className="app-container" style={{display:'flex', height:'100vh'}}>
//       <Sidebar onSelectUser={setSelectedUser} />
//       <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//         <ChatWindow wa_id={selectedUser} />
//         {selectedUser && <SendMessage wa_id={selectedUser} />}
//       </div>
//     </div>
//   );
// }

// export default App;
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  // selectedChat: { wa_id: string, name: string } or null
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="app-container">
      <Sidebar onSelectUser={(chat) => setSelectedChat(chat)} selectedChat={selectedChat} />
      <ChatWindow selectedChat={selectedChat} />
    </div>
  );
}

export default App;


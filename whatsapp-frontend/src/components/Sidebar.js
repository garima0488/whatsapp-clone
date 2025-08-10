// import React, { useEffect, useState } from 'react';

// function Sidebar({ onSelectUser }) {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:5000/api/chats')
//       .then(res => res.json())
//       .then(setUsers);
//   }, []);

//   return (
//     <div className="sidebar">
//       <h2>Chats</h2>
//       <ul>
//         {users.map(wa_id => (
//           <li key={wa_id} onClick={() => onSelectUser(wa_id)}>
//             {wa_id}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;
//-------------------------------------------------------------------------

// import React, { useEffect, useState } from 'react';

// function Sidebar({ onSelectUser }) {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:5000/api/chats')
//       .then(res => res.json())
//       .then(setUsers);
//   }, []);

//   return (
//     <div className="sidebar">
//       <h2>Chats</h2>
//       <ul>
//         {users.map(user => (
//           <li key={user._id} onClick={() => onSelectUser(user._id)}>
//             {user.name} ({user._id})
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;

// import React, { useEffect, useState } from 'react';

// function Sidebar({ onSelectUser }) {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const api = process.env.REACT_APP_API_URL || "http://localhost:5000/api/chats";
//     fetch(`${api}/chats`)
//       .then(res => res.json())
//       .then(setUsers)
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div style={{width:300, borderRight:'1px solid #ddd', padding: '1rem', overflowY:'auto'}}>
//       <h3>Chats</h3>
//       <ul style={{listStyle:'none', padding:0}}>
//         {users.map(u => (
//           <li key={u._id} style={{padding:'0.5rem 0', cursor:'pointer'}} onClick={() => onSelectUser(u._id)}>
//             <div><strong>{u.name || u._id}</strong></div>
//             <div style={{fontSize:12, color:'#666'}}>{u.lastMessage}</div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;
//--------------------------------------------------------------------------
//final code 

// import React, { useEffect, useState } from "react";

// function Sidebar({ onSelectUser }) {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//     // If REACT_APP_API_URL is set, it will use it; otherwise fallback
//     const api = process.env.REACT_APP_API_URL || "http://localhost:5000";
//     fetch(`${api}/api/chats`)
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data) => {
//         setUsers(data || []);
//       })
//       .catch((err) => console.error("Failed to fetch chats:", err));
//   }, []);

//   const handleSelect = (id) => {
//     setSelectedUser(id);
//     onSelectUser(id); // Pass the selected user ID to parent
//   };

//   return (
//     <div
//       style={{
//         width: 300,
//         borderRight: "1px solid #ddd",
//         padding: "1rem",
//         overflowY: "auto",
//       }}
//     >
//       <h3>Chats</h3>
//       <ul style={{ listStyle: "none", padding: 0 }}>
//         {users.map((u) => (
//           <li
//             key={u._id}
//             onClick={() => handleSelect(u._id)}
//             style={{
//               padding: "0.5rem 0",
//               cursor: "pointer",
//               backgroundColor: selectedUser === u._id ? "#f0f0f0" : "transparent",
//               borderRadius: "5px",
//               paddingLeft: "0.5rem",
//             }}
//           >
//             <div>
//               <strong>{u.name || u._id}</strong>
//             </div>
//             <div style={{ fontSize: 12, color: "#666" }}>
//               {u.lastMessage || "No messages yet"}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;

import React, { useEffect, useState } from "react";
import './Sidebar.css'; // Assuming you have a CSS file for styling

function Sidebar({ onSelectUser, selectedChat }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const api = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    fetch(`${api}/chats`)
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch chats:", err));
  }, []);

  return (

    
    <aside className="sidebar">
        
      <div className="sidebar-header">Chats</div>
      <ul className="chat-list">
        {users.map(u => (
          <li
            key={u._id}
            className={`chat-list-item ${selectedChat && selectedChat.wa_id === u._id ? 'active' : ''}`}
            onClick={() => onSelectUser({ wa_id: u._id, name: u.name || u._id })}
          >
            <div className="chat-name">{u.name || u._id}</div>
            <div className="chat-last">{u.lastMessage || 'No messages yet'}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;

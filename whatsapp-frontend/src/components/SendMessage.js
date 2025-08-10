// import React, { useState } from 'react';

// function SendMessage({ wa_id }) {
//   const [text, setText] = useState('');
//   const [name, setName] = useState('');

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!text || !name) return;
//     await fetch('http://localhost:5000/api/messages', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ wa_id, text, name })
//     });
//     setText('');
//   };

//   return (
//     <form onSubmit={handleSend} style={{ display: 'flex', padding: '1rem', borderTop: '1px solid #eee' }}>
//       <input
//         type="text"
//         placeholder="Your name"
//         value={name}
//         onChange={e => setName(e.target.value)}
//         style={{ marginRight: '1rem' }}
//         required
//       />
//       <input
//         type="text"
//         placeholder="Type a message"
//         value={text}
//         onChange={e => setText(e.target.value)}
//         style={{ flex: 1, marginRight: '1rem' }}
//         required
//       />
//       <button type="submit">Send</button>
//     </form>
//   );
// }

// export default SendMessage;

import React, { useState } from 'react';


function SendMessage({ wa_id }) {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const api = process.env.REACT_APP_API_URL || "http://localhost:5000/api/messages";
    try {
      const res = await fetch(`${api}/chats/${encodeURIComponent(wa_id)}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, name: wa_id })
      });
      const data = await res.json();
      // notify ChatWindow to reload
      window.dispatchEvent(new CustomEvent('message-sent', { detail: { wa_id } }));
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{display:'flex', padding:'0.5rem', borderTop:'1px solid #eee'}}>
      <input type="text" placeholder="Type a message" value={text} onChange={e=>setText(e.target.value)} style={{flex:1, padding:'0.5rem'}} />
      <button type="submit" style={{marginLeft:8}}>Send</button>
    </form>
  );
}

export default SendMessage;

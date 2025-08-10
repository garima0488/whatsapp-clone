

import React from 'react';

function MessageBubble({ message }) {
  const isOutgoing = message.status === 'sent' || message.status === 'delivered' || message.status === 'read';
  return (
    <div style={{margin: '0.5rem 0', display: 'flex', flexDirection: isOutgoing ? 'row-reverse' : 'row'}}>
      <div style={{maxWidth:'70%', padding: '0.6rem 0.8rem', borderRadius:12, background: isOutgoing ? '#dcf8c6' : '#fff', boxShadow:'0 1px 1px rgba(0,0,0,0.06)'}}>
        <div style={{fontSize:14}}>{message.text}</div>
        <div style={{fontSize:11, color:'#666', marginTop:6, display:'flex', justifyContent:'space-between'}}>
          <div>{new Date(message.timestamp).toLocaleString()}</div>
          <div style={{textTransform:'capitalize'}}>{message.status}</div>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;

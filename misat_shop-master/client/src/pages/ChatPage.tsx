import React from 'react';
import ChatSupport from '../components/chat/ChatSupport';

const ChatPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      paddingTop: '80px',
      paddingBottom: '100px'
    }}>
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '0 16px',
        height: 'calc(100vh - 180px)'
      }}>
        <ChatSupport isFullPage={true} />
      </div>
    </div>
  );
};

export default ChatPage;
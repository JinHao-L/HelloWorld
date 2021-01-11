import React, { useContext } from 'react';
import { StateContext } from '../../App';

function ChatMessage({ sender, text, senderId }) {
  const { socketId } = useContext(StateContext);
  const isUserMessage = socketId === senderId;

  return (
    <div className={'chat-message'}>
      {sender && (
        <div className={'chat-name'} style={{ float: isUserMessage ? 'right' : 'left' }}>
          {sender}
        </div>
      )}
      <div
        className={'chat-bubble'}
        style={
          isUserMessage
            ? { float: 'right', backgroundColor: '#3AD064', borderTopRightRadius: 0 }
            : { float: 'left', borderTopLeftRadius: 0 }
        }
      >
        {text}
      </div>
    </div>
  );
}

export default ChatMessage;

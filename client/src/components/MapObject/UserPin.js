import React from 'react';
import './UserPin.css';
import UserAvatar from '../UserAvatar';

function UserPin({ username, avatar, message }) {
  return (
    <div className={'user'}>
      {message && <div className={'speech-bubble'}>{message}</div>}
      <UserAvatar avatar={avatar} className={'user-avatar'} />
      <p className={'user-name'}>{username || 'unnamed'}</p>
    </div>
  );
}

export default UserPin;

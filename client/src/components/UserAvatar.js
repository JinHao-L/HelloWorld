import React from 'react';
import { listOfImages } from './picturecontainer/imagesList';
import boy1 from './images/boy1.svg';

function UserAvatar({ handleClick, avatar, className }) {
  return (
    <>
      <img src={listOfImages[avatar]} alt={boy1} onClick={handleClick} className={className} />
    </>
  );
}

export default UserAvatar;

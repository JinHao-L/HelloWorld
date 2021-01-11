import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';

import { StateContext } from '../../App';
import { listOfImages } from '../picturecontainer/imagesList';
import ListOfImages from '../picturecontainer/ListOfImages';
import './styles.css';
import '../picturecontainer/styles.css';

const NameHolder = () => {
  const { name, setName, image, setImage } = useContext(StateContext);
  const [isPickAvatar, showAvatarPicker] = useState(false);

  const handleSelection = (pic) => {
    setImage(pic);
    showAvatarPicker(false);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <>
      <Modal
        show={isPickAvatar}
        onHide={() => showAvatarPicker(false)}
        size="lg"
        dialogClassName="appear-on-left"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <ListOfImages currentSelected={image} handleSelection={handleSelection} />
      </Modal>
      <div className="row-flex">
        <img
          src={image ? listOfImages[image] : listOfImages['boy1']}
          alt="none"
          className="image-style"
          style={{ width: `50px` }}
          onClick={() => showAvatarPicker(true)}
        />
        <input className="input-name" placeholder={name} onChange={handleNameChange} />
      </div>
    </>
  );
};

export default NameHolder;

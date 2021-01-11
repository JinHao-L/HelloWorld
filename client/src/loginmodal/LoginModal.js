import React, { useContext, useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import './styles.css';
import ListOfImages from '../components/picturecontainer/ListOfImages';
import { StateContext } from '../App';

const LoginModal = () => {
  const { name, image, setName, setImage, initUser, sendMessage } = useContext(StateContext);
  const [show, setShow] = useState(true);

  const handleSubmit = (event) => {
    setShow(false);
    event.preventDefault();
    initUser(name, image);
    sendMessage("Hello everybody, I'm " + name);
  };

  const handleChange = (event) => setName(event.target.value);

  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      size="lg"
      dialogClassName="modal-styles"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      id="modal-styles"
    >
      <Form onSubmit={(event) => handleSubmit(event)}>
        <Modal.Title id="modal-header">
          <p>What should we call you?</p>
        </Modal.Title>
        <input
          required
          type="text"
          placeholder="Input your name"
          onChange={handleChange}
          className="name-box"
        />
        <div className="row-container">
          <p>Pick your avatar</p>
          <ListOfImages currentSelected={image} handleSelection={setImage} />
        </div>
        <Modal.Footer id="modal-footer">
          <button type="submit" className={"my-button"}>Get chatting!</button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default LoginModal;

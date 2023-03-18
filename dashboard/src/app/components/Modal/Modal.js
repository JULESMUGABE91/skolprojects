import React from "react";
import "./styles.css";
import { Modal } from "react-bootstrap";

const ModalContainer = (props) => (
  <Modal size={props.size} show={props.show} onHide={props.handleClose}>
    <Modal.Header closeButton>
      <Modal.Title className="modal_title">{props.title}</Modal.Title>
    </Modal.Header>
    {props.children}
  </Modal>
);

export default ModalContainer;

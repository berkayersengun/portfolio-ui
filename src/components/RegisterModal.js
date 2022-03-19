import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import RegisterForm from "./RegisterForm";

const RegisterModal = ({ show, onHide }) => {
  // const [validation, setValidation] = useState("");
  useEffect(() => {
    // if (holding) {
    // }
    // console.log(validation);
    // console.log(holding);
    // return () => setHolding({});
  });
  return (
    <>
      <Modal show={show} onHide={onHide} animation={false} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Create Account</Modal.Title>
        </Modal.Header>
        <RegisterForm onHide={onHide}></RegisterForm>
      </Modal>
    </>
  );
};
export default RegisterModal;

// {
//     "capital": {
//         "crypto": null,
//         "stock": null
//     },
//     "currency": null
// }

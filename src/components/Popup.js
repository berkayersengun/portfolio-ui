import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const Popup = ({ popups, popupOnClose }) => {
  return (
    <ToastContainer position="top-end">
      {popups.map((popup, idx) => (
        <Toast
          key={idx}
          bg={popup.isError ? "danger" : "info"}
          delay={5000}
          autohide={true}
          onClose={popupOnClose(popup)}
          show={popup.show}
        >
          <Toast.Header>
            <strong className="me-auto">
              {popup.isError ? "Error" : "Success"}
            </strong>
          </Toast.Header>
          <Toast.Body>{popup.msg}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default Popup;

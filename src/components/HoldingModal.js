import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import HoldingForm from "./HoldingForm";

const HoldingModal = ({ holding, setHolding, show, onHide }) => {
  // const [validation, setValidation] = useState("");
  useEffect(() => {
    // if (holding) {
    // }
    // console.log(validation);
    // console.log(holding);
    // return () => setHolding({});
  });
  // const handleSubmitData = (event) => {
  //   // debugger;
  //   if (holding.quantity && holding.quantity > 0) {
  //     setValidation("123");
  //     console.log(validation);
  //   } else {
  //     setValidation({
  //       ...validation,
  //       quantity: false,
  //       // ["isFormValid"]: false,
  //     });
  //     console.log(validation);
  //   }

  //   if (holding.symbol) {
  //     setValidation({ ...validation, symbol: true });
  //   } else {
  //     setValidation({
  //       ...validation,
  //       symbol: false,
  //       // ["isFormValid"]: false,
  //     });
  //   }
  //   console.log(validation);

  //   if (holding.action) {
  //     setValidation({ ...validation, action: true });
  //   } else {
  //     setValidation({
  //       ...validation,
  //       action: false,
  //       // ["isFormValid"]: false,
  //     });
  //   }
  //   console.log(validation);
  //   console.log(holding);
  //   if (validation.action && validation.type && validation.quantity) {
  //     console.log(holding);
  //     const token = Cookies.get("userInfo");
  //     const axios = new Axios();
  //     axios.instance.defaults.headers.common[
  //       "Authorization"
  //     ] = `Bearer ${token}`;
  //     axios.addHolding(holding);
  //     onHide();
  //   } else {
  //     event.preventDefault();
  //     alert("empty");
  //   }
  // };
  return (
    <>
      <Modal show={show} onHide={onHide} animation={false} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Asset</Modal.Title>
        </Modal.Header>
        <HoldingForm
          setHolding={setHolding}
          holding={holding}
          onHide={onHide}
        ></HoldingForm>
      </Modal>
    </>
  );
};
export default HoldingModal;

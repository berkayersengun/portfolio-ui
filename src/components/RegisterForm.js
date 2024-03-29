import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col, FloatingLabel } from "react-bootstrap";
import Axios from "../services/axios";
import { CURRENCY } from "../utils/constants";

function RegisterForm({ onHide }) {
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [user, setUser] = useState({
    capital: { crypto: 0, stock: 0, currency: CURRENCY.CAD.value },
    currency: CURRENCY.CAD.value,
  });
  const [currencyList, setCurrencyList] = useState([]);

  useEffect(() => {
    new Axios().getCurrencyList().then((response) => {
      setCurrencyList(response.data);
    });
  }, []);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    new Axios()
      .addUser(user)
      .then((response) => {
        onHide();
        setUser({
          capital: { crypto: 0, stock: 0 },
          currency: CURRENCY.CAD.value,
        });
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data);
      });
  };

  const handleUserPostData = (event) => {
    let key = "";
    key = event.target.attributes.keyname.value.toLowerCase();
    if (key === "crypto" || key === "stock") {
      let capital = { ...user.capital, [key]: event.target.value };
      setUser({ ...user, capital });
    } else if (key === "currency") {
      let capital = { ...user.capital, [key]: event.target.value };
      setUser({ ...user, capital, [key]: event.target.value });
    } else {
      setUser({ ...user, [key]: event.target.value });
    }
  };

  return (
    <Modal.Body>
      <Form validated={validated}>
        <Row className="mb-3">
          {/* email */}
          <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-3"
          >
            <Form.Control
              required
              type="email"
              placeholder="name@example.com"
              onChange={handleUserPostData}
              keyname="email"
            />
            <Form.Control.Feedback type="invalid">
              {errorMessage.email}
            </Form.Control.Feedback>
          </FloatingLabel>
          {/* pass */}
          <FloatingLabel
            controlId="floatingPassword"
            label="Password"
            className="mb-3"
          >
            <Form.Control
              required
              type="password"
              placeholder="Password"
              onChange={handleUserPostData}
              keyname="password"
            />
            <Form.Control.Feedback type="invalid">
              {errorMessage.password}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="First Name"
            className="mb-3"
          >
            <Form.Control
              required
              type="text"
              placeholder="First name"
              onChange={handleUserPostData}
              keyname="first_name"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="Last Name"
            className="mb-3"
          >
            <Form.Control
              required
              type="text"
              placeholder="Last name"
              onChange={handleUserPostData}
              keyname="last_name"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="Username"
            className="mb-3"
          >
            {/* <InputGroup hasValidation> */}
            {/* <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text> */}
            <Form.Control
              type="text"
              placeholder="Username"
              aria-describedby="inputGroupPrepend"
              required
              onChange={handleUserPostData}
              keyname="username"
              // isValid={false}
              // isInvalid={true}
              isInvalid={errorMessage.username ? true : false}
            />
            <Form.Control.Feedback type="invalid">
              {errorMessage.username}
            </Form.Control.Feedback>
            {/* </InputGroup> */}
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingSelect"
            label="Currency"
            className="mb-3"
          >
            <Form.Select
              aria-label="Floating label select example"
              onChange={handleUserPostData}
              keyname="currency"
            >
              {currencyList.map((currency, i) => (
                <option key={i}>{currency}</option>
              ))}
            </Form.Select>
          </FloatingLabel>
          <Form.Label>Capital</Form.Label>
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={2}>
              Crypto
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                // isValid={isQuantityValid}
                // isInvalid={false}
                required
                placeholder="Crypto"
                // onChange={handleSubmitAddHolding}
                type="number"
                defaultValue={0}
                keyname="crypto"
                onChange={handleUserPostData}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formHorizontalPassword"
          >
            <Form.Label column sm={2}>
              Stock
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                // isValid={isQuantityValid}
                // isInvalid={!validation.quantity}
                required
                placeholder="Crypto"
                // onChange={handleSubmitAddHolding}
                type="number"
                defaultValue={0}
                keyname="stock"
                onChange={handleUserPostData}
              />
            </Col>
          </Form.Group>
        </Row>
      </Form>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Cancel
        </Button>
        <Button type="submit" className="me-3" onClick={handleSubmit}>
          Register
        </Button>
        {/* {Object.entries(errorMessage).map(([k, v], i) => (
          <div key={i}>
            {k}: {v}
          </div>
        ))} */}
      </Modal.Footer>
    </Modal.Body>
  );
}

export default RegisterForm;

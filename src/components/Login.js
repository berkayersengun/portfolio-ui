import React, { useState } from "react";
import Axios from "../services/axios";
import styles from "./login.module.css";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { minToMillisec } from "../utils/common";
import RegisterModal from "./RegisterModal";

const axios = new Axios();

const Login = ({ setLoginInfo, loginInfo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  let from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .login({
        username,
        password,
      })
      .then((response) => {
        axios
          .getUser(username)
          .then((response) => {
            localStorage.setItem("currency", response.data.currency);
            localStorage.setItem("username", response.data.username);
            setLoginInfo({
              ...loginInfo,
              timerId: 0,
            });
          })
          .catch((error) => {
            handleLoginError(error);
          });
      })
      .catch((error) => {
        handleLoginError(error);
      });
  };

  const handleLoginError = (error) => {
    if (error.response && error.response.data) {
      setErrorMessage(JSON.stringify(error.response.data));
    } else {
      setErrorMessage(error.message);
    }
    setTimeout(() => {
      setErrorMessage();
    }, minToMillisec(0.2));
  };

  const AlertMessage = () => {
    if (errorMessage) {
      return (
        <Alert
          className={styles.alert}
          key="danger"
          variant="danger"
          onClose={() => setErrorMessage()}
          transition
          dismissible
        >
          {errorMessage}
        </Alert>
      );
    }
    return null;
  };

  if (localStorage.getItem("username")) {
    navigate("/", { replace: true });
  }

  return (
    <>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter username"
            onChange={(e) => setUserName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group>
        <Button
          variant="outline-success"
          // type="submit"
          onClick={() => setShowRegister(true)}
        >
          Register
        </Button>
        <Button
          className="ms-2"
          variant="primary"
          type="submit"
          onClick={handleSubmit}
        >
          Login
        </Button>
      </Form>
      <AlertMessage></AlertMessage>
      <RegisterModal
        show={showRegister}
        onHide={() => {
          setShowRegister(false);
        }}
      ></RegisterModal>
    </>
    // <div className={styles.login}>
    //   <h1>Please Log In</h1>
    //   <form onSubmit={handleSubmit} className={styles.login}>
    //     <label>
    //       <p>Username</p>
    //       <input type="text" onChange={(e) => setUserName(e.target.value)} />
    //     </label>
    //     <label>
    //       <p>Password</p>
    //       <input
    //         type="password"
    //         onChange={(e) => setPassword(e.target.value)}
    //       />
    //     </label>
    //     <div>
    //       <button type="submit">Submit</button>
    //     </div>
    //   </form>
    // </div>
  );
};

export default Login;

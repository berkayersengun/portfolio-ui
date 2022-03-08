import React, { useState } from "react";
import Axios from "../services/axios2";
import styles from "./login.module.css";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { minToMillisec } from "../utils/common";

const Login = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  let from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    let axios = new Axios();
    axios
      .login({
        username,
        password,
      })
      .then((response) => {
        const userInfo = JSON.stringify({
          username: username,
          token: response.data.token,
        });
        Cookies.set("userInfo", userInfo, {
          expires: 7,
        });
        setLoggedIn(true);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(JSON.stringify(error.response.data));
        } else {
          setErrorMessage(error.message);
        }
        setTimeout(() => {
          setErrorMessage();
        }, minToMillisec(0.2));
      });
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
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
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
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
      <AlertMessage></AlertMessage>
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

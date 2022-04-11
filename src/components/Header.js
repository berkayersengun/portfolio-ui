import React from "react";
import {
  Nav,
  Button,
  Navbar,
  NavDropdown,
  Form,
  FormControl,
  Container,
} from "react-bootstrap";
import { HOLDING_TYPE } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import styles from "./header.module.css";
import "./header.css";
import { logout } from "../utils/common";

function Header({ type, setType, setExpanded, timerId }) {
  const navigate = useNavigate();

  const handleSelect = (eventKey, event) => {
    setExpanded({ open: {} });
    setType(eventKey);
  };

  return (
    <>
      <Navbar expand="lg">
        <Navbar.Brand>Portofino</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-between">
          <Nav
            defaultActiveKey={HOLDING_TYPE.TOTAL}
            onSelect={handleSelect}
            className={`me-auto my-2 my-lg-0 `}
            // style={{ maxHeight: "200px" }}
            navbarScroll
            variant="tabs"
            activeKey={type}
          >
            <Nav.Link className={styles.tab} eventKey={HOLDING_TYPE.TOTAL}>
              Total
            </Nav.Link>
            <Nav.Link className={styles.tab} eventKey={HOLDING_TYPE.CRYPTO}>
              Crypto
            </Nav.Link>
            <Nav.Link className={styles.tab} eventKey={HOLDING_TYPE.STOCK}>
              Stocks
            </Nav.Link>
          </Nav>
          <Container fluid className="d-flex justify-content-end">
            <Form className="d-flex">
              {/* <Navbar.Brand> {type.toUpperCase()}</Navbar.Brand> */}
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button className="me-2" variant="outline-secondary">
                Search
              </Button>
            </Form>
            <Nav onSelect={(eventKey) => logout(navigate, timerId)}>
              <NavDropdown
                className={styles.username}
                title={localStorage.getItem("username")}
                id="navbarScrollingDropdown"
              >
                <NavDropdown.Item eventKey="logout">Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Container>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default Header;

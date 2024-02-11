import React from "react";
import {
  Nav,
  Navbar,
  NavDropdown,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { HOLDING_TYPE, TAB } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import styles from "./header.module.css";
import "./header.css";
import { logout } from "../utils/common";

function Header({
  type,
  setType,
  setExpanded,
  setPage,
  page,
  timerId,
  setTimerId,
  currencyList,
  setPortfolio,
  setLoading,
}) {
  const navigate = useNavigate();

  const handleOnSelect = (eventKey) => {
    if (currencyList.includes(eventKey)) {
      localStorage.setItem("currency", eventKey);
      setTimerId(0);
    } else if (eventKey === "logout") {
      logout(navigate, timerId, setPortfolio, setLoading);
    }
  };

  const handleChange = (val) => {
    setType(val);
    setExpanded({ open: {} });
  };

  function getCurrencyList() {
    return currencyList.map((currency, i) => {
      return (
        <NavDropdown.Item key={i} eventKey={currency}>
          {currency}
        </NavDropdown.Item>
      );
    });
  }

  return (
    <>
      <Navbar expand="lg">
        <Navbar.Brand>Portofino</Navbar.Brand>
        <ToggleButtonGroup
          className={styles.toggles}
          type="radio"
          value={type}
          onChange={handleChange}
          name="types"
          size="md"
        >
          <ToggleButton
            className={styles.button}
            id="holdingTotal"
            value={HOLDING_TYPE.TOTAL}
            variant="outline-secondary"
          >
            Total
          </ToggleButton>
          <ToggleButton
            className={styles.button}
            id="holdingStock"
            value={HOLDING_TYPE.STOCK}
            variant="outline-secondary"
          >
            Stocks
          </ToggleButton>
          <ToggleButton
            className={styles.button}
            id="holdingCrypto"
            value={HOLDING_TYPE.CRYPTO}
            variant="outline-secondary"
          >
            Crypto
          </ToggleButton>

          {page === TAB.CHART ? (
            <ToggleButton
              className={styles.button}
              id="holdingAll"
              value={"all"}
              variant="outline-secondary"
            >
              All
            </ToggleButton>
          ) : (
            ""
          )}
        </ToggleButtonGroup>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-between">
          <Nav
            defaultActiveKey={HOLDING_TYPE.TOTAL}
            onSelect={(selectedKey) => setPage(selectedKey)}
            className={`me-auto my-2 my-lg-0 `}
            // style={{ maxHeight: "200px" }}
            navbarScroll
            variant="pills"
            activeKey={page}
          >
            <Nav.Link className={styles.tab} eventKey={TAB.LIST}>
              List
            </Nav.Link>
            <Nav.Link className={styles.tab} eventKey={TAB.CHART}>
              Chart
            </Nav.Link>
          </Nav>
          <Container fluid className="d-flex justify-content-end">
            {/* <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button className="me-2" variant="outline-secondary">
                Search
              </Button>
            </Form> */}
            <Nav onSelect={handleOnSelect}>
              <NavDropdown
                className={styles.username}
                title={localStorage.getItem("currency")}
                id="navbarScrollingDropdown"
              >
                {getCurrencyList()}
              </NavDropdown>
              <NavDropdown
                className={styles.username}
                title={localStorage.getItem("username") || "Anonymous"}
                id="navbarScrollingDropdown"
              >
                <NavDropdown.Item disabled>
                  {localStorage.getItem("userCurrency")}
                </NavDropdown.Item>
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

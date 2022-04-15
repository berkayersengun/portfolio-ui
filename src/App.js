import "./App.css";
import Header from "./components/Header";
import HoldingTable from "./components/HoldingTable";
import Overview from "./components/Overview";
import React, { useState, useEffect } from "react";
import { HOLDING_TYPE } from "./utils/constants";
import { minToMillisec, logout } from "./utils/common";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Axios from "./services/axios";
import { Modal, Button } from "react-bootstrap";

function App() {
  const navigate = useNavigate();
  const [type, setType] = useState(HOLDING_TYPE.TOTAL);
  const [holdingsData, setholdingsData] = useState([]);
  const [errorModalState, setErrorModalState] = useState({
    isError: false,
    message: "",
  });
  const [loginInfo, setLoginInfo] = useState({
    timerId: -1,
    loading: true,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [expanded, setExpanded] = useState({ open: {} });
  const [portfolio, setPortfolio] = useState({
    holdings_data: [],
    overview: {
      current: {
        crypto: 0,
        stock: 0,
        total: 0,
      },
      capital: {
        crypto: 0,
        stock: 0,
        total: 0,
      },
      purchase: {
        crypto: 0,
        stock: 0,
        total: 0,
      },
      change_purchase: {
        crypto: {
          value: 0,
          percentage: 0,
        },
        stock: {
          value: 0,
          percentage: 0,
        },
        total: {
          value: 0,
          percentage: 0,
        },
      },
      change_capital: {
        crypto: {
          value: 0,
          percentage: 0,
        },
        stock: {
          value: 0,
          percentage: 0,
        },
        total: {
          value: 0,
          percentage: 0,
        },
      },
      change_daily: {
        crypto: {
          value: 0,
          percentage: 0,
        },
        stock: {
          value: 0,
          percentage: 0,
        },
        total: {
          value: 0,
          percentage: 0,
        },
      },
    },
    currency: "EUR",
    user: "",
  });

  const ErrorModal = ({ show, handleClose, errorMessage }) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Connection Lost</Modal.Title>
      </Modal.Header>
      <Modal.Body>{errorMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const fetchPort = async () => {
    try {
      const response = await new Axios().fetchPortfolio();
      setPortfolio(response.data);
    } catch (error) {
      let message = "";
      if (error.response && error.response.data) {
        message = JSON.stringify(error.response.data);
      } else {
        message = error.message;
      }
      setErrorModalState({
        isError: true,
        message: message,
      });
      console.log(message);
    }
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login", { replace: true });
    }
    if ((loginInfo.timerId === -1 || loginInfo.timerId === 0) && username) {
      fetchPort().then((response) => {
        let intervalId = setInterval(fetchPort, minToMillisec(2));
        setLoginInfo({
          timerId: intervalId,
          loading: false,
        });
      });
    }
    return () => {
      if (loginInfo.timerId !== 0) {
        clearInterval(loginInfo.timerId);
      }
    };
  }, [loginInfo.timerId]);

  useEffect(() => {
    if (showAddModal || errorModalState.isError) {
      clearInterval(loginInfo.timerId);
    }
  }, [showAddModal, errorModalState.isError]);

  useEffect(() => {
    if (type !== HOLDING_TYPE.TOTAL) {
      setholdingsData(
        portfolio.holdings_data.filter((holding) => holding.type === type)
      );
    } else {
      const holdings = Object.values(portfolio.holdings_data).flatMap(
        (holding) => holding
      );
      setholdingsData(holdings);
    }
  }, [type, portfolio.holdings_data]);

  const Main = () => {
    return (
      <>
        <Header
          type={type}
          setType={setType}
          setExpanded={setExpanded}
          timerId={loginInfo.timerId}
        ></Header>
        <Overview
          type={type}
          portfolio={portfolio}
          loginInfo={loginInfo}
          setLoginInfo={setLoginInfo}
        ></Overview>
        <HoldingTable
          holdingsData={holdingsData}
          expanded={expanded}
          setExpanded={setExpanded}
          loginInfo={loginInfo}
          setLoginInfo={setLoginInfo}
        ></HoldingTable>
        <ErrorModal
          show={errorModalState.isError}
          handleClose={() =>
            logout(navigate, loginInfo.timerId, setErrorModalState)
          }
          errorMessage={errorModalState.message}
        ></ErrorModal>
      </>
    );
  };

  // TODO create layout component wrap below
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login setLoginInfo={setLoginInfo} loginInfo={loginInfo} />}
      />
      <Route path="/" element={<Main />} />
    </Routes>
  );
}

export default App;

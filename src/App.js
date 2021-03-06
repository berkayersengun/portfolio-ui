import "./App.css";
import Header from "./components/Header";
import HoldingTable from "./components/HoldingTable";
import Overview from "./components/Overview";
import React, { useState, useEffect } from "react";
import { HOLDING_TYPE, SORT_DIRECTION, PORT_INITIAL } from "./utils/constants";
import { minToMillisec, logout, sort } from "./utils/common";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Axios from "./services/axios";
import { Modal, Button } from "react-bootstrap";

function App() {
  const navigate = useNavigate();
  const [type, setType] = useState(HOLDING_TYPE.TOTAL);
  const [holdingsData, setHoldingsData] = useState([]);
  const [errorModalState, setErrorModalState] = useState({
    isError: false,
    message: "",
  });
  // timerId
  // timerId: -1 -> initial state, before any user logged in
  // timerId: 0 -> to refresh timer, after user logged in
  const [loginInfo, setLoginInfo] = useState({
    timerId: -1,
    loading: true,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [expanded, setExpanded] = useState({ open: {} });
  const [portfolio, setPortfolio] = useState(PORT_INITIAL);
  const [sortConfig, setSortConfig] = useState({
    column: {
      key: ["average", "value", "current"],
      label: "Holdings Value",
    },
  });

  const ErrorModal = ({
    show,
    handleClose,
    handleCloseLogout,
    errorMessage,
  }) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Connection Lost</Modal.Title>
      </Modal.Header>
      <Modal.Body>{errorMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={handleClose}>
          Close
        </Button>
        <Button variant="danger" onClick={handleCloseLogout}>
          Logout
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
        const errorData = error.response.data;
        if (
          errorData.refresh &&
          errorData.refresh[0] === "This field may not be null."
        ) {
          logout(navigate, loginInfo.timerId, setErrorModalState);
        }
        message = JSON.stringify(errorData);
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

  const startInterval = () => {
    let intervalId = setInterval(fetchPort, minToMillisec(2));
    setLoginInfo({
      timerId: intervalId,
      loading: false,
    });
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login", { replace: true });
    }
    if ((loginInfo.timerId === -1 || loginInfo.timerId === 0) && username) {
      fetchPort().then(() => startInterval());
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
    let holdings = [];
    if (type !== HOLDING_TYPE.TOTAL) {
      holdings = portfolio.holdings_data.filter(
        (holding) => holding.type === type
      );
    } else {
      holdings = portfolio.holdings_data;
    }
    const sorted = sort(holdings, sortConfig.column.key, sortConfig.direction);
    setHoldingsData(sorted);
  }, [type, portfolio.holdings_data, sortConfig]);

  const handleClose = (setLoginInfo, loginInfo, setErrorModalState) => () => {
    setErrorModalState({
      isError: false,
      message: "",
    });
    setLoginInfo({ ...loginInfo, timerId: 0 });
  };

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
          setSortConfig={setSortConfig}
          sortConfig={sortConfig}
        ></HoldingTable>
        <ErrorModal
          show={errorModalState.isError}
          handleClose={handleClose(setLoginInfo, loginInfo, setErrorModalState)} //retry in case connection lost temporarly
          handleCloseLogout={() =>
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

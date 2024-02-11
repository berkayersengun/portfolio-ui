import "./App.css";
import Header from "./components/Header";
import HoldingTable from "./components/HoldingTable";
import Overview from "./components/Overview";
import DeleteModal from "./components/DeleteModal";
import React, { useState, useEffect } from "react";
import {
  HOLDING_TYPE,
  PORT_INITIAL,
  TAB,
  HIST_PARAMS,
} from "./utils/constants";
import { minToMillisec, logout, sort } from "./utils/common";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Axios from "./services/axios";
import { Modal, Button } from "react-bootstrap";
import Chart from "./components/Chart";
import Popup from "./components/Popup";

function App() {
  const INTERVAL = 2;
  const navigate = useNavigate();
  const [type, setType] = useState(HOLDING_TYPE.TOTAL);
  const [page, setPage] = useState(TAB.LIST);
  const [range, setRange] = useState(HIST_PARAMS["1Y"]);

  const [holdingsData, setHoldingsData] = useState([]);
  const [errorModalState, setErrorModalState] = useState({
    isError: false,
    message: "",
  });
  // timerId
  // timerId: -1 -> initial state, before any user logged in
  // timerId: 0 -> to refresh timer, after user logged in
  const [timerId, setTimerId] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expanded, setExpanded] = useState({ open: {} });
  const [portfolio, setPortfolio] = useState(PORT_INITIAL);
  const [sortConfig, setSortConfig] = useState({
    column: {
      key: ["average", "value", "current"],
      label: "Holdings Value",
    },
  });
  const [currencyList, setCurrencyList] = useState([]);
  const [popups, setPopups] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    entities: [],
  });

  const popupOnClose = (popup) => (event) => {
    const popupsEdited = popups.filter((item) => item !== popup);
    setPopups(popupsEdited);
    setTimerId(0);
  };

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

  const fetchPort = async (ignore) => {
    try {
      let currency = localStorage.getItem("currency");
      const response = await new Axios().fetchPortfolio(currency);
      if (!ignore) {
        setPortfolio(response.data);
        setLoading(false);
      }
    } catch (error) {
      let message = "";
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (
          errorData.refresh &&
          errorData.refresh[0] === "This field may not be null."
        ) {
          logout(
            navigate,
            timerId,
            setPortfolio,
            setLoading,
            setErrorModalState
          );
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
    let intervalId = setInterval(fetchPort, minToMillisec(INTERVAL));
    setTimerId(intervalId);
  };

  const fetchCurrencyList = async () => {
    const response = await new Axios().getCurrencyList();
    setCurrencyList(response.data);
  };

  useEffect(() => {
    let ignore = false;
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login", { replace: true });
    }
    if ((timerId === -1 || timerId === 0) && username) {
      fetchCurrencyList();
      fetchPort(ignore).then(() => startInterval());
    }
    return () => {
      if (timerId !== 0) {
        clearInterval(timerId);
      }
      ignore = true;
    };
  }, [timerId]);

  useEffect(() => {
    switch (page) {
      case TAB.LIST:
        if (type === "all") {
          setType(HOLDING_TYPE.TOTAL);
        }
        startInterval();
        break;
      case TAB.CHART:
        clearInterval(timerId);
        break;
      default:
        break;
    }
  }, [page]);

  useEffect(() => {
    if (showAddModal || errorModalState.isError) {
      clearInterval(timerId);
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

  const handleClose = (setTimerId, setErrorModalState) => () => {
    setErrorModalState({
      isError: false,
      message: "",
    });
    setTimerId(0);
  };

  const Main = () => {
    let bodyComponent = {};
    switch (page) {
      case TAB.LIST:
        bodyComponent = (
          <>
            <HoldingTable
              {...{
                holdingsData,
                expanded,
                setExpanded,
                timerId,
                setTimerId,
                setSortConfig,
                sortConfig,
                showAddModal,
                setShowAddModal,
                deleteModal,
                setDeleteModal,
              }}
            ></HoldingTable>
          </>
        );
        break;
      case TAB.CHART:
        bodyComponent = <Chart {...{ type, setRange, range }}></Chart>;
        break;
      default:
        break;
    }

    return (
      <>
        <Header
          {...{
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
          }}
        ></Header>
        <Overview
          {...{ type, portfolio, timerId, setTimerId, loading }}
        ></Overview>
        {bodyComponent}
        <ErrorModal
          show={errorModalState.isError}
          handleClose={handleClose(setTimerId, setErrorModalState)} //retry in case connection lost temporarly
          handleCloseLogout={() => {
            logout(
              navigate,
              timerId,
              setPortfolio,
              setLoading,
              setErrorModalState
            );
          }}
          errorMessage={errorModalState.message}
        ></ErrorModal>
        <Popup {...{ popups, popupOnClose }}></Popup>
        <DeleteModal
          {...{
            deleteModal,
            setDeleteModal,
            popups,
            setPopups,
            setTimerId,
          }}
        ></DeleteModal>
      </>
    );
  };

  // TODO create layout component wrap below
  return (
    <Routes>
      <Route path="/login" element={<Login setTimerId={setTimerId} />} />
      <Route path="/" element={<Main />} />
    </Routes>
  );
}

export default App;

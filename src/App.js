import "./App.css";
import Header from "./components/Header";
import HoldingTable from "./components/HoldingTable";
import Overview from "./components/Overview";
import React, { useState, useEffect } from "react";
import { HOLDING_TYPE } from "./utils/constants";
import { minToMillisec, removeCookie } from "./utils/common";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Axios from "./services/axios";
import { Modal, Button } from "react-bootstrap";
import Cookies from "js-cookie";

function App() {
  const navigate = useNavigate();
  const [type, setType] = useState(HOLDING_TYPE.TOTAL);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    timerId: 0,
    username: "",
    loading: true,
  });
  const [holdingsData, setholdingsData] = useState([]);
  const [errorModalState, setErrorModalState] = useState({
    isError: false,
    message: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [timerState, setTimerState] = useState("");
  const [expanded, setExpanded] = useState({ open: {} });
  const [errorMessage, setErrorMessage] = useState("");
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
  });

  function waitForTimeout(seconds) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Hello World");
        resolve();
      }, seconds * 1000);
    });
  }

  const logout = (timerId) => {
    if (timerId && timerId !== 0) {
      clearInterval(timerId);
    }
    setErrorModalState({
      isError: false,
      message: "",
    });
    removeCookie("userInfo");
    navigate("/login");
  };

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

  const fetchPort = async (userInfo) => {
    const axios = new Axios(userInfo.token);
    try {
      const response = await axios.fetchPortfolio();
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

    // setUserInfo({ ...userInfo, loading: false });
  };

  useEffect(() => {
    const cookie = Cookies.get("userInfo");
    let timerId = 0;
    if (cookie || timerState) {
      const userInfo = JSON.parse(Cookies.get("userInfo"));
      // timerId = setInterval(fetchPort, minToMillisec(0.2), userInfo);
      fetchPort(userInfo).then((response) => {
        timerId = setInterval(fetchPort, minToMillisec(2), userInfo);
        setUserInfo({
          username: userInfo.username,
          loading: false,
          timerId: timerId,
        });
      });
    } else {
      logout(timerId);
    }
    return () => {
      if (timerId !== 0) {
        clearInterval(timerId);
      }
    };
  }, [loggedIn, timerState]);

  useEffect(() => {
    if (showAddModal || errorModalState.isError) {
      clearInterval(userInfo.timerId);
    }
    // if (errorModalState.isError) {
    //   logout(userInfo.timerId);
    // }
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
    // if (!Cookies.get("userInfo")) {
    //   navigate("/login", { replace: true });
    // }
    return (
      <>
        <Header
          type={type}
          setType={setType}
          setUserInfo={setUserInfo}
          username={userInfo.username}
          setExpanded={setExpanded}
        ></Header>
        <Overview
          type={type}
          portfolio={portfolio}
          loadingState={userInfo.loading}
          timerId={userInfo.timerId}
          setTimerState={setTimerState}
        ></Overview>
        <HoldingTable
          holdingsData={holdingsData}
          expanded={expanded}
          setExpanded={setExpanded}
          timerId={userInfo.timerId}
          setTimerState={setTimerState}
        ></HoldingTable>
        <ErrorModal
          show={errorModalState.isError}
          handleClose={() => logout(userInfo.timerId)}
          errorMessage={errorModalState.message}
        ></ErrorModal>
      </>
    );
  };

  // TODO create layout component wrap below
  return (
    <Routes>
      <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
      <Route path="/" element={<Main />} />
    </Routes>
  );
}

const getMockHoldings = () => {
  const data = {};

  const holdingsData = [];

  const apple = {};
  apple.no = "1";
  apple.price = "100.000";
  apple.holdings = 2;
  apple.symbol = "AAPL";
  apple.exchange = "NASDAQ";
  apple.name = "Apple";
  apple.priceChange = "-2.3100";
  apple.priceChangePercent = "-1.2692%";
  apple.holdingsValue = apple.holdings * apple.price;
  apple.type = HOLDING_TYPE.STOCK;
  holdingsData.push(apple);

  const tesla = {};
  tesla.no = "2";
  tesla.price = "1000.0000";
  tesla.holdings = 1;
  tesla.symbol = "TSLA";
  tesla.exchange = "NASDAQ";
  tesla.name = "Tesla";
  tesla.priceChange = "80.3100";
  tesla.priceChangePercent = "-10.2692%";
  tesla.holdingsValue = tesla.holdings * tesla.price;
  tesla.type = HOLDING_TYPE.STOCK;
  holdingsData.push(tesla);

  const amd = {};
  amd.no = "3";
  amd.price = "10.0000";
  amd.holdings = 5;
  amd.symbol = "AMD";
  amd.exchange = "NASDAQ";
  amd.name = "Amd";
  amd.priceChange = "10.3100";
  amd.priceChangePercent = "-110.2692%";
  amd.holdingsValue = amd.holdings * amd.price;
  amd.type = HOLDING_TYPE.STOCK;
  holdingsData.push(amd);

  const btc = {};
  btc.no = "4";
  btc.price = "100.000";
  btc.holdings = 2;
  btc.symbol = "btc";
  btc.exchange = "kraken";
  btc.name = "btc";
  btc.priceChange = "-2.3100";
  btc.priceChangePercent = "-1.2692%";
  btc.holdingsValue = btc.holdings * btc.price;
  btc.type = HOLDING_TYPE.CRYPTO;
  holdingsData.push(btc);

  const sol = {};
  sol.no = "5";
  sol.price = "1000.0000";
  sol.holdings = 3;
  sol.symbol = "sol";
  sol.exchange = "kraken";
  sol.name = "sol";
  sol.priceChange = "80.3100";
  sol.priceChangePercent = "-10.2692%";
  sol.holdingsValue = sol.holdings * sol.price;
  sol.type = HOLDING_TYPE.CRYPTO;
  holdingsData.push(sol);

  data.holdingsData = holdingsData;

  const capital = {};
  capital[HOLDING_TYPE.CRYPTO] = 1000;
  capital[HOLDING_TYPE.STOCK] = 2000;
  capital[HOLDING_TYPE.TOTAL] = 3000;
  data.capital = capital;

  data.currentTotal = {};
  data.currentTotal[HOLDING_TYPE.STOCK] = getCurrentTotalStock(holdingsData);
  data.currentTotal[HOLDING_TYPE.CRYPTO] = getCurrentTotalCrypto(holdingsData);
  data.currentTotal[HOLDING_TYPE.TOTAL] =
    data.currentTotal[HOLDING_TYPE.STOCK] +
    data.currentTotal[HOLDING_TYPE.CRYPTO];

  return data;
};

const getCurrentTotalStock = (holdingsData) => {
  return holdingsData
    .filter((holding) => holding.type === HOLDING_TYPE.STOCK)
    .reduce((a, b) => a + b.holdingsValue, 0);
};
const getCurrentTotalCrypto = (holdingsData) => {
  return holdingsData
    .filter((holding) => holding.type === HOLDING_TYPE.CRYPTO)
    .reduce((a, b) => a + b.holdingsValue, 0);
};

export default App;

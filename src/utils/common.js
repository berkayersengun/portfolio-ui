import { CURRENCY } from "../utils/constants";
import Axios from "../services/axios";

export const getCurrencySymbol = (currency = "EUR") =>
  CURRENCY[currency].symbol;

const between = (x, min, max) => {
  return x >= min && x <= max;
};

export const round = (number) => {
  let decimalPoint;

  if (Math.floor(number) === number) {
    decimalPoint = 2;
  } else if (between(number, 0, 0.01) || between(number, -0.01, 0)) {
    decimalPoint = 6;
  } else if (between(number, 1, 10) || between(number, -10, -1)) {
    decimalPoint = 2;
  } else {
    decimalPoint = 2;
  }
  const rounded = Math.round(number * Math.pow(10, 10)) / Math.pow(10, 10);
  return rounded.toFixed(decimalPoint);
};

export const minToMillisec = (minutes) => minutes * 60000;

export const getStyleForChange = (percentage) => {
  const upArrow = "\u2191";
  const downArrow = "\u2193";
  const leftRightArrow = "\u21CC";
  const style = {
    colorindicator: { color: "" },
    minusPlus: " ",
    arrow: leftRightArrow,
  };
  if (percentage < 0) {
    style.colorindicator = { color: "red" };
    style.arrow = downArrow;
  } else if (percentage === 0) {
    style.colorindicator = { color: "dimgray" };
  } else {
    style.colorindicator = { color: "green" };
    style.minusPlus = " +";
    style.arrow = upArrow;
  }
  return style;
};

export const logout = (navigate, timerId, setErrorModalState) => {
  new Axios()
    .logout()
    .then((response) => {
      if (setErrorModalState) {
        setErrorModalState({
          isError: false,
          message: "",
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  localStorage.clear();
  clearInterval(timerId);
  navigate("/login");
};

function waitForTimeout(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Hello World");
      resolve();
    }, seconds * 1000);
  });
}

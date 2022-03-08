import { CURRENCY } from "../utils/constants";
import Cookies from "js-cookie";

export const getCurrencySymbol = (currency = "EUR") =>
  CURRENCY[currency].symbol;

const between = (x, min, max) => {
  return x >= min && x <= max;
};

export const round = (number) => {
  let decimal;

  if (Math.floor(number) === number) {
    decimal = 2;
  } else if (between(number, 0, 0.01) || between(number, -0.01, 0)) {
    decimal = 10;
  } else if (between(number, 1, 10) || between(number, -10, -1)) {
    decimal = 2;
  } else {
    decimal = 10;
  }
  const decimalPoints = Math.pow(10, decimal);
  return Math.round(number * decimalPoints) / decimalPoints;
};

export const minToMillisec = (minutes) => minutes * 60000;

export const removeCookie = (name, path = "/") => {
  if (Cookies.get(name)) {
    Cookies.remove(name, { path: path });
  }
};
export const getCookie = (name, path = "/") => {
  if (Cookies.get(name)) {
    Cookies.remove(name, { path: path });
  }
};

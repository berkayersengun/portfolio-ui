import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import {
  faEnvelope,
  faChevronRight,
  faChevronLeft,
  faChevronDown,
  faCaretLeft,
  faCaretDown,
  faCaretRight,
  faPenToSquare,
  faCheck,
  faCaretUp,
  faTrashCan,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(
  faEnvelope,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faCaretLeft,
  faCaretDown,
  faCaretUp,
  faCaretRight,
  faPenToSquare,
  faCheck,
  faTrashCan,
  faTrash
);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

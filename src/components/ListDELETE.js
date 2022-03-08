import React, { useState, useEffect } from "react";
import { Button, Table, Accordion, Container, Card } from "react-bootstrap";
import HoldingModal from "./HoldingModal";
import { getCurrencySymbol } from "../utils/common";
import { CURRENCY } from "../utils/constants";
import { logDOM } from "@testing-library/react";
import {
  DataGridPro,
  gridColumnVisibilityModelSelector,
  GridEvents,
  useGridApiRef,
} from "@mui/x-data-grid-pro";
import { useTable, useExpanded } from "react-table";
import styles from "./list.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// nfn: named function
const Acc = (second) => {
  return (
    <>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Accordion Item #1</Accordion.Header>
          <Accordion.Body>
            amet, consectetur adipiscing elit, sed do
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Accordion Item #2</Accordion.Header>
          <Accordion.Body>
            pariat culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default function List({ holdingsData, username, setHoldingAdded }) {
  const [modalShow, setModalShow] = useState(false);
  const [expanded, setExpanded] = useState({ open: {} });
  const [holding, setHolding] = useState({
    // quantity: 0,
    // symbol: "",
    currency: CURRENCY.EUR.value,
  });
  // const handleSubmit = () => {
  //   setTimeout(() => {
  //     setModalShow(false);
  //   }, 5000000);
  // };
  // const [holdingsList, setHoldingsList] = useState([]);
  // const [globalQuote, setGlobalQuote] = useState([]);

  // useEffect(() => {
  //   const timer = setInterval(setGlobalQuote, 1000, globalQuote);
  //   return () => clearInterval(timer);
  // }, []);

  // let callb = (current) => setCurrent(current);
  // let callb = (quote) => console.log(quote.c);
  // const a = ax.sendGetRequest(
  //   "1JBZ8ND4M6KA5DEP",
  //   "GLOBAL_QUOTE",
  //   "AAPL",
  //   callb
  // );
  // // React Hook useEffect has a missing dependency: 'ax'. Either include it or remove the dependency array
  // useEffect(() => {
  //   const timer = setInterval(
  //     ax.sendGetRequest.bind(ax),
  //     100000,
  //     "1JBZ8ND4M6KA5DEP",
  //     "GLOBAL_QUOTE",
  //     "AAPL",
  //     callb
  //   );
  //   return () => clearInterval(timer);
  // }, []);
  // const [count, setCount] = useState(0);
  // useEffect(() => {
  //   // Update the document title using the browser API
  //   document.title = `You clicked ${count} times`;
  // });
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     ax.fetchCurrentPrice("BTC", callb);
  //   }, 20000);
  //   return () => clearInterval(interval);
  // }, []);

  const handleAdd = () => {
    setModalShow(true);
  };

  const Arrow = ({ rowNo, isEntity }) => {
    const rigthArrow = "\uF22D";
    const downArrow = "\uF229";
    if (isEntity) {
      return <></>;
    }
    if (expanded.open[rowNo]) {
      return <FontAwesomeIcon icon="caret-down" />;
    }
    return <FontAwesomeIcon icon="caret-right" />;
  };

  const handleRowClick = (entities, rowNo) => (event) => {
    setExpanded({
      open: { ...expanded.open, [rowNo]: !expanded.open[rowNo] },
      rowNo: rowNo,
    });
  };

  const EachRow = ({ row: holding, rowNo, isEntity }) => {
    // const st = isEntity ? styles.entities : {};
    // const lastRow = isEntity ? "2" : "1";
    let firstRow = (
      <td className={styles.arrow} onClick={handleRowClick(holding, rowNo)}>
        <Arrow rowNo={rowNo} isEntity={isEntity}></Arrow>
      </td>
    );
    let colspan = 1;
    let leftPadding = "";
    let rightAlign = "";
    if (isEntity) {
      leftPadding = "ps-3";
      colspan = 2;
      firstRow = null;
      rightAlign = "text-center";
    }

    return (
      <tr>
        {firstRow}
        <td colSpan={colspan} className={`${leftPadding} ${rightAlign}`}>
          {rowNo}
        </td>
        <td className={leftPadding}>{holding["symbol"]}</td>
        <td className={leftPadding}>{holding.exchange}</td>
        <td className={leftPadding}>{holding.name}</td>
        <td className={leftPadding}>
          {getCurrencySymbol(holding.currency)}
          {Number(holding.price.purchase)}
        </td>
        <td className={leftPadding}>
          {getCurrencySymbol(holding.currency)}
          {Number(holding.price.current)}
        </td>
        <td className={leftPadding}>
          {getCurrencySymbol(holding.currency)}
          {holding.change_24H.value}
        </td>
        <td className={leftPadding}>{holding.change_24H.percentage}%</td>
        <td className={leftPadding}>{holding.quantity}</td>

        <td className={leftPadding}>
          {getCurrencySymbol(holding.currency)}
          {holding.gain.value}
        </td>
        <td className={leftPadding}>{holding.gain.percentage}%</td>
        <td className={leftPadding}>
          {getCurrencySymbol(holding.currency)}
          {Number(holding.value.current)}
        </td>
      </tr>
    );
  };

  const Entities = ({ data: entities }) => {
    return entities.map((entity, subIndex) => {
      return (
        <EachRow
          key={`subIndex${subIndex}`}
          rowNo={subIndex + 1}
          row={entity}
          isEntity
        ></EachRow>
      );
    });
  };

  const TableBody = ({ holdingsData }) => {
    const data = holdingsData.map((holdingData, index) => {
      if (expanded.open[index + 1]) {
        return (
          <React.Fragment key={`entity${index}`}>
            <EachRow rowNo={index + 1} row={holdingData.average}></EachRow>
            <td colSpan="13" className="pt-2 border-bottom border-dark"></td>
            <Entities data={holdingData.entities}></Entities>
            <td colSpan="13" className="pb-2"></td>
          </React.Fragment>
        );
      }

      return (
        <EachRow
          key={`index${index}`}
          rowNo={index + 1}
          row={holdingData.average}
        ></EachRow>
      );
    });
    return data;
  };

  return (
    <>
      <Table className={styles.table} striped bordered hover size="sm">
        <thead>
          <tr>
            <th colSpan={2} className="text-center">
              #
            </th>
            <th>Symbol</th>
            <th>Exchange</th>
            <th>Stock Name</th>
            <th>Purchase Price</th>
            <th>Current Price</th>
            <th>Price Change 24H</th>
            <th>% Change 24H</th>
            <th>Quantity</th>
            <th>Total Gain</th>
            <th>% Total Gain</th>
            <th>Holdings Value</th>
          </tr>
        </thead>
        <tbody>
          <TableBody holdingsData={holdingsData}></TableBody>
        </tbody>
      </Table>
      <Button
        className="p-2"
        style={{ width: "85px", marginLeft: "10px" }}
        variant="outline-secondary"
        onClick={handleAdd}
      >
        ADD
      </Button>
      <HoldingModal
        holding={holding}
        setHolding={setHolding}
        show={modalShow}
        onHide={() => {
          setHoldingAdded(Date.now());
          setModalShow(false);
          setHolding({ currency: CURRENCY.EUR.value });
          console.log(holding);
        }}
      ></HoldingModal>
    </>
  );
}

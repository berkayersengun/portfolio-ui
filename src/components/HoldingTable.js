import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import HoldingModal from "./HoldingModal";
import { CURRENCY } from "../utils/constants";
import styles from "./holdingTable.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCurrencySymbol, getStyleForChange } from "../utils/common";

// nfn: named function

export default function HoldingTable({
  holdingsData,
  expanded,
  setExpanded,
  loginInfo,
  setLoginInfo,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [holding, setHolding] = useState({
    currency: CURRENCY.EUR.value,
  });

  const handleAdd = () => {
    setShowAddModal(true);
    clearInterval(loginInfo.timerId);
  };

  const Arrow = ({ rowNo }) => {
    if (expanded.open[rowNo]) {
      return <FontAwesomeIcon icon="caret-down" />;
    }
    return <FontAwesomeIcon icon="caret-right" />;
  };

  const handleRowClick = (rowNo) => (event) => {
    setExpanded({
      open: { ...expanded.open, [rowNo]: !expanded.open[rowNo] },
      rowNo: rowNo,
    });
  };

  const EachRow = ({ row: holding, rowNo, isEntity }) => {
    let firstRow = (
      <td className={styles.arrow} onClick={handleRowClick(rowNo)}>
        <Arrow rowNo={rowNo}></Arrow>
      </td>
    );
    let colspan = 1;
    let cellPadding = "";
    let rightAlign = "";
    let rowStyle;
    if (isEntity) {
      cellPadding = `ps-3 ${styles.row}`;
      colspan = 2;
      firstRow = null;
      rightAlign = "text-center";
      rowStyle = styles.row;
    }

    return (
      <tr className={rowStyle}>
        {firstRow}
        <td colSpan={colspan} className={`${cellPadding} ${rightAlign}`}>
          {rowNo}
        </td>
        <td className={cellPadding}>{holding["symbol"]}</td>
        <td className={cellPadding}>{holding.exchange}</td>
        <td className={cellPadding}>{holding.name}</td>
        <td className={cellPadding}>
          {getCurrencySymbol(holding.currency)}
          {Number(holding.price.purchase).toLocaleString()}
        </td>
        <td
          className={cellPadding}
          style={getStyleForChange(holding.gain.percentage).colorindicator}
        >
          {getCurrencySymbol(holding.currency)}
          {Number(holding.price.current).toLocaleString()}
        </td>
        <td
          className={cellPadding}
          style={
            getStyleForChange(holding.change_24H.percentage).colorindicator
          }
        >
          {getCurrencySymbol(holding.currency)}
          {holding.change_24H.value.toLocaleString()}
        </td>
        <td
          className={cellPadding}
          style={
            getStyleForChange(holding.change_24H.percentage).colorindicator
          }
        >
          {holding.change_24H.percentage.toLocaleString()}%
        </td>
        <td className={cellPadding}>{holding.quantity.toLocaleString()}</td>
        <td
          className={cellPadding}
          style={getStyleForChange(holding.gain.percentage).colorindicator}
        >
          {getCurrencySymbol(holding.currency)}
          {holding.gain.value.toLocaleString()}
        </td>
        <td
          className={cellPadding}
          style={getStyleForChange(holding.gain.percentage).colorindicator}
        >
          {holding.gain.percentage.toLocaleString()}%
        </td>
        <td className={cellPadding}>
          {getCurrencySymbol(holding.currency)}
          {Number(holding.value.current).toLocaleString()}
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

  const TableBody = ({ holdingsData, expanded }) => {
    const data = holdingsData.map((holdingData, index) => {
      if (expanded.open[index + 1]) {
        return (
          <React.Fragment key={`entity${index}`}>
            <EachRow rowNo={index + 1} row={holdingData.average}></EachRow>
            <tr>
              <td colSpan="13" className="pt-2 border-bottom border-dark"></td>
            </tr>
            <Entities data={holdingData.entities}></Entities>
            <tr>
              <td colSpan="13" className="pb-2"></td>
            </tr>
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
          <TableBody
            holdingsData={holdingsData}
            expanded={expanded}
          ></TableBody>
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
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
          setHolding({ currency: CURRENCY.EUR.value });
          setLoginInfo({ ...loginInfo, timerId: 0 });
        }}
      ></HoldingModal>
    </>
  );
}

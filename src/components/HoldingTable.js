import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import HoldingModal from "./HoldingModal";
import { SORT_DIRECTION, COLUMNS } from "../utils/constants";
import styles from "./holdingTable.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getStyleForChange,
  formatPrice,
  formatPercent,
  formatQuantity,
} from "../utils/common";
import "./holdingTable.css";

const Entities = ({ data: entities, expanded, setExpanded }) => {
  return entities.map((entity, subIndex) => {
    return (
      <EachRow
        key={`subIndex${subIndex}`}
        rowNo={subIndex + 1}
        row={entity}
        isEntity
        expanded={expanded}
        setExpanded={setExpanded}
      ></EachRow>
    );
  });
};

const TableBody = ({ data, expanded, setExpanded }) => {
  return data.map((holdingData, index) => {
    if (expanded.open[index + 1]) {
      return (
        <React.Fragment key={`entity${index}`}>
          <EachRow
            rowNo={index + 1}
            row={holdingData.average}
            expanded={expanded}
            setExpanded={setExpanded}
          ></EachRow>
          <tr>
            <td colSpan="13" className="pt-2 border-bottom border-dark"></td>
          </tr>
          <Entities
            data={holdingData.entities}
            setExpanded
            expanded={expanded}
          ></Entities>
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
        expanded={expanded}
        setExpanded={setExpanded}
      ></EachRow>
    );
  });
};

const Arrow = ({ isOpen }) => {
  if (isOpen) {
    return <FontAwesomeIcon icon="caret-down" />;
  }
  return <FontAwesomeIcon icon="caret-right" />;
};

const EachRow = ({ row: holding, rowNo, isEntity, expanded, setExpanded }) => {
  const handleRowClick = (rowNo) => (event) => {
    setExpanded({
      open: { ...expanded.open, [rowNo]: !expanded.open[rowNo] },
      rowNo: rowNo,
    });
  };

  let firstRow = (
    <td className={styles.arrow} onClick={handleRowClick(rowNo)}>
      <Arrow isOpen={expanded.open[rowNo]}></Arrow>
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
        {formatPrice(holding.price.purchase, holding.currency)}
      </td>
      <td
        className={cellPadding}
        style={getStyleForChange(holding.gain.percentage).colorindicator}
      >
        {formatPrice(holding.price.current, holding.currency)}
      </td>
      <td
        className={cellPadding}
        style={getStyleForChange(holding.change_24H.percentage).colorindicator}
      >
        {formatPrice(holding.change_24H.value, holding.currency, true)}
      </td>
      <td
        className={cellPadding}
        style={getStyleForChange(holding.change_24H.percentage).colorindicator}
      >
        {formatPercent(holding.change_24H.percentage)}
      </td>
      <td className={cellPadding}>{formatQuantity(holding.quantity)}</td>
      <td
        className={cellPadding}
        style={getStyleForChange(holding.gain.percentage).colorindicator}
      >
        {formatPrice(holding.gain.value, holding.currency, true)}
      </td>
      <td
        className={cellPadding}
        style={getStyleForChange(holding.gain.percentage).colorindicator}
      >
        {formatPercent(holding.gain.percentage)}
      </td>
      <td className={cellPadding}>
        {formatPrice(holding.value.current, holding.currency)}
      </td>
    </tr>
  );
};

const SortIcon = ({ column, sortConfig }) => {
  if (column.label === sortConfig.column.label) {
    if (sortConfig.direction === SORT_DIRECTION.DESC) {
      return <FontAwesomeIcon className={styles.sorticon} icon="caret-down" />;
    } else if (sortConfig.direction === SORT_DIRECTION.ASC) {
      return <FontAwesomeIcon className={styles.sorticon} icon="caret-up" />;
    } else {
      return null;
    }
  }
  return null;
};

const ColumnButton = ({ column, sortConfig }) => (
  <Button variant="outline-secondary" size="sm" className={styles.sortbutton}>
    {column.label}
    <SortIcon column={column} sortConfig={sortConfig} />
  </Button>
);

const Columns = ({ columns, sortConfig, handleSort }) => {
  return columns.map((column) => {
    return (
      <th
        colSpan={column.label === "#" ? 2 : 1}
        key={`column-${column.label}`}
        onClick={handleSort(column, sortConfig)}
        className={`text-center`}
      >
        {column.label === "#" ? (
          column.label
        ) : (
          <ColumnButton column={column} sortConfig={sortConfig}></ColumnButton>
        )}
      </th>
    );
  });
};

// nfn: named function
export default function HoldingTable({
  holdingsData,
  expanded,
  setExpanded,
  loginInfo,
  setLoginInfo,
  sortConfig,
  setSortConfig,
  showAddModal,
  setShowAddModal,
}) {
  const [holding, setHolding] = useState({
    currency: localStorage.getItem("currency"),
  });

  const handleAdd = () => {
    setShowAddModal(true);
    clearInterval(loginInfo.timerId);
  };

  const handleSort = (column, sortConfig) => (event) => {
    let direction;
    if (
      (column === sortConfig.column && sortConfig.direction) ===
      SORT_DIRECTION.DESC
    ) {
      direction = SORT_DIRECTION.ASC;
    } else if (
      column === sortConfig.column &&
      sortConfig.direction === SORT_DIRECTION.ASC
    ) {
      direction = null;
      column = {
        key: ["average", "value", "current"],
        label: "Holdings Value",
      };
    } else {
      direction = SORT_DIRECTION.DESC;
    }

    setSortConfig({
      direction: direction,
      column: column,
    });
  };

  return (
    <>
      <Table
        className={styles.table}
        striped
        bordered
        hover
        size="sm"
        responsive
      >
        <thead>
          <tr>
            <Columns
              columns={COLUMNS}
              sortConfig={sortConfig}
              handleSort={handleSort}
            ></Columns>
          </tr>
        </thead>
        <tbody>
          <TableBody
            data={holdingsData}
            expanded={expanded}
            setExpanded={setExpanded}
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
          setHolding({ currency: localStorage.getItem("currency") });
          setLoginInfo({ ...loginInfo, timerId: 0 });
        }}
      ></HoldingModal>
    </>
  );
}

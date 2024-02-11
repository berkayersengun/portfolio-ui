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

const DeleteButton = ({ entities, deleteModal, setDeleteModal }) => {
  return (
    <Button
      size="sm"
      variant="outline-secondary"
      onClick={() =>
        setDeleteModal({ ...deleteModal, show: true, entities: entities })
      }
    >
      <FontAwesomeIcon icon="fa-solid fa-trash" />
    </Button>
  );
};

const EditButton = ({ holdingId }) => (
  <Button
    // type="submit"
    size="sm"
    variant="outline-secondary"
    // className="ms-3 py-1 px-2"
    onClick={(event) => console.log(holdingId)}
  >
    <FontAwesomeIcon icon="pen-to-square" size="xs" />
  </Button>
);

const Entities = ({
  data: entities,
  expanded,
  setExpanded,
  deleteModal,
  setDeleteModal,
}) => {
  return entities.map((entity, subIndex) => {
    return (
      <EachRow
        key={`subIndex${subIndex}`}
        rowNo={subIndex + 1}
        row={entity}
        isEntity
        expanded={expanded}
        setExpanded={setExpanded}
        entities={[entity]}
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
      ></EachRow>
    );
  });
};

const TableBody = ({
  data,
  expanded,
  setExpanded,
  deleteModal,
  setDeleteModal,
}) => {
  return data.map((holdingData, index) => {
    return (
      <React.Fragment key={`entity${index}`}>
        <EachRow
          rowNo={index + 1}
          row={holdingData.average}
          expanded={expanded}
          setExpanded={setExpanded}
          entities={holdingData.entities}
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
        ></EachRow>
        {expanded.open[index + 1] ? (
          <Entities
            data={holdingData.entities}
            setExpanded
            expanded={expanded}
            deleteModal={deleteModal}
            setDeleteModal={setDeleteModal}
          ></Entities>
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
    );
  });
};

const Arrow = ({ isOpen }) => {
  if (isOpen) {
    return <FontAwesomeIcon icon="caret-down" />;
  }
  return <FontAwesomeIcon icon="caret-right" />;
};

const EachRow = ({
  row: holding,
  rowNo,
  isEntity,
  expanded,
  setExpanded,
  entities,
  deleteModal,
  setDeleteModal,
}) => {
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
  let rowStyle = styles.firstrow;
  if (isEntity) {
    cellPadding = `ps-3 ${styles.row}`;
    colspan = 2;
    firstRow = null;
    rightAlign = "text-center";
    rowStyle = styles.row;
  }

  return (
    <tr className={`${rowStyle}`}>
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
      <td className={styles.edit}>
        {/* {isEntity ? <EditButton holdingId={holding}></EditButton> : ""} */}
        <DeleteButton
          {...{ entities, deleteModal, setDeleteModal }}
        ></DeleteButton>
        {/* {isEntity ? <DeleteButton holdingId={holding}></DeleteButton> : ""} */}
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
    let span = 1;
    if (column.label === "#" || column.label === "Value") {
      span = 2;
    }
    return (
      <th
        colSpan={span}
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
  timerId,
  setTimerId,
  sortConfig,
  setSortConfig,
  showAddModal,
  setShowAddModal,
  deleteModal,
  setDeleteModal,
}) {
  const [holding, setHolding] = useState({
    currency: localStorage.getItem("currency"),
  });

  const handleAdd = () => {
    setShowAddModal(true);
    clearInterval(timerId);
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
            deleteModal={deleteModal}
            setDeleteModal={setDeleteModal}
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
          setTimerId(0);
        }}
      ></HoldingModal>
    </>
  );
}

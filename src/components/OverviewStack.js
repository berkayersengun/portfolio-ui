import React from "react";
import styles from "./overview.module.css";
import { Col, Row, Stack } from "react-bootstrap";

const OverviewStack = ({ holdings }) => {
  holdings = {};
  holdings.initialTotal = 3250;
  holdings.currentTotal = 2000;
  const delta = holdings.currentTotal - holdings.initialTotal;
  let changePercent = (delta / holdings.initialTotal) * 100;
  changePercent = (Math.round(changePercent * 100) / 100).toFixed(2);
  const colorIndicator = { color: changePercent < 0 ? "red" : "green" };
  const minusPlus = changePercent < 0 ? " " : " +";
  const upArrow = "\u2191";
  const downArrow = "\u2193";
  const arrow = changePercent < 0 ? downArrow : upArrow;
  return (
    <Stack className="mx-auto" direction="horizontal" gap={3}>
      {/* <Row className={styles.row}> */}
      <div className={styles.col}>
        Current Total :{" "}
        <span style={colorIndicator}>
          €{holdings.currentTotal} {arrow}
        </span>
      </div>
      <div className={styles.col}>Initial Total : €{holdings.initialTotal}</div>
      {/* </Row> */}
      <div className="vr" />

      {/* <Row className={styles.row}> */}
      <div className={styles.col}>
        Change:
        <span style={colorIndicator}>
          {minusPlus}
          {delta} {arrow}
        </span>
      </div>
      <div className={styles.col}>
        Change (%):{" "}
        <span style={colorIndicator}>
          {minusPlus}
          {changePercent} {arrow}
        </span>
      </div>
      {/* </Row> */}
    </Stack>
  );
};

export default OverviewStack;

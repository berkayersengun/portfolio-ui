import React from "react";
import styles from "./overview.module.css";
import { Col, Row, Container, Spinner } from "react-bootstrap";
import { getCurrencySymbol } from "../utils/common";

const upArrow = "\u2191";
const downArrow = "\u2193";
const leftRightArrow = "\u21CC";

const LoadingComponent = () => {
  return (
    <>
      <div className={styles.spinnerWrapper}>
        <Spinner
          animation="border"
          role="status"
          className={styles.spinner}
        ></Spinner>
        {/* <span style={{ fontSize: "22px" }}>...</span> */}
      </div>
    </>
  );
};

const Type = ({ type, loadingState, currency, className }) => {
  if (loadingState) {
    return <LoadingComponent></LoadingComponent>;
  }
  return (
    <div
      className={className}
      // style={{ fontSize: "35px", textTransform: "capitalize" }}
    >
      {type} ({currency})
    </div>
  );
};

const getStyleForChange = (percentage) => {
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

const PriceView = ({ total, change }) => {
  const percentStyle = getStyleForChange(change.percentage);
  let percent = " -";
  if (total !== 0) {
    percent = (
      <>
        <span className={styles.percent}>
          {percentStyle.minusPlus}
          {change.percentage}%
        </span>
        {percentStyle.arrow}
      </>
    );
  }

  return (
    <Col style={percentStyle.colorindicator}>
      {percentStyle.minusPlus}
      {change.value}
      {percent}
    </Col>
  );
};

const dashIfEmpty = (value) => (value !== 0 ? value : "-");

const Overview = ({ type, portfolio, loadingState }) => {
  const purchaseTotal = portfolio.overview.purchase[type];
  const capitalTotal = portfolio.overview.capital[type];
  const currentTotal = portfolio.overview.current[type];
  const changeCapital = portfolio.overview.change_capital[type];
  const changePurchase = portfolio.overview.change_purchase[type];
  const changeDaily = portfolio.overview.change_daily[type];
  const changeProps = getStyleForChange(changePurchase.percentage);
  const currency = getCurrencySymbol(portfolio.currency);

  return (
    <Container fluid className="my-2 text-center">
      <Row className={`align-items-center d-flex d-sm-none`}>
        <Col>
          <Type
            type={type}
            loadingState={loadingState}
            currency={currency}
            className={styles.typeMobile}
          ></Type>
        </Col>
      </Row>
      <Row className={`${styles.row1} d-none d-sm-flex align-items-center`}>
        <Col className="border py-2" xl={6} xs={6}>
          CHANGE ({currency})
        </Col>
        <Col xl={4} xs={6} className="border py-2">
          VALUE ({currency})
        </Col>
        <Col xl={2} className="py-1">
          <Type
            type={type}
            loadingState={loadingState}
            currency={currency}
            className={styles.type}
          ></Type>
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={2}>
          <Row className={`align-self-center ${styles.row2} border`}>
            <Col className={`${styles.row2} fst-italic `} xs={12}>
              Daily
            </Col>
            <Col className={`${styles.row2} `}>
              <PriceView total={currentTotal} change={changeDaily}></PriceView>
            </Col>
          </Row>
        </Col>
        <Col xs={12} xl={2}>
          <Row className="border">
            <Col className={`${styles.row2} fst-italic`} xs={12}>
              Net
            </Col>
            <Col className={`${styles.row2} `}>
              <PriceView
                total={currentTotal}
                change={changeCapital}
              ></PriceView>
            </Col>
          </Row>
        </Col>
        <Col xs={12} xl={2}>
          <Row className="border">
            <Col className={`${styles.row2} fst-italic `} xs={12}>
              Purchase
            </Col>
            <Col className={`${styles.row2} `}>
              <PriceView
                total={purchaseTotal}
                change={changePurchase}
              ></PriceView>
            </Col>
          </Row>
        </Col>
        <Col xs={12} xl={2}>
          <Row className="border">
            <Col className={`${styles.row2} fst-italic `} xl={12} xs={5}>
              Current
            </Col>
            <Col
              style={changeProps.colorindicator}
              className={`${styles.row2} `}
              xl={12}
              xs={7}
            >
              {currentTotal} {changeProps.arrow}
            </Col>
          </Row>
        </Col>
        <Col xs={12} xl={2}>
          <Row className="border justify-content-center">
            <Col className={`${styles.row2} fst-italic `} xl={12} xs={5}>
              Purchase
            </Col>
            <Col className={`${styles.row2}`} xs={7}>
              {purchaseTotal}
            </Col>
          </Row>
        </Col>
        <Col xs={12} xl={2}>
          <Row className="border justify-content-center">
            <Col className={`${styles.row2} fst-italic `} xl={12} xs={5}>
              Capital
            </Col>
            <Col className={`${styles.row2}`} xs={7}>
              {/* <span style={{ marginLeft: "15px" }}> */}
              {/* {dashIfEmpty(` ${capitalTotal}`)} */}
              {capitalTotal}
              {/* </span> */}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Overview;

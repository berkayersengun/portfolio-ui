import React, { Fragment, useState } from "react";
import styles from "./overview.module.css";
import {
  Col,
  Row,
  Container,
  Spinner,
  Button,
  Form,
  Card,
} from "react-bootstrap";
import {
  getCurrencySymbol,
  getStyleForChange,
  formatPrice,
  formatPercent,
} from "../utils/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Axios from "../services/axios";
import { HOLDING_TYPE } from "../utils/constants";

const dashIfEmpty = (value) => (value !== 0 ? value : "-");

const CapitalField = ({
  editableCapital,
  capitalValue,
  capitalTotal,
  handleChangeNet,
  handleSubmitCapital,
  handleEditCapital,
  handleOnKeyPress,
  type,
  currency,
}) => {
  let fields = [];
  let button = (
    <Button
      variant="outline-secondary"
      className="ms-3 py-1 px-2"
      onClick={handleEditCapital}
    >
      <FontAwesomeIcon icon="pen-to-square" size="lg" />
    </Button>
  );
  if (editableCapital) {
    button = (
      <Button
        type="submit"
        variant="outline-success"
        className="ms-3 py-1 px-2"
        onClick={handleSubmitCapital}
      >
        <FontAwesomeIcon icon="check" size="lg" />
      </Button>
    );
    fields = (
      <Form className="mb-2" as={Row}>
        <FormCapital
          capitalValue={capitalValue}
          handleChangeNet={handleChangeNet}
          handleSubmitCapital={handleSubmitCapital}
          handleOnKeyPress={handleOnKeyPress}
          currency={currency}
        ></FormCapital>
      </Form>
    );
  } else {
    fields = Object.entries(capitalValue).map(([type, value], i) => (
      <Fragment key={i}>
        <Col
          className={`${styles.capitalField} ${
            i === 0 ? "text-end" : "text-start"
          }`}
          xl={6}
          md={6}
          xs={6}
        >
          <span className="fw-bold">{type}</span>:{" "}
          {formatPrice(value, currency)}
        </Col>
      </Fragment>
    ));
  }

  return (
    <Fragment>
      <Row>
        <Col className="mb-1 fs-2">
          {capitalTotal}
          {button}
        </Col>
      </Row>
      <Row>{type !== "total" && !editableCapital ? "" : fields}</Row>
    </Fragment>
  );
};

const FormCapital = ({
  capitalValue,
  handleChangeNet,
  handleOnKeyPress,
  currency,
}) => {
  return Object.entries(capitalValue).map(([type, value], i) => (
    <Form.Group key={type} as={Row} className="align-items-center">
      <Form.Label column xl="4" style={{ textTransform: "capitalize" }}>
        {`${type} (${getCurrencySymbol(currency)})`}
      </Form.Label>
      <Col xl="8">
        <Form.Control
          size="sm"
          keyname={type}
          value={value}
          onChange={handleChangeNet}
          onKeyPress={handleOnKeyPress}
          type="number"
        />
      </Col>
    </Form.Group>
  ));
};

const Overview = ({ type, portfolio, setLoginInfo, loginInfo }) => {
  if (type === "all") {
    type = HOLDING_TYPE.TOTAL;
  }
  const currency = portfolio.currency;
  const purchaseTotal = formatPrice(
    portfolio.overview.purchase[type],
    currency
  );
  const capitalTotal = formatPrice(portfolio.overview.capital[type], currency);
  const currentTotal = formatPrice(portfolio.overview.current[type], currency);

  const changeNet = portfolio.overview.change_capital[type];
  const changePurchase = portfolio.overview.change_purchase[type];
  const changeDaily = portfolio.overview.change_daily[type];
  const changeProps = getStyleForChange(changeNet.percentage);
  const [editableCapital, setEditableCapital] = useState(false);
  let { total: cap, ...capitalWithoutTotal } = portfolio.overview.capital;
  cap =
    type === "total"
      ? capitalWithoutTotal
      : { [type]: portfolio.overview.capital[type] };
  const [capitalValue, setCapitalValue] = useState(cap);
  // TODO overview renders twice when you change tabs
  const LoadingComponent = () => {
    return (
      <>
        <div>
          <Spinner animation="border" role="status"></Spinner>
        </div>
      </>
    );
  };

  const Type = ({ type, loadingState, currency, className }) => {
    let component;
    if (loadingState) {
      type = <LoadingComponent></LoadingComponent>;
    }
    component = (
      <div className={className}>
        {type} ({getCurrencySymbol(currency)})
      </div>
    );

    return component;
  };

  const handleSubmitCapital = async (event) => {
    event.preventDefault();
    setEditableCapital(!editableCapital);
    try {
      await new Axios().updateCapital(
        localStorage.getItem("username"),
        capitalValue
      );
      setLoginInfo({ ...loginInfo, timerId: 0 });
    } catch (error) {
      // TODO add this error somewhere
      console.log(error.response.data);
    }
  };

  const handleOnKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmitCapital(event);
    }
  };

  const handleEditCapital = (event) => {
    clearInterval(loginInfo.timerId);
    setEditableCapital(!editableCapital);
  };

  const handleChangeNet = (event) => {
    setCapitalValue({
      ...capitalValue,
      [event.target.attributes.keyname.value]: event.target.value,
    });
  };

  const PriceView = ({ total, change }) => {
    const percentStyle = getStyleForChange(change.percentage);
    let percent = " -";
    if (total !== 0) {
      percent = (
        <>
          <div className={styles.percent}>
            {formatPercent(change.percentage)}
            {percentStyle.arrow}
          </div>
        </>
      );
    }

    return (
      <>
        <Col
          style={percentStyle.colorindicator}
          className={styles.colPrice}
          lg={7}
          xs={7}
        >
          {formatPrice(change.value, currency, true)}
        </Col>
        <Col
          style={percentStyle.colorindicator}
          className={styles.colPercent}
          lg={5}
          xs={5}
        >
          {percent}
        </Col>
      </>
    );
  };

  const CommonRow = ({ name, styles = "" }) => {
    return (
      <Row className={`fst-italic ${styles}`}>
        <span>{name}</span>
      </Row>
    );
  };

  const Change = ({ name, total, change }) => {
    return (
      <Col as={Card} className={`${styles.row2} justify-content-center`} lg={4}>
        <CommonRow name={name}></CommonRow>
        <Row className="align-items-baseline">
          <PriceView total={total} change={change}></PriceView>
        </Row>
      </Col>
    );
  };

  const Value = ({ name, value }) => {
    return (
      <Col as={Card} className={`${styles.row2} justify-content-center`}>
        <CommonRow name={name}></CommonRow>
        <Row
          style={changeProps.colorindicator}
          className="justify-content-center"
        >
          {value}
        </Row>
      </Col>
    );
  };

  return (
    <Container fluid className="my-2 text-center">
      <Row className={`align-items-center d-flex d-xl-none`}>
        <Col as={Card}>
          <Type
            type={type}
            loadingState={loginInfo.loading}
            currency={currency}
            className={styles.typeMobile}
          ></Type>
        </Col>
      </Row>
      <Row className={`${styles.row1} d-none d-xl-flex align-items-center`}>
        <Col xl={7} as={Card}>
          CHANGE
        </Col>
        <Col as={Card} xl={3}>
          VALUE
        </Col>
        <Col xl={2} as={Card}>
          <Type
            type={type}
            loadingState={loginInfo.loading}
            currency={currency}
            className={styles.type}
          ></Type>
        </Col>
      </Row>
      <Row>
        <Col xl={7} lg={12}>
          <Row className={styles.rowDown}>
            <Change
              name="Daily"
              total={currentTotal}
              change={changeDaily}
            ></Change>
            <Change name="Net" total={currentTotal} change={changeNet}></Change>
            <Change
              name="Purchase"
              total={purchaseTotal}
              change={changePurchase}
            ></Change>
          </Row>
        </Col>
        <Col xl={3} lg={8}>
          <Row className={styles.rowDown}>
            <Value name="Current" value={currentTotal}></Value>
            <Value name="Purchase" value={purchaseTotal}></Value>
          </Row>
        </Col>
        <Col xl={2} lg={4}>
          <Row className={styles.rowDown}>
            <Col as={Card} className={`justify-content-center`}>
              <CommonRow styles={styles.row2} name="Capital"></CommonRow>
              <CapitalField
                capitalTotal={capitalTotal}
                editableCapital={editableCapital}
                capitalValue={capitalValue}
                handleChangeNet={handleChangeNet}
                handleEditCapital={handleEditCapital}
                handleSubmitCapital={handleSubmitCapital}
                handleOnKeyPress={handleOnKeyPress}
                type={type}
                currency={currency}
              ></CapitalField>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Overview;

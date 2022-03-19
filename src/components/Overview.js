import React, { Fragment, useState } from "react";
import styles from "./overview.module.css";
import { Col, Row, Container, Spinner, Button, Form } from "react-bootstrap";
import { getCurrencySymbol, getStyleForChange } from "../utils/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Axios from "../services/axios";
import Cookies from "js-cookie";

const CapitalField = ({
  editableCapital,
  capitalValue,
  capitalTotal,
  handleChangeCapital,
  handleSubmitCapital,
  handleEditCapital,
  handleOnKeyPress,
  type,
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
          handleChangeCapital={handleChangeCapital}
          handleSubmitCapital={handleSubmitCapital}
          handleOnKeyPress={handleOnKeyPress}
        ></FormCapital>
      </Form>
    );
  } else {
    fields = Object.entries(capitalValue).map(([type, value], i) => (
      <Fragment key={i}>
        <Col style={{ textTransform: "capitalize" }}>
          <span className="fw-bold">{type}</span>: {value}
        </Col>
      </Fragment>
    ));
  }

  return (
    <Fragment>
      <Row>
        <Col className="mb-2 fs-2">
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
  handleChangeCapital,
  handleOnKeyPress,
}) => {
  return Object.entries(capitalValue).map(([type, value], i) => (
    <Form.Group key={type} as={Row} className="align-items-center">
      <Form.Label column xl="4" style={{ textTransform: "capitalize" }}>
        {type}
      </Form.Label>
      <Col xl="8">
        <Form.Control
          size="sm"
          keyname={type}
          value={value}
          onChange={handleChangeCapital}
          onKeyPress={handleOnKeyPress}
          type="number"
        />
      </Col>
    </Form.Group>
  ));
};
const Overview = ({
  type,
  portfolio,
  loadingState,
  timerId,
  setTimerState,
}) => {
  const purchaseTotal = portfolio.overview.purchase[type];
  const capitalTotal = portfolio.overview.capital[type];
  const currentTotal = portfolio.overview.current[type];
  const changeCapital = portfolio.overview.change_capital[type];
  const changePurchase = portfolio.overview.change_purchase[type];
  const changeDaily = portfolio.overview.change_daily[type];
  const changeProps = getStyleForChange(changePurchase.percentage);
  const currency = getCurrencySymbol(portfolio.currency);
  const [editableCapital, setEditableCapital] = useState(false);
  let { total: cap, ...capitalWithoutTotal } = portfolio.overview.capital;
  cap =
    type === "total"
      ? capitalWithoutTotal
      : { [type]: portfolio.overview.capital[type] };
  const [capitalValue, setCapitalValue] = useState(cap);
  console.log(capitalValue);
  // TODO overview renders twice when you change tabs
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

  const handleSubmitCapital = async (event) => {
    event.preventDefault();
    setEditableCapital(!editableCapital);
    const userInfo = JSON.parse(Cookies.get("userInfo"));
    console.log(event);
    try {
      const response = await new Axios(userInfo.token).updateCapital(
        userInfo.username,
        capitalValue
      );
      setTimerState(Date.now());
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
    clearInterval(timerId);
    setEditableCapital(!editableCapital);
  };
  const handleChangeCapital = (event) => {
    setCapitalValue({
      ...capitalValue,
      [event.target.attributes.keyname.value]: event.target.value,
    });
    console.log(event);
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
      <Col className="mb-2" style={percentStyle.colorindicator}>
        {percentStyle.minusPlus}
        {change.value}
        {percent}
      </Col>
    );
  };

  const dashIfEmpty = (value) => (value !== 0 ? value : "-");

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
            <Col className={`fst-italic `} xs={12}>
              Daily
            </Col>
            <Col className="mb-3">
              <PriceView total={currentTotal} change={changeDaily}></PriceView>
            </Col>
          </Row>
        </Col>
        <Col xs={12} xl={2}>
          <Row className={`border ${styles.row2}`}>
            <Col className={`fst-italic`} xs={12}>
              Net
            </Col>
            <Col className="mb-3">
              <PriceView
                total={currentTotal}
                change={changeCapital}
              ></PriceView>
            </Col>
          </Row>
        </Col>
        <Col xs={12} xl={2}>
          <Row className={`border ${styles.row2}`}>
            <Col className={`fst-italic`} xs={12}>
              Purchase
            </Col>
            <Col className="mb-3">
              <PriceView
                total={purchaseTotal}
                change={changePurchase}
              ></PriceView>
            </Col>
          </Row>
        </Col>
        <Col xs={12} xl={2}>
          <Row className={`border ${styles.row2}`}>
            <Col className={`fst-italic`} xl={12} xs={5}>
              Current
            </Col>
            <Col
              style={changeProps.colorindicator}
              className="mb-4"
              xl={12}
              xs={7}
            >
              {currentTotal} {changeProps.arrow}
            </Col>
          </Row>
        </Col>
        <Col xs={12} xl={2}>
          <Row className={`border justify-content-center ${styles.row2}`}>
            <Col className={`fst-italic`} xl={12} xs={5}>
              Purchase
            </Col>
            <Col xs={7} className="mb-4">
              {purchaseTotal}
            </Col>
          </Row>
        </Col>
        <Col xs={12} xl={2} className="border">
          <Row className={`justify-content-center ${styles.row2}`}>
            <Col className={`fst-italic`} xl={12} xs={5}>
              Capital
            </Col>
          </Row>
          {/* <Col xs={7} className="mb-2"> */}
          {/* <span style={{ marginLeft: "15px" }}> */}
          {/* {dashIfEmpty(` ${capitalTotal}`)} */}
          {/* </span> */}
          <CapitalField
            capitalTotal={capitalTotal}
            editableCapital={editableCapital}
            capitalValue={capitalValue}
            handleChangeCapital={handleChangeCapital}
            handleEditCapital={handleEditCapital}
            handleSubmitCapital={handleSubmitCapital}
            handleOnKeyPress={handleOnKeyPress}
            type={type}
          ></CapitalField>
          {/* </Col> */}
        </Col>
      </Row>
    </Container>
  );
};

export default Overview;

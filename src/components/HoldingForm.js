import React, { useState, useEffect } from "react";
import { Form, InputGroup, Button, Modal } from "react-bootstrap";
import Axios from "../services/axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { CURRENCY } from "../utils/constants";

function HoldingForm({ onHide }) {
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const loading = open && options.length === 0;
  const [holdingType, setHoldingType] = useState("");
  const [validated, setValidated] = useState(false);
  const [validation, setValidation] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [holding, setHolding] = useState({ currency: CURRENCY.EUR.value });

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleSubmitSearch = (event) => {
    search(searchValue);
  };

  const handleOnKeyPress = (event) => {
    if (event.key === "Enter") {
      search(searchValue);
    }
  };

  const handleSelectSymbol = (event, value) => {
    if (event.type === "click") {
      setHolding({ ...holding, ["symbol"]: value.value });
      if (value.type === "Cryptocurrency") {
        setHoldingType("Cryptocurrency");
      } else {
        setHoldingType("Stock");
      }
    }
  };

  // - add validation for each form field
  // - check updated values for reset timers in each update works properly

  const handleSubmitAddHolding = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    let key = "";
    if (event.target.type === "radio") {
      key = event.target.attributes.name.value.toLowerCase();
    } else {
      key = event.target.attributes.keyname.value.toLowerCase();
    }
    setHolding({ ...holding, [key]: event.target.value });
  };

  const search = async (symbol) => {
    try {
      const response = await new Axios().search(symbol);
      setOptions(
        response.data.map((a) => {
          const name = a.shortname || a.longname;
          return {
            value: a.symbol,
            label: `${a.symbol} : ${name} : ${a.exchDisp}`,
            type: a.typeDisp,
          };
        })
      );
      setOpen(true);
    } catch (error) {
      // TODO add this error somewhere
      console.log(error.response.data);
    }
  };
  const handleSubmitData = (event) => {
    // debugger;
    if (holding.quantity && holding.quantity > 0) {
      setValidation("123");
      // console.log(validation);
    } else {
      setValidation({
        ...validation,
        quantity: false,
        // ["isFormValid"]: false,
      });
      // console.log(validation);
    }

    if (holding.symbol) {
      setValidation({ ...validation, symbol: true });
    } else {
      setValidation({
        ...validation,
        symbol: false,
        // ["isFormValid"]: false,
      });
    }
    new Axios()
      .addHolding(holding)
      .then((response) => {
        onHide();
        setHolding({ currency: CURRENCY.EUR.value });
      })
      .catch((error) => {
        setErrorMessage(error.response.data);
      });

    // console.log(validation);
    // console.log(holding);
    // if (validation.action && validation.type && validation.quantity) {

    // } else {
    //   event.preventDefault();
    //   alert("empty");
    // }
  };

  return (
    <Modal.Body>
      <Form>
        <Form.Group className="mb-3" controlId="symbolselect">
          <Form.Label>Asset</Form.Label>
          <Autocomplete
            id="free-solo-demo"
            onChange={handleSelectSymbol}
            onInputChange={(event, newInputValue) => {
              setSearchValue(newInputValue);
            }}
            freeSolo
            options={options}
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
              setOptions([]);
            }}
            renderInput={(params) => {
              return (
                <>
                  <TextField
                    // error
                    {...params}
                    onKeyPress={handleOnKeyPress}
                    InputProps={{
                      ...params.InputProps,
                      data: "symbol",
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            value={searchValue}
                            aria-label="add to shopping cart"
                            onClick={handleSubmitSearch}
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    label="Search with symbols..."
                  ></TextField>
                </>
              );
            }}
          />
        </Form.Group>
        <InputGroup disabled className="mb-3">
          <InputGroup.Text id="basic-addon1">Type</InputGroup.Text>
          <Form.Control
            disabled
            placeholder={holdingType}
            aria-label="holdingtype"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
        <Form.Label>Quantity</Form.Label>
        <InputGroup hasValidation className="mb-3">
          <Form.Control
            // isValid={isQuantityValid}
            // isInvalid={!validation.quantity}
            required
            placeholder="Enter Quantity"
            onChange={handleSubmitAddHolding}
            type="number"
            keyname="quantity"
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid quantity.
          </Form.Control.Feedback>
          <Form.Text className="text-muted"></Form.Text>
        </InputGroup>
        <Form.Group className="mb-3">
          <Form.Label>Currency</Form.Label>
          <Form.Select
            aria-label="Default select example"
            onChange={handleSubmitAddHolding}
            keyname="currency"
          >
            {Object.values(CURRENCY).map((currency, i) => (
              <option key={i}>{currency.value}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Purchase Price</Form.Label>
          <Form.Control
            // isValid={isQuantityValid}
            // isInvalid={!validation.quantity}
            // required
            placeholder="Enter purchase price"
            onChange={handleSubmitAddHolding}
            type="number"
            keyname="purchase_price"
          />
          {/* <Form.Control.Feedback type="invalid">
          Please provide a valid quantity.
        </Form.Control.Feedback> */}
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Purchase Date</Form.Label>
          <Form.Control
            type="datetime-local"
            placeholder="Date"
            defaultValue={new Date().toISOString().substring(0, 16)}
            keyname="date"
            onChange={handleSubmitAddHolding}
          />
        </Form.Group>
        <Modal.Footer>
          {Object.entries(errorMessage).map(([k, v], i) => (
            <div key={i}>
              {k}: {v}
            </div>
          ))}
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitData}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal.Body>
  );
}

export default HoldingForm;

// import DeGiro from "degiro-api";
const DeGiro = require("degiro-api").default;
// import DeGiro, { DeGiroEnums, DeGiroTypes } from "degiro-api";

const { DeGiroTypes } = require("degiro-api");
const { DeGiroEnums } = require("degiro-api");
const { PORTFOLIO_POSITIONS_TYPE_ENUM } = DeGiroEnums;

// import DeGiro, { DeGiroEnums, DeGiroTypes } from "degiro-api";

// Basic degiro init
const degiro = new DeGiro({
  username: "berkayersengun",
  pwd: "*****",
});

// or creating with the static create method
// const degiro = DeGiro.create({ username: "*****", pwd: "*****" });

// or create with env credentials
// const degiro = new DeGiro(); // <-- Use DEGIRO_USER & DEGIRO_PWD
async function f() {
  await degiro.login();

  const portfolio = await degiro.getPortfolio({
    type: PORTFOLIO_POSITIONS_TYPE_ENUM.ALL,
    getProductDetails: true,
  });
  console.log(JSON.stringify(portfolio, null, 2));
}

f();

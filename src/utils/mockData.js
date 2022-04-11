const getMockHoldings = () => {
  const data = {};

  const holdingsData = [];

  const apple = {};
  apple.no = "1";
  apple.price = "100.000";
  apple.holdings = 2;
  apple.symbol = "AAPL";
  apple.exchange = "NASDAQ";
  apple.name = "Apple";
  apple.priceChange = "-2.3100";
  apple.priceChangePercent = "-1.2692%";
  apple.holdingsValue = apple.holdings * apple.price;
  apple.type = HOLDING_TYPE.STOCK;
  holdingsData.push(apple);

  const tesla = {};
  tesla.no = "2";
  tesla.price = "1000.0000";
  tesla.holdings = 1;
  tesla.symbol = "TSLA";
  tesla.exchange = "NASDAQ";
  tesla.name = "Tesla";
  tesla.priceChange = "80.3100";
  tesla.priceChangePercent = "-10.2692%";
  tesla.holdingsValue = tesla.holdings * tesla.price;
  tesla.type = HOLDING_TYPE.STOCK;
  holdingsData.push(tesla);

  const amd = {};
  amd.no = "3";
  amd.price = "10.0000";
  amd.holdings = 5;
  amd.symbol = "AMD";
  amd.exchange = "NASDAQ";
  amd.name = "Amd";
  amd.priceChange = "10.3100";
  amd.priceChangePercent = "-110.2692%";
  amd.holdingsValue = amd.holdings * amd.price;
  amd.type = HOLDING_TYPE.STOCK;
  holdingsData.push(amd);

  const btc = {};
  btc.no = "4";
  btc.price = "100.000";
  btc.holdings = 2;
  btc.symbol = "btc";
  btc.exchange = "kraken";
  btc.name = "btc";
  btc.priceChange = "-2.3100";
  btc.priceChangePercent = "-1.2692%";
  btc.holdingsValue = btc.holdings * btc.price;
  btc.type = HOLDING_TYPE.CRYPTO;
  holdingsData.push(btc);

  const sol = {};
  sol.no = "5";
  sol.price = "1000.0000";
  sol.holdings = 3;
  sol.symbol = "sol";
  sol.exchange = "kraken";
  sol.name = "sol";
  sol.priceChange = "80.3100";
  sol.priceChangePercent = "-10.2692%";
  sol.holdingsValue = sol.holdings * sol.price;
  sol.type = HOLDING_TYPE.CRYPTO;
  holdingsData.push(sol);

  data.holdingsData = holdingsData;

  const capital = {};
  capital[HOLDING_TYPE.CRYPTO] = 1000;
  capital[HOLDING_TYPE.STOCK] = 2000;
  capital[HOLDING_TYPE.TOTAL] = 3000;
  data.capital = capital;

  data.currentTotal = {};
  data.currentTotal[HOLDING_TYPE.STOCK] = getCurrentTotalStock(holdingsData);
  data.currentTotal[HOLDING_TYPE.CRYPTO] = getCurrentTotalCrypto(holdingsData);
  data.currentTotal[HOLDING_TYPE.TOTAL] =
    data.currentTotal[HOLDING_TYPE.STOCK] +
    data.currentTotal[HOLDING_TYPE.CRYPTO];

  return data;
};

const getCurrentTotalStock = (holdingsData) => {
  return holdingsData
    .filter((holding) => holding.type === HOLDING_TYPE.STOCK)
    .reduce((a, b) => a + b.holdingsValue, 0);
};
const getCurrentTotalCrypto = (holdingsData) => {
  return holdingsData
    .filter((holding) => holding.type === HOLDING_TYPE.CRYPTO)
    .reduce((a, b) => a + b.holdingsValue, 0);
};

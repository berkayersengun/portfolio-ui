export const HOLDING_TYPE = {
  CRYPTO: "crypto",
  STOCK: "stock",
  TOTAL: "total",
};

export const CHART_COLORS = {
  crypto: "rgb(53, 162, 235)",
  stock: "rgb(255, 99, 132)",
  total: "rgb(76, 175, 80)",
};

export const TAB = {
  LIST: "list",
  CHART: "chart",
};

export const CURRENCY = {
  EUR: {
    value: "EUR",
    symbol: "€",
  },
  USD: {
    value: "USD",
    symbol: "$",
  },
};

export const SORT_DIRECTION = {
  ASC: "ASC",
  DESC: "DESC",
};

// initial states
export const PORT_INITIAL = {
  holdings_data: [],
  overview: {
    current: {
      crypto: 0,
      stock: 0,
      total: 0,
    },
    capital: {
      crypto: 0,
      stock: 0,
      total: 0,
    },
    purchase: {
      crypto: 0,
      stock: 0,
      total: 0,
    },
    change_purchase: {
      crypto: {
        value: 0,
        percentage: 0,
      },
      stock: {
        value: 0,
        percentage: 0,
      },
      total: {
        value: 0,
        percentage: 0,
      },
    },
    change_capital: {
      crypto: {
        value: 0,
        percentage: 0,
      },
      stock: {
        value: 0,
        percentage: 0,
      },
      total: {
        value: 0,
        percentage: 0,
      },
    },
    change_daily: {
      crypto: {
        value: 0,
        percentage: 0,
      },
      stock: {
        value: 0,
        percentage: 0,
      },
      total: {
        value: 0,
        percentage: 0,
      },
    },
  },
  currency: "EUR",
  user: "",
};

export const COLUMNS = [
  {
    key: ["id"],
    label: "#",
  },
  {
    key: ["symbol"],
    label: "Symbol",
  },
  {
    key: ["exchange"],
    label: "Exchange",
  },
  {
    key: ["name"],
    label: "Stock Name",
  },
  {
    key: ["average", "price", "purchase"],
    label: "Purchase Price",
  },
  {
    key: ["average", "price", "current"],
    label: "Current Price",
  },
  {
    key: ["average", "change_24H", "value"],
    label: "Change 24H",
  },
  {
    key: ["average", "change_24H", "percentage"],
    label: "Change 24H %",
  },
  {
    key: ["average", "quantity"],
    label: "Quantity",
  },
  {
    key: ["average", "gain", "value"],
    label: "Total Gain",
  },
  {
    key: ["average", "gain", "percentage"],
    label: "Total Gain %",
  },
  {
    key: ["average", "value", "current"],
    label: "Value",
  },
];

export const HIST_PARAMS = {
  "1D": "1d",
  "1W": "1w",
  "1M": "1m",
  "6M": "6m",
  YTD: "ytd",
  "1Y": "1y",
  "5Y": "5y",
  MAX: "max",
};

export const HIST_PARAMS1 = {
  "1D": {
    range: "1d",
    interval: "1m",
  },
  "5D": {
    range: "5d",
    interval: "15m",
  },
  "1MO": {
    range: "1mo",
    interval: "30m",
  },
  "6MO": {
    range: "6mo",
    interval: "1d",
  },
  YTD: {
    range: "ytd",
    interval: "1d",
  },
  "1Y": {
    range: "1y",
    interval: "1d",
  },
  "5Y": {
    range: "5y",
    interval: "1wk",
  },
  MAX: {
    range: "max",
    interval: "1wk",
  },
};

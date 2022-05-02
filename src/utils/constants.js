export const HOLDING_TYPE = {
  CRYPTO: "crypto",
  STOCK: "stock",
  TOTAL: "total",
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

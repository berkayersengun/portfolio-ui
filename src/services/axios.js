import axios from "axios";

class Axios {
  constructor(host) {
    this.host = host;
  }

  get hostUrl() {
    return this.host;
  }

  //   get(symbol) {
  //     return this.fetchCurrentPrice(symbol);
  //   }

  buildUriTicker(key, func, symbol) {
    const path = "/query?";
    const paramsObj = {
      apikey: key,
      function: func,
      symbol: symbol,
    };
    let searchParams = new URLSearchParams(paramsObj);

    const btcUsdUri = new URL(path, this.host);
    return btcUsdUri + searchParams.toString();
  }
  async sendGetRequest(key, func, symbol, callback) {
    try {
      const resp = await axios.get(this.buildUriTicker(key, func, symbol));
      const globalQuote = resp.data["Global Quote"];
      const price = globalQuote && globalQuote["05. price"];
      if (price) {
        callback(price);
      }
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  }
}

export default Axios;

// const Axios = {
//   host: "https://www.alphavantage.co",
//   sendGetRequest: async (key, func, symbol) => {
//     try {
//       const resp = await axios.get(Axios.buildUriTicker(key, func, symbol));
//       console.log(resp.data);
//       return resp.data;
//     } catch (err) {
//       // Handle Error Here
//       console.error(err);
//     }
//   },

//   buildUriTicker: (key, func, symbol) => {
//     const path = "/query?";
//     const paramsObj = {
//       apikey: key,
//       function: func,
//       symbol: symbol,
//     };
//     let searchParams = new URLSearchParams(paramsObj);

//     const btcUsdUri = new URL(path, Axios.host);
//     return btcUsdUri + searchParams.toString();
//   },
// };

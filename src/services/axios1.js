import axios from "axios";
// import { ApiClient, DefaultApi } from "finnhub";
// const finnhub = require("finnhub");

class Axios1 {
  constructor(host) {
    this.host = host;
  }

  get hostUrl() {
    return this.host;
  }

  get clientHost() {
    const response = "";
    // console.log(this.host);
    return this.host;
    // axios
    //     .get(this.host)
    //     .then(response => {
    //         console.log(response.data)
    //     })
  }

  get(symbol) {
    return this.fetchCurrentPrice(symbol);
  }

  buildUriTicker(symbol) {
    const path = "/query?";
    let paramsObj = {
      function: "GLOBAL_QUOTE",
      symbol: symbol,
      apikey: "demo",
    };
    let searchParams = new URLSearchParams(paramsObj);

    const btcUsdUri = new URL(path, this.host);
    return btcUsdUri + searchParams.toString();
  }
  // fetchCurrentPrice(currency, callback) {
  //   const api_key = ApiClient.instance.authentications["api_key"];
  //   api_key.apiKey = "c75pceiad3i9kvgaqhi0";
  //   const finnhubClient = new DefaultApi();
  //   finnhubClient.quote(currency, (error, data, response) => {
  //     console.log(data);
  //     callback(data.c);
  //     // console.log(response.body);
  //   });
  // }
}

// const axiosClient = new Axios1("https://www.alphavantage.co");

// // console.log(axiosClient.get("IBM")); // 100

// // Since DOM elements <a> cannot receive activeClassName
// // and partiallyActive, destructure the prop here and
// // pass it only to GatsbyLink

export default Axios1;

// // finnhubClient.cryptoExchanges((error, data, response) => {
// //   console.log(data);
// // });

// // finnhubClient.cryptoSymbols("BINANCE", (error, data, response) => {
// //   console.log(data);
// // });

// finnhubClient.stockSymbols("US", (error, data, response) => {
//   console.log(error);
// });
// finnhubClient.symbolSearch("AAPL", (error, data, response) => {
//   console.log(data);
// });

import axios from "axios";
import Cookies from "js-cookie";

class Axios {
  constructor(token) {
    // this.host = host;
    // this.host = "http://192.168.1.5:8001/";
    // this.host = process.env.REACT_APP_DJANGO_URL || "http://localhost:8000";
    if (process.env.NODE_ENV === "development") {
      this.host = "http://localhost:8000";
      // this.host = "http://192.168.1.5:8001";
    }
    if (process.env.NODE_ENV === "production") {
      this.host = "api/";
    }
    // if (window.location.origin === "http://localhost:3000") {
    //   axios.defaults.baseURL = "http://127.0.0.1:8000";
    // } else {
    //   axios.defaults.baseURL = window.location.origin;
    // }

    this.instance = axios.create({ baseURL: this.host });
    // console.log(this.instance);
    // Tuesday, 22 March 2022 at 08:55:37
    this.instance.defaults.headers.get["Content-Type"] = "application/json";
    this.instance.defaults.headers.post["Content-Type"] = "application/json";
    if (token) {
      this.instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  }

  get hostUrl() {
    return this.host;
  }

  async login({ username, password }) {
    const body = JSON.stringify({
      username: username,
      password: password,
    });

    // return this.instance.post("/token/", body);
    const response = await this.instance.post("/token/", body);
    this.instance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`;
    // var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
    // const userInfo = JSON.stringify({
    //   username: username,
    //   token: response.data.token,
    // });
    // Cookies.set("userInfo", userInfo, {
    //   expires: 7,
    // });
    return response;
  }

  async fetchPortfolio() {
    // const response = await axios.get("/v1/test");
    // console.log(response);
    return this.instance.get(`/v1/portfolio/`);
  }

  addHolding(body) {
    // try {
    return this.instance.post("/v1/holdings", body);
    // return response.data;
    // return [];
    // } catch (err) {
    // Handle Error Here
    // return err.response;
    // }
  }

  search(sym) {
    // const body = JSON.stringify({
    //   username: username,
    //   password: password,
    // });
    //     const paramsObj = {
    //       apikey: key,
    //       function: func,
    //       symbol: symbol,
    //     };
    //     let searchParams = new URLSearchParams(paramsObj);
    return this.instance.get("/v1/search/", {
      params: { symbol: sym },
    });
  }

  addUser(body) {
    return this.instance.post("/v1/accounts", body);
  }

  updateCapital(user, body) {
    return this.instance.patch(`/v1/capitals/${user}`, body);
  }

  async getHoldings() {
    // const body = JSON.stringify({
    //   username: username,
    //   password: password,
    // });
    try {
      const response = await this.instance.get("/v1/holdings?user=sevim");
      return [];
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  }
  // async getAssets() {
  //   try {
  //     const response = await this.instance.get("/v1/assets?symbol=tsla");
  //     return response.data;
  //   } catch (err) {
  //     // Handle Error Here
  //     console.error(err);
  //   }
  // }
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

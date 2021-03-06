import axios from "axios";

class Axios {
  constructor() {
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
    this.instance.defaults.headers.get["Content-Type"] = "application/json";
    this.instance.defaults.headers.post["Content-Type"] = "application/json";
    // allows sending httpOnly cookies back to backend
    this.instance.defaults.withCredentials = true;

    this.instance.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      async function (error) {
        // do not intercept if it is a login or refresh call (infinite loop since it will intercept the refresh call)
        if (
          error.response.status === 401 &&
          !error.config.url.includes("refresh") &&
          !error.config.url.includes("login")
        ) {
          await new Axios().refreshToken(); // refresh token
          return axios(error.config); // send originial request again
        }

        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
      }
    );
  }

  get hostUrl() {
    return this.host;
  }

  async login({ username, password }) {
    const body = JSON.stringify({
      username: username,
      password: password,
    });
    return await this.instance.post("auth/login/", body);
  }

  async logout() {
    return await this.instance.post("auth/logout/");
  }

  async refreshToken() {
    const body = JSON.stringify({});
    const response = await this.instance.post("auth/token/refresh/", body);
    return response;
  }

  async fetchPortfolio() {
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

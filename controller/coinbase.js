const axios = require("axios");
const crypto = require("crypto");

/* Coinbase API address */
const API = "https://api.pro.coinbase.com";


/**
 * Get all coinbase account list
 *
 * @returns coinbase accounts
 */
exports.getAccounts = async () => {
  try {
    const axiosInstance = createAxios("GET", "/accounts", "");
    const response = await axiosInstance.get("/accounts");
    return response.data;
  } catch (err) {
    console.log(err);
  }

  //Return null if request fails
  return null;
};

/**
 * Get all coinbase products
 *
 * @returns coinbase products
 */
exports.getProducts = async () => {
  try {
    const axiosInstance = createAxios("GET", "/products", "");
    const response = await axiosInstance.get("/products");
    return response.data;
  } catch (err) {
    console.log(err);
  }

  //Return null if request fails
  return null;
};

exports.placeOrder = async (orderData) => {
  try {
    const data = orderData;

    const axiosInstance = createAxios("POST", "/orders", data);
    const response = await axiosInstance.post("/orders", data);
    if (response.status === 200) {
      console.log(
        `${response.data.created_at} - success ${orderData.side} ${orderData.product_id} for ${orderData.funds}`
      );
      return response.data;
    } else {
      console.log(response.data);
    }
  } catch (error) {
    console.log(error.data);
  }

  //Return null if request fails
  return null;
};

/**
 *
 * Create axios object with signed header for the coinbase api
 *
 * @param {string} method GET or POST
 * @param {string} endpoint API endpoint address
 * @param {object} body data params for api call
 * @returns  instance of axios object
 */
const createAxios = (method, endpoint, body) => {
  /* Coinbase API key */
  const KEY = process.env.KEY;
  /* Coinbase SECRET */
  const SECRET = process.env.SECRET;
  /* Coinbase PASSPHRASE */
  const PASS = process.env.PASS;

  const timestamp = Date.now() / 1000;

  //If passed data object then stringify
  body = typeof body === "object" ? JSON.stringify(body) : "";

  // create the prehash string by concatenating required parts
  const what = timestamp + method + endpoint + body;

  // Create buffer object from secret
  const bufferSecret = Buffer.from(SECRET, "base64");

  // create a sha256 hmac with the secret
  const hmac = crypto.createHmac("sha256", bufferSecret);

  // sign the require message with the hmac
  // and finally base64 encode the result
  const sign = hmac.update(what, "utf-8").digest("base64");

  const instance = axios.create({
    baseURL: API,
    timeout: 1000,
    headers: {
      "CB-ACCESS-KEY": KEY,
      "CB-ACCESS-SIGN": sign,
      "CB-ACCESS-TIMESTAMP": timestamp,
      "CB-ACCESS-PASSPHRASE": PASS,
    },
  });

  return instance;
};

/*** DELETE THIS METHODS ******/

// /**
//  *
//  * @returns get btc price in eur in last tick
//  */
// exports.getBtcEurPrice = async () => {
//     try {
//         const axiosInstance = createAxios('GET', '/products/BTC-EUR/ticker', '');
//         const response = await axiosInstance.get('/products/BTC-EUR/ticker');
//         if (response.status === 200) {
//             return response.data.price;
//         }
//     } catch (error) {
//         console.log(error);
//     }

//     //Return null if request fails
//     return null;
// }

// /**
//  *
//  * @param {float} funds amount of eur
//  * @returns
//  */
// exports.buyBtcForEur = async (funds) => {
//     try {
//         const data = {
//             type: 'market',
//             side: 'buy',
//             product_id: 'BTC-EUR',
//             funds: funds
//         };

//         const axiosInstance = createAxios('POST', '/orders', data);
//         const response = await axiosInstance.post('/orders', data);
//         if (response.status === 200) {
//             console.log(`${response.data.created_at} - successfuly bought ${response.data.filled_size} BTC for ${funds} EUR`)
//             return response.data;
//         }

//     } catch (error) {
//         console.log(error.data);
//     }

//     //Return null if request fails
//     return null;

// }

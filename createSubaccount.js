/**
 * @author Bit2Me
 * @dev Create a subaccount in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');

const PATH = process.env.END_SUBACCOUNT;

//! Change this to create your subaccount
const body = {
  "email" : "",
  "name" : "",
  "surname" : "",
  "phone" : {
    "number" : "000000000",
    "countryCode" : "34"
  }
}

const createSubaccount = async () => {
  try {
    const response = await axios.post(
      `${process.env.SERVER}${PATH}`,
      body,
      getAuthHeaders(PATH, "", body)
    );

    console.log(response.data);
  }
  catch(e) {
    console.error(e.response.data)
    console.log("\n> Send reqId to Bit2Me team to debug it :)")
  }
}

createSubaccount()

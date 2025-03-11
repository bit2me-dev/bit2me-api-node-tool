/**
 * @author Bit2Me
 * @dev Get TOTP for a subaccount in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');

const PATH = process.env.END_2FA;

const args = process.argv.slice(2);
if(args.length < 1){
    console.error("Usage: npm run get-totp <subaccount-id>")
    process.exit(1);
}

const subaccount = args[0];
const body = { 'subaccountUserId': subaccount }

const getTOTP = async () => {
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

getTOTP()

/**
 * @author Bit2Me
 * @dev Set TOTP for a subaccount in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');

const PATH = process.env.END_2FA;

const args = process.argv.slice(2);
if(args.length < 2){
    console.error("Usage: npm run set-2fa <subaccount-id> <TOTP>")
    process.exit(1);
}

const body = {
    'subaccountUserId': args[0],
    'totp': args[1]
}

const setTOTP = async () => {
  try {
    const response = await axios.put(
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

setTOTP()

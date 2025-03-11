/**
 * @author Bit2Me
 * @dev List subaccounts for a main account in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');

const PATH = process.env.END_SUBACCOUNT;

const listSubaccounts = async () => {
    try {
        const response = await axios.get(
            `${process.env.SERVER}${PATH}`,
            getAuthHeaders(PATH)
        );
        console.log(JSON.stringify(response.data, null, 2));
    }
    catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
    }
}

listSubaccounts()

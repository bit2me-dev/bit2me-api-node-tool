/**
 * @author Bit2Me
 * @dev Get tx in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('../bit2me_logic/utils');

const PATH = process.env.END_WALLET_TX;

const getTx = async (tx, subaccount = "") => {
    try {
        const response = await axios.get(
            `${process.env.SERVER}${PATH}${tx}`,
            getAuthHeaders(`${PATH}${tx}`, subaccount)
        );
        return response.data;
    }
    catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
    }
}

module.exports = { getTx }

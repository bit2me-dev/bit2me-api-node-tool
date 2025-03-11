/**
 * @author Bit2Me
 * @dev Get pocket in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('../bit2me_logic/utils');

const PATH = process.env.END_POCKET;

const getPocket = async (currency, subaccount = "") => {
    try {
        const response = await axios.get(
            `${process.env.SERVER}${PATH}`,
            getAuthHeaders(PATH, subaccount)
        );
        return (currency) ? response.data.filter(item => item.currency === currency) : response.data;
    }
    catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
    }
}

module.exports = { getPocket }
